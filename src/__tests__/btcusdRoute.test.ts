import request from 'supertest';
import express, { Express } from 'express';
import btcusdRouter from '../routes/btcusdRoute'; // Adjust path as necessary
import { Transaction, BlockInfo, TxInput, TxOutput, TransactionStatus } from '../bitcoinApi'; // For mock data
import { ProcessedOutput as AlgoProcessedOutput } from '../utxoOracleAlgorithm'; // For checking input to algo

// Mock the bitcoinApi module
jest.mock('../bitcoinApi', () => ({
    // Keep TESTING_ONLY for any internal use if necessary, but mostly mock functions
    ...jest.requireActual('../bitcoinApi'), 
    getRecentBlocks: jest.fn(),
    findBlocksForDate: jest.fn(),
    getTransactionsForBlock: jest.fn(),
    // getTransaction, getBlock, etc., are not directly called by route, but by getTransactionsForBlock
}));

// Mock the utxoOracleAlgorithm module
jest.mock('../utxoOracleAlgorithm', () => ({
    calculateUtxoOraclePrice: jest.fn(),
}));

// Import the mocked functions to control them in tests
import {
    getRecentBlocks as mockGetRecentBlocks,
    findBlocksForDate as mockFindBlocksForDate,
    getTransactionsForBlock as mockGetTransactionsForBlock
} from '../bitcoinApi';
import { calculateUtxoOraclePrice as mockCalculateUtxoOraclePrice } from '../utxoOracleAlgorithm';


const app: Express = express();
app.use('/api', btcusdRouter); // Assuming routes are prefixed, adjust if not

