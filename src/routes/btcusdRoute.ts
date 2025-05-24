import express, { Request, Response } from 'express';
import {
    getRecentBlocks,
    findBlocksForDate,
    getTransactionsForBlock,
    BlockInfo, // Assuming BlockInfo has id, height, timestamp
    Transaction, // Assuming Transaction has txid, vin, vout, status
    TxInput,
    TxOutput
} from '../bitcoinApi';
import { calculateUtxoOraclePrice } from '../utxoOracleAlgorithm';

const router = express.Router();

// Type for the outputs processed during filtering, includes all necessary fields
interface FullProcessedOutput {
    valueBtc: number;
    blockHeight: number | null; // Block height of the transaction
    timestamp: number | null;   // Timestamp of the block
    txid: string;             // Transaction ID
}

// Type expected by calculateUtxoOraclePrice
interface AlgoProcessedOutput {
    valueBtc: number;
}

// Helper to validate YYYY-MM-DD format
function isValidDate(dateString: string): boolean {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false; // Invalid format
    const d = new Date(dateString);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
}

router.get('/btcusd', async (req: Request, res: Response) => {
    console.log(`Received request for /btcusd. Query params: ${JSON.stringify(req.query)}`);
    try {
        let blocksToProcess: { id: string; height: number; timestamp: number; }[] = [];
        const dateQuery = req.query.date as string | undefined;

        if (dateQuery) {
            console.log(`Date parameter found: ${dateQuery}. Attempting Date Mode.`);
            if (!isValidDate(dateQuery)) {
                console.warn(`Invalid date format for parameter: ${dateQuery}.`);
                return res.status(400).json({ error: "Invalid date format. Please use YYYY-MM-DD." });
            }
            blocksToProcess = await findBlocksForDate(dateQuery);
            if (blocksToProcess.length === 0) {
                console.log(`No blocks found for date: ${dateQuery}.`);
                 return res.status(200).json({ 
                    source: "UTXOracle", 
                    message: `No blocks found for date ${dateQuery}. Cannot calculate price.`,
                    price_usd: null 
                });
            }
            console.log(`Fetched ${blocksToProcess.length} blocks for date ${dateQuery}.`);
        } else {
            console.log("No date parameter. Defaulting to Recent Blocks Mode (144 blocks).");
            blocksToProcess = await getRecentBlocks(144); // Default to last 144 blocks
             if (blocksToProcess.length === 0) {
                console.log(`No recent blocks found.`);
                 return res.status(200).json({ 
                    source: "UTXOracle", 
                    message: "No recent blocks found. Cannot calculate price.",
                    price_usd: null 
                });
            }
            console.log(`Fetched ${blocksToProcess.length} recent blocks.`);
        }

        const fullProcessedOutputs: FullProcessedOutput[] = [];
        const allTxidsInPeriod: Set<string> = new Set();
        const allTransactionsInPeriod: Transaction[] = [];

        console.log("Starting transaction fetching and initial processing phase...");
        // First pass: Fetch all transactions and populate allTxidsInPeriod
        for (const block of blocksToProcess) {
            if (!block || !block.id) {
                console.warn("Encountered a block without an ID. Skipping.", block);
                continue;
            }
            console.log(`Fetching transactions for block: ${block.id} (Height: ${block.height})`);
            try {
                const transactions = await getTransactionsForBlock(block.id);
                console.log(`Fetched ${transactions.length} transactions for block ${block.id}.`);
                for (const tx of transactions) {
                    if(tx && tx.txid) {
                        allTxidsInPeriod.add(tx.txid);
                        allTransactionsInPeriod.push(tx); // Store for second pass
                    } else {
                        console.warn("Encountered a transaction without a TXID. Skipping.", tx);
                    }
                }
            } catch (err: any) {
                console.error(`Error fetching transactions for block ${block.id}: ${err.message}. Skipping this block.`);
                // Decide if one block failing should halt the whole process or just skip
            }
        }
        console.log(`Collected a total of ${allTxidsInPeriod.size} unique transaction IDs from ${allTransactionsInPeriod.length} transactions.`);

        console.log("Starting filtering phase for processed outputs...");
        // Second pass: Filter transactions
        for (const tx of allTransactionsInPeriod) {
             if (!tx || !tx.txid || !tx.vin || !tx.vout || !tx.status) {
                console.warn("Skipping invalid or incomplete transaction object:", tx);
                continue;
            }

            const isCoinbase = tx.vin[0]?.is_coinbase === true;
            const inputCount = tx.vin.length;
            const outputCount = tx.vout.length;
            const hasOpReturn = tx.vout.some(out => out.scriptpubkey_type === 'op_return' || out.scriptpubkey_asm?.startsWith('OP_RETURN'));
            
            // isSameDayTx: Check if any input's source transaction (prevout.txid) was also mined in the current period.
            // This requires that TxInput interface has prevout populated with its txid.
            // The bitcoinApi's Transaction interface's TxInput has `txid` (source txid) and `vout` (index in source tx)
            let isSameDayTx = false;
            if (!isCoinbase) { // Coinbase inputs don't have a prevout.txid in the same way
                 isSameDayTx = tx.vin.some(input => {
                    // Check if the input's referenced transaction ID is in our set of TXIDs for this period
                    return input.txid && allTxidsInPeriod.has(input.txid);
                });
            }

            if (!isCoinbase && inputCount <= 5 && outputCount === 2 && !hasOpReturn && !isSameDayTx) {
                for (const out of tx.vout) {
                    if (!out || typeof out.value !== 'number') {
                        console.warn("Skipping invalid or incomplete output object in tx:", tx.txid, out);
                        continue;
                    }
                    const valueSat = out.value;
                    const valueBtc = valueSat / 1e8;

                    if (valueBtc > 1e-5 && valueBtc < 1e5) {
                        fullProcessedOutputs.push({
                            valueBtc,
                            blockHeight: tx.status.block_height,
                            timestamp: tx.status.block_time,
                            txid: tx.txid,
                        });
                    }
                }
            }
        }
        console.log(`Collected ${fullProcessedOutputs.length} outputs after filtering.`);

        if (fullProcessedOutputs.length < 100) { // Threshold based on Python script's p8 min_total_vouts_for_price_calc
            console.warn(`Not enough processed outputs (${fullProcessedOutputs.length}) to calculate a reliable price. Minimum is 100.`);
            return res.status(200).json({
                source: "UTXOracle",
                message: `Not enough transaction data (${fullProcessedOutputs.length} outputs after filtering, min 100 required) to calculate a reliable price for the given period.`,
                price_usd: null,
            });
        }

        // Map to the format expected by the algorithm
        const algoInputs: AlgoProcessedOutput[] = fullProcessedOutputs.map(fpo => ({ valueBtc: fpo.valueBtc }));

        console.log("Calculating UTXO Oracle price...");
        const calculatedPrice = await calculateUtxoOraclePrice(algoInputs);
        console.log(`Calculated price: $${calculatedPrice}`);

        if (calculatedPrice <= 0) {
             return res.status(200).json({
                source: "UTXOracle",
                message: "Price calculation resulted in a non-positive or zero value. This might indicate data issues or an anomaly.",
                price_usd: null, // Or return the non-positive price if that's preferred
            });
        }

        res.json({ source: "UTXOracle", price_usd: calculatedPrice });

    } catch (error: any) {
        console.error("Error in /btcusd endpoint:", error);
        res.status(500).json({
            error: "Failed to calculate BTC/USD price",
            details: error.message || "An unknown error occurred"
        });
    }
});

export default router;