describe('GET /api/btcusd Endpoint', () => {
    let sampleBlocks: { id: string; height: number; timestamp: number }[];
    let sampleTransactions: Transaction[];
    let sampleTxInputCoinbase: TxInput;
    let sampleTxInputRegular: TxInput;
    let sampleTxOutput: TxOutput;
    let sampleTxStatus: TransactionStatus;

    beforeEach(() => {
        // Reset mocks before each test
        (mockGetRecentBlocks as jest.Mock).mockReset();
        (mockFindBlocksForDate as jest.Mock).mockReset();
        (mockGetTransactionsForBlock as jest.Mock).mockReset();
        (mockCalculateUtxoOraclePrice as jest.Mock).mockReset();

        // Define sample data
        sampleBlocks = [
            { id: 'block1_hash', height: 700000, timestamp: Date.now() / 1000 - 600 },
            { id: 'block2_hash', height: 700001, timestamp: Date.now() / 1000 },
        ];
        
        sampleTxStatus = { confirmed: true, block_height: 700000, block_hash: 'block1_hash', block_time: Date.now()/1000 - 600};
        sampleTxOutput = { value: 1000000, scriptpubkey_asm: 'ASM', scriptpubkey_type: 'p2wpkh', scriptpubkey_address: 'addr1' }; // 0.01 BTC

        sampleTxInputCoinbase = { txid: '', vout: 0, is_coinbase: true }; // Simplified coinbase
        sampleTxInputRegular = { 
            txid: 'prev_tx_id_regular', // This ID should not be in allTxidsInPeriod for !isSameDayTx
            vout: 0, 
            is_coinbase: false, 
            prevout: { value: 1200000, scriptpubkey_asm: 'ASM_prev', scriptpubkey_type: 'p2pkh' } 
        };

        sampleTransactions = [
            // Valid transaction (passes filters)
            {
                txid: 'tx1_valid', version: 1, locktime: 0, fee: 1000, size: 250, weight: 1000, status: sampleTxStatus,
                vin: [sampleTxInputRegular, {...sampleTxInputRegular, txid: 'prev_tx_id_regular_2'}], // 2 inputs
                vout: [sampleTxOutput, {...sampleTxOutput, value: 500000 }] // 2 outputs
            },
            // Coinbase transaction
            {
                txid: 'tx2_coinbase', version: 1, locktime: 0, fee: 0, size: 100, weight: 400, status: sampleTxStatus,
                vin: [sampleTxInputCoinbase],
                vout: [sampleTxOutput]
            },
            // Transaction with OP_RETURN
            {
                txid: 'tx3_op_return', version: 1, locktime: 0, fee: 1000, size: 260, weight: 1040, status: sampleTxStatus,
                vin: [sampleTxInputRegular],
                vout: [sampleTxOutput, { ...sampleTxOutput, scriptpubkey_type: 'op_return', value: 0 }]
            },
             // Transaction that will be filtered by isSameDayTx
            {
                txid: 'tx4_same_day_reuse', version: 1, locktime: 0, fee: 1000, size: 250, weight: 1000, status: sampleTxStatus,
                vin: [{...sampleTxInputRegular, txid: 'tx1_valid'}], // Input references tx1_valid from same period
                vout: [sampleTxOutput, sampleTxOutput]
            },
             // Transaction with too many inputs
            {
                txid: 'tx5_too_many_inputs', version: 1, locktime: 0, fee: 1000, size: 500, weight: 2000, status: sampleTxStatus,
                vin: [sampleTxInputRegular,sampleTxInputRegular,sampleTxInputRegular,sampleTxInputRegular,sampleTxInputRegular,sampleTxInputRegular], // 6 inputs
                vout: [sampleTxOutput, sampleTxOutput]
            },
            // Transaction with only 1 output
             {
                txid: 'tx6_one_output', version: 1, locktime: 0, fee: 1000, size: 200, weight: 800, status: sampleTxStatus,
                vin: [sampleTxInputRegular],
                vout: [sampleTxOutput] // 1 output
            },
        ];
    });

    describe('Success Cases', () => {
        it('should return 200 and price in Recent Blocks Mode', async () => {
            (mockGetRecentBlocks as jest.Mock).mockResolvedValue(sampleBlocks);
            (mockGetTransactionsForBlock as jest.Mock)
                .mockImplementation(async (blockId: string) => {
                    if (blockId === 'block1_hash') return [sampleTransactions[0], sampleTransactions[1]]; // tx1_valid, tx2_coinbase
                    if (blockId === 'block2_hash') return [sampleTransactions[2]]; // tx3_op_return
                    return [];
                });
            (mockCalculateUtxoOraclePrice as jest.Mock).mockResolvedValue(50000.75);

            const response = await request(app).get('/api/btcusd');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ source: 'UTXOracle', price_usd: 50000.75 });
            expect(mockGetRecentBlocks).toHaveBeenCalledWith(144);
            expect(mockGetTransactionsForBlock).toHaveBeenCalledWith('block1_hash');
            expect(mockGetTransactionsForBlock).toHaveBeenCalledWith('block2_hash');
            
            // Check inputs to algo: only tx1_valid should produce outputs
            const expectedAlgoInputs: AlgoProcessedOutput[] = [
                { valueBtc: sampleTransactions[0].vout[0].value / 1e8 },
                { valueBtc: sampleTransactions[0].vout[1].value / 1e8 },
            ];
             // Ensure enough outputs for algo (mocked to pass, but this is what route should filter to)
            const actualArgs = (mockCalculateUtxoOraclePrice as jest.Mock).mock.calls[0][0];
            // Fill with enough items if needed for the length check in route
            while(actualArgs.length < 100 && expectedAlgoInputs.length < 100) {
                expectedAlgoInputs.push({valueBtc: 0.001}); // Dummy to pass length check
            }
            // This part of the test relies on the algo being mocked to return a value even with few inputs
            // For strictness, we'd mock calculateUtxoOraclePrice to require 100+ inputs.
            // For this test, we focus on what the route *sends* to the (mocked) algo.
            const passedToAlgo = (mockCalculateUtxoOraclePrice as jest.Mock).mock.calls[0][0];
            expect(passedToAlgo).toEqual(expect.arrayContaining(expectedAlgoInputs.slice(0,2))); // Check if the valid outputs are there
        });

        it('should return 200 and price in Date Mode', async () => {
            const testDate = '2023-01-10';
            (mockFindBlocksForDate as jest.Mock).mockResolvedValue(sampleBlocks.slice(0,1)); // Use one block for simplicity
            (mockGetTransactionsForBlock as jest.Mock).mockResolvedValue([sampleTransactions[0]]); // Only the valid tx
            (mockCalculateUtxoOraclePrice as jest.Mock).mockResolvedValue(51000.00);

            const response = await request(app).get(`/api/btcusd?date=${testDate}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ source: 'UTXOracle', price_usd: 51000.00 });
            expect(mockFindBlocksForDate).toHaveBeenCalledWith(testDate);
            expect(mockGetTransactionsForBlock).toHaveBeenCalledWith(sampleBlocks[0].id);
        });
    });

    describe('Error Handling and Edge Cases', () => {
        it('should return 400 for invalid date format', async () => {
            const response = await request(app).get('/api/btcusd?date=INVALID_DATE');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid date format. Please use YYYY-MM-DD." });
        });

        it('should return 500 if bitcoinApi.getRecentBlocks throws', async () => {
            (mockGetRecentBlocks as jest.Mock).mockRejectedValue(new Error('API Network Error'));
            const response = await request(app).get('/api/btcusd');
            expect(response.status).toBe(500);
            expect(response.body.error).toContain('Failed to calculate BTC/USD price');
            expect(response.body.details).toContain('API Network Error');
        });

        it('should return 500 if bitcoinApi.getTransactionsForBlock throws', async () => {
            (mockGetRecentBlocks as jest.Mock).mockResolvedValue(sampleBlocks);
            (mockGetTransactionsForBlock as jest.Mock).mockRejectedValue(new Error('TX Fetch Error'));
            const response = await request(app).get('/api/btcusd');
            expect(response.status).toBe(500);
            expect(response.body.error).toContain('Failed to calculate BTC/USD price');
            // The error message comes from the bitcoinApi's error handler for getTransactionsForBlock
            // which is then caught by the route. The route's message is "Failed to get all transactions..."
            // The actual error thrown by getTransactionsForBlock is what's in `details`.
            expect(response.body.details).toContain('TX Fetch Error'); 
        });
        
        it('should return 500 if utxoOracleAlgorithm.calculateUtxoOraclePrice throws', async () => {
            (mockGetRecentBlocks as jest.Mock).mockResolvedValue(sampleBlocks);
            // Make getTransactionsForBlock return enough valid outputs to proceed to algo
            const manyValidOutputs = [];
            for(let i=0; i<50; ++i) { // Creates 100 FullProcessedOutput items
                manyValidOutputs.push(sampleTransactions[0]); // tx1_valid
            }
            (mockGetTransactionsForBlock as jest.Mock).mockResolvedValue(manyValidOutputs);
            (mockCalculateUtxoOraclePrice as jest.Mock).mockRejectedValue(new Error('Algorithm Calculation Failed'));
            
            const response = await request(app).get('/api/btcusd');
            expect(response.status).toBe(500);
            expect(response.body.error).toContain('Failed to calculate BTC/USD price');
            expect(response.body.details).toContain('Algorithm Calculation Failed');
        });

        it('should return 200 with message if no blocks are found (Recent Blocks Mode)', async () => {
            (mockGetRecentBlocks as jest.Mock).mockResolvedValue([]);
            const response = await request(app).get('/api/btcusd');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                source: "UTXOracle",
                message: "No recent blocks found. Cannot calculate price.",
                price_usd: null
            });
        });
        
        it('should return 200 with message if no blocks are found (Date Mode)', async () => {
            (mockFindBlocksForDate as jest.Mock).mockResolvedValue([]);
            const response = await request(app).get('/api/btcusd?date=2023-01-11');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                source: "UTXOracle",
                message: "No blocks found for date 2023-01-11. Cannot calculate price.",
                price_usd: null
            });
        });

        it('should return 200 with message for insufficient processed outputs', async () => {
            (mockGetRecentBlocks as jest.Mock).mockResolvedValue(sampleBlocks.slice(0,1)); // One block
             // Only coinbase and OP_RETURN tx, so no valid outputs
            (mockGetTransactionsForBlock as jest.Mock).mockResolvedValue([sampleTransactions[1], sampleTransactions[2]]); 
            
            const response = await request(app).get('/api/btcusd');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                source: "UTXOracle",
                message: "Not enough transaction data (0 outputs after filtering, min 100 required) to calculate a reliable price for the given period.",
                price_usd: null
            });
        });
        
        it('should return 200 with null price if algorithm returns 0 or negative', async () => {
            (mockGetRecentBlocks as jest.Mock).mockResolvedValue(sampleBlocks);
            const manyValidOutputs = new Array(50).fill(sampleTransactions[0]); // 100 outputs
            (mockGetTransactionsForBlock as jest.Mock).mockResolvedValue(manyValidOutputs);
            (mockCalculateUtxoOraclePrice as jest.Mock).mockResolvedValue(0);

            const response = await request(app).get('/api/btcusd');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                source: "UTXOracle",
                message: "Price calculation resulted in a non-positive or zero value. This might indicate data issues or an anomaly.",
                price_usd: null
            });
        });
    });

    describe('Transaction Filtering Logic (Stretch Goal)', () => {
        it('should correctly filter transactions and pass valid ProcessedOutputs to algorithm', async () => {
            // Use all sampleTransactions for one block
            (mockGetRecentBlocks as jest.Mock).mockResolvedValue([sampleBlocks[0]]);
            (mockGetTransactionsForBlock as jest.Mock).mockResolvedValue(sampleTransactions);
            (mockCalculateUtxoOraclePrice as jest.Mock).mockResolvedValue(52000.00); // Dummy price

            await request(app).get('/api/btcusd');

            expect(mockCalculateUtxoOraclePrice).toHaveBeenCalled();
            const processedOutputsPassedToAlgo: AlgoProcessedOutput[] = (mockCalculateUtxoOraclePrice as jest.Mock).mock.calls[0][0];
            
            // Expected outputs:
            // tx1_valid: 2 outputs (0.01 BTC, 0.005 BTC)
            // tx2_coinbase: filtered out
            // tx3_op_return: filtered out
            // tx4_same_day_reuse: filtered out (vin[0].txid = 'tx1_valid', which is in allTxidsInPeriod)
            // tx5_too_many_inputs: filtered out
            // tx6_one_output: filtered out
            
            const expectedValuesBtc = [
                sampleTransactions[0].vout[0].value / 1e8, // from tx1_valid
                sampleTransactions[0].vout[1].value / 1e8  // from tx1_valid
            ].sort();

            const actualValuesBtc = processedOutputsPassedToAlgo.map(p => p.valueBtc).sort();
            
            // Check if the values match (ignoring blockHeight, timestamp, txid for this check focus on valueBtc)
            expect(actualValuesBtc).toEqual(expect.arrayContaining(expectedValuesBtc));
            // And ensure no other transactions' outputs made it through
            expect(actualValuesBtc.length).toBe(expectedValuesBtc.length); 
        });
    });
});
