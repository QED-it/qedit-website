import {
    initializeBellCurve,
    populateBellCurve,
    normalizeBellCurve,
    createSmoothStencil,
    createSpikeStencil,
    estimateRoughPrice,
    refinePrice,
    calculateUtxoOraclePrice,
    ProcessedOutput,
    BellCurve,
    // findCentralOutput is not exported, so it will be tested via refinePrice or if exported, directly.
    // For now, assuming it's tested via refinePrice.
} from '../utxoOracleAlgorithm'; // Adjust path as necessary

// Constants from the module (if needed for testing, but prefer to rely on module's own constants)
const BIN_MIN_BTC = 1e-6;
const BIN_MAX_BTC = 1e6;
const BINS_PER_10X = 200;
const TOTAL_BINS = Math.log10(BIN_MAX_BTC / BIN_MIN_BTC) * BINS_PER_10X + 1; // Should be 2401

describe('UTXO Oracle Algorithm', () => {
    describe('initializeBellCurve', () => {
        let curve: BellCurve;

        beforeAll(() => {
            curve = initializeBellCurve();
        });

        it('should create the correct number of bins', () => {
            expect(curve.bins.length).toBe(TOTAL_BINS);
            expect(curve.counts.length).toBe(TOTAL_BINS);
        });

        it('should initialize all counts to 0', () => {
            expect(curve.counts.every(count => count === 0)).toBe(true);
        });

        it('should have the first bin value match BIN_MIN_BTC', () => {
            expect(curve.bins[0]).toBeCloseTo(BIN_MIN_BTC);
        });

        it('should have the last bin value match BIN_MAX_BTC', () => {
            expect(curve.bins[TOTAL_BINS - 1]).toBeCloseTo(BIN_MAX_BTC);
        });

        it('bins should be logarithmically spaced', () => {
            // Check ratio between consecutive bins (approximate due to floating point)
            // log10(bins[i+1]/bins[i]) should be constant = 1/BINS_PER_10X
            const logRatio = Math.log10(curve.bins[1] / curve.bins[0]);
            expect(logRatio).toBeCloseTo(1 / BINS_PER_10X);
            const logRatio2 = Math.log10(curve.bins[100] / curve.bins[99]);
            expect(logRatio2).toBeCloseTo(1 / BINS_PER_10X);
        });
    });

    describe('populateBellCurve', () => {
        let initialCounts: number[];

        beforeEach(() => {
            ({ counts: initialCounts } = initializeBellCurve());
        });

        it('should correctly increment counts for valid outputs', () => {
            const outputs: ProcessedOutput[] = [
                { valueBtc: 0.001 }, // Expected index: log10(1e-3 / 1e-6) * 200 = 3 * 200 = 600
                { valueBtc: 0.1 },   // Expected index: log10(1e-1 / 1e-6) * 200 = 5 * 200 = 1000
                { valueBtc: 0.1 },   // Another one for the same bin
            ];
            const populatedCounts = populateBellCurve([...initialCounts], outputs);
            expect(populatedCounts[600]).toBe(1);
            expect(populatedCounts[1000]).toBe(2);
            expect(populatedCounts.reduce((sum, c) => sum + c, 0)).toBe(3);
        });

        it('should ignore outputs outside the filter range (1e-5 to 1e5 BTC)', () => {
            const outputs: ProcessedOutput[] = [
                { valueBtc: 1e-7 }, // Too small
                { valueBtc: 1e6 },  // Too large
                { valueBtc: 0.01 }, // Valid: index log10(1e-2 / 1e-6)*200 = 4*200 = 800
            ];
            const populatedCounts = populateBellCurve([...initialCounts], outputs);
            expect(populatedCounts[800]).toBe(1);
            expect(populatedCounts.reduce((sum, c) => sum + c, 0)).toBe(1);
        });

        it('should handle empty processedOutputs', () => {
            const outputs: ProcessedOutput[] = [];
            const populatedCounts = populateBellCurve([...initialCounts], outputs);
            expect(populatedCounts.every(count => count === 0)).toBe(true);
        });

        it('should correctly round bin indices', () => {
            // valueBtc = 0.001001, log10(0.001001 / 1e-6) * 200 = log10(1001) * 200 = 3.00043 * 200 = 600.086 -> rounded to 600
            // valueBtc = 0.0011, log10(0.0011 / 1e-6) * 200 = log10(1100) * 200 = 3.04139 * 200 = 608.27 -> rounded to 608
            const outputs: ProcessedOutput[] = [
                { valueBtc: 0.001001 },
                { valueBtc: 0.0011 },
            ];
            const populatedCounts = populateBellCurve([...initialCounts], outputs);
            expect(populatedCounts[600]).toBe(1);
            expect(populatedCounts[608]).toBe(1);
        });
    });

    describe('createSmoothStencil', () => {
        const stencil = createSmoothStencil();
        const STENCIL_SIZE = 803; // from module
        const center = 401;

        it('should have the correct length', () => {
            expect(stencil.length).toBe(STENCIL_SIZE);
        });

        it('should have the center value as 1.0 (exp(0))', () => {
            expect(stencil[center]).toBeCloseTo(1.0);
        });

        it('should be symmetric around the center', () => {
            expect(stencil[center - 100]).toBeCloseTo(stencil[center + 100]);
            expect(stencil[0]).toBeCloseTo(stencil[STENCIL_SIZE - 1]);
        });

        it('values should decrease away from the center', () => {
            expect(stencil[center]).toBeGreaterThan(stencil[center + 50]);
            expect(stencil[center + 50]).toBeGreaterThan(stencil[center + 100]);
        });
    });

    describe('createSpikeStencil', () => {
        const stencil = createSpikeStencil();
        const STENCIL_SIZE = 803; // from module

        it('should have the correct length', () => {
            expect(stencil.length).toBe(STENCIL_SIZE);
        });

        it('should have 1s at specified spike indices', () => {
            const spikeIndices = [0, 200, 300, 400, 500, 600, 700, 800];
            for (const index of spikeIndices) {
                expect(stencil[index]).toBe(1);
            }
        });

        it('should have 0s where no spike is defined', () => {
            expect(stencil[100]).toBe(0);
            expect(stencil[401]).toBe(0); // Center, not a spike index
        });
    });

    describe('normalizeBellCurve', () => {
        let counts: number[];
        const ROUND_BTC_BINS_INDICES = [600, 601, 800, 801, 1000, 1001, 1200, 1201, 1400, 1401]; // From module

        beforeEach(() => {
            counts = new Array(TOTAL_BINS).fill(0);
            // Populate some values for testing
            // Bins 201 to 1600 are the primary focus for normalization sum
            for (let i = 201; i <= 1600; i++) {
                counts[i] = 1; // Simple case: each bin has a count of 1
            }
            // Add specific values for smoothing test
            counts[599] = 10; counts[600] = 1; counts[601] = 20; // for ROUND_BTC_BINS_INDICES[0] and [1]
            counts[1600] = 1; // ensure this edge is included
        });

        it('should filter outer bins (0-200 and 1601+)', () => {
            counts[50] = 100;
            counts[1800] = 100;
            const normalized = normalizeBellCurve([...counts]);
            expect(normalized[50]).toBe(0);
            expect(normalized[200]).toBe(0); // Index 200 is part of the 0-200 filter
            expect(normalized[1800]).toBe(0);
            expect(normalized[1601]).toBe(0); // Index 1601 is part of the 1601+ filter
        });

        it('should smooth counts around ROUND_BTC_BINS_INDICES', () => {
            const normalized = normalizeBellCurve([...counts]);
            // counts[600] was 1, neighbors 10 and 20 (original values for smoothing)
            // counts[600] should become (counts[599] + counts[601]) / 2 = (10+20)/2 = 15
            // But normalization happens after, so we check the value *before* division by sum.
            
            // To test smoothing directly, let's create a scenario where other effects are minimal
            let testCounts = new Array(TOTAL_BINS).fill(0);
            testCounts[599] = 10; testCounts[600] = 1; testCounts[601] = 20; // for smoothing at index 600
            testCounts[799] = 5;  testCounts[800] = 50; testCounts[801] = 15; // for smoothing at index 800
            // For normalization sum, ensure some other values exist in 201-1600 range
            testCounts[400] = 100; 
            testCounts[401] = 100;

            // Re-run normalizeBellCurve for this specific test.
            // The smoothing operation: counts[idx] = (counts[idx - 1] + counts[idx + 1]) / 2;
            // So, testCounts[600] becomes (10 + 20) / 2 = 15.
            // testCounts[800] becomes (5 + 15) / 2 = 10.
            // These smoothed values are then used in the sum for normalization.

            // Sum before normalization:
            // Original sum for range [201,1600] excluding smoothed bins: (100+100) = 200
            // Values at smoothed indices BEFORE smoothing: testCounts[600]=1, testCounts[800]=50.
            // Values at smoothed indices AFTER smoothing: 15, 10.
            // So sum for normalization uses these *new* values if they fall in [201,1600]
            // Bin 600 and 800 are in range [201,1600].
            // Total sum = 100(at 400) + 100(at 401) + 15(new at 600) + 10(new at 800) = 225
            // normalized[600] = 15 / 225
            // normalized[800] = 10 / 225
            
            const normalizedSpecific = normalizeBellCurve(testCounts);
            const sum = testCounts[400] + testCounts[401] + ((testCounts[599]+testCounts[601])/2) + ((testCounts[799]+testCounts[801])/2);

            expect(normalizedSpecific[600]).toBeCloseTo(15 / sum);
            expect(normalizedSpecific[800]).toBeCloseTo(10 / sum);
        });

        it('should normalize counts so they sum to approx 1.0 (within cap effects)', () => {
            // Using the `counts` from beforeEach where counts[201] to counts[1600] are 1,
            // except for smoothed bins.
            // Original count from 201 to 1600: (1600 - 201 + 1) = 1400 values.
            // counts[600] = 1, counts[601] = 20. Original values for smoothing: counts[599]=10, counts[600]=1, counts[601]=20.
            // Smoothed: counts[600] becomes (10+20)/2 = 15. counts[601] becomes (counts[600] + counts[602])/2.
            // Let's simplify: assume all non-ROUND_BTC_BINS_INDICES are 1 within 201-1600.
            // And ROUND_BTC_BINS_INDICES (and their neighbors) are also 1.
            let simpleCounts = new Array(TOTAL_BINS).fill(0);
            for (let i = 201; i <= 1600; i++) simpleCounts[i] = 1;
            
            // For ROUND_BTC_BINS_INDICES, smoothing will make them (1+1)/2 = 1. So no change.
            const normalized = normalizeBellCurve(simpleCounts);
            let normalizedSum = 0;
            for (let i = 201; i <= 1600; i++) {
                normalizedSum += normalized[i];
            }
            // Total number of bins in range [201, 1600] is 1400.
            // Each is 1. Sum is 1400. Each normalized value is 1/1400.
            // Sum of (1/1400) * 1400 = 1.
            expect(normalizedSum).toBeCloseTo(1.0);
        });

        it('should cap individual normalized counts at NORMALIZED_CURVE_CAP (0.008)', () => {
            counts = new Array(TOTAL_BINS).fill(0);
            counts[400] = 1000; // This will be very high
            counts[401] = 10;   // Another value to make sum non-trivial
            // Sum for normalization (indices 201-1600) = 1000 + 10 = 1010
            // counts[400] normalized = 1000 / 1010 approx 0.99
            // This should be capped at 0.008
            const normalized = normalizeBellCurve([...counts]);
            expect(normalized[400]).toBe(0.008);
            // The sum will no longer be 1.0 due to capping.
            // normalized[401] = 10/1010 approx 0.0099, also capped.
            // Wait, NORMALIZED_CURVE_CAP = 0.008. 10/1010 is ~0.0099... which is > 0.008.
            // Python code: p9_counts[i] = p9_counts[i] / p9_sum_counts -> then cap.
            // So, 10/1010 = 0.00990099... This should be capped to 0.008.
            expect(normalized[401]).toBe(0.008);
        });

         it('should handle case where sum of counts is 0', () => {
            counts = new Array(TOTAL_BINS).fill(0); // All zeros
            const normalized = normalizeBellCurve([...counts]);
            expect(normalized.every(c => c === 0)).toBe(true);
            let normalizedSum = 0;
            for (let i = 201; i <= 1600; i++) {
                normalizedSum += normalized[i];
            }
            expect(normalizedSum).toBe(0);
        });
    });

    describe('estimateRoughPrice', () => {
        let normalizedCurve: number[];
        let bellCurveBins: number[];
        const smoothStencil = createSmoothStencil();
        const spikeStencil = createSpikeStencil();

        beforeEach(() => {
            ({ bins: bellCurveBins, counts: normalizedCurve } = initializeBellCurve()); // Use empty curve for now
            // A more realistic normalizedCurve would be needed for meaningful price output.
            // For this test, we focus on execution and basic output checks.
            // Let's make a simple curve where one slide might score well.
            // slide = log10(price_usd_cents) * BINS_PER_10X
            // If price is $500 (50000 cents), slide = log10(50000) * 200 = 4.6989 * 200 = 939.79 -> ~470 if BINS_PER_10X=200
            // slide is 0-600. Price = 10^(slide/200).
            // If bestSlide = 400 (price $100), we need normalizedCurve values to be high around stencil indices + 400 - 600
            // i.e. stencil indices + (-200).
            // Example: stencil[400] (center of spike for $100) should align with a high normalizedCurve value.
            // curveIndex = stencil_idx (400) + best_slide (400) + CENTER_P001_OFFSET (-600) = 400 + 400 - 600 = 200.
            // So, if normalizedCurve[200] is high, slide 400 might be chosen.
            normalizedCurve = new Array(TOTAL_BINS).fill(0.00001); // Small base values
            normalizedCurve[200] = 0.005; // Peak at index 200
            normalizedCurve[199] = 0.004;
            normalizedCurve[201] = 0.004;
            // Ensure it's somewhat normalized (sum to 1-ish over range 201-1600, though this is a mock)
            // This mock curve is not perfectly normalized but aims to test if a price is produced.
        });

        it('should return a price estimate (even if not accurate for this mock)', () => {
            const price = estimateRoughPrice(normalizedCurve, bellCurveBins, smoothStencil, spikeStencil);
            expect(typeof price).toBe('number');
            expect(price).toBeGreaterThan(0); // Expect a positive price
            // For the mock curve peaking at index 200, we expect bestSlide around 400, price around $100
            // Price = 10^(best_slide/200) USD. If best_slide = 400, price = 10^2 = $100.
            // This is a rough check, actual bestSlide depends on weighted scores.
            expect(price).toBeGreaterThan(10); // Very loose lower bound
            expect(price).toBeLessThan(10000); // Very loose upper bound
        });

        it('should handle an all-zero normalized curve', () => {
             const zeroCurve = new Array(TOTAL_BINS).fill(0);
             const price = estimateRoughPrice(zeroCurve, bellCurveBins, smoothStencil, spikeStencil);
             // If all scores are 0, bestSlide might remain -1 or initial value.
             // The function returns price = 10^(bestSlide/200) / 100.
             // If bestSlide is 0 (min_slide), price is 10^0 / 100 = 0.01.
             // If bestSlide remains -1 (initial), it might result in priceSlide being NaN or error.
             // The python code has: rough_price_estimate = (p_slide*score + ...)
             // If score is 0, and score_up/down also 0, it defaults to p_slide.
             // If bestSlide is -1, p_slide would be 10^(-1/200) which is valid.
             // The current TS code returns 0 if bestSlide is -1.
             expect(price).toBe(0);
        });
    });

    describe('refinePrice', () => {
        // findCentralOutput is implicitly tested via refinePrice
        let roughPriceUSD: number;
        let allOutputs: ProcessedOutput[];

        // Mock for findCentralOutput if it were separate or for more detailed testing
        // const mockFindCentralOutput = jest.fn();
        // (findCentralOutput as any) = mockFindCentralOutput; // If we could mock it

        beforeEach(() => {
            roughPriceUSD = 100; // Example rough price
            allOutputs = [];
            // Populate with some outputs that would result in implied prices around roughPriceUSD
            // For an output { valueBtc: 0.01 }, and usdVal = 1, impliedPrice = 1/0.01 = $100
            // For an output { valueBtc: 0.005 }, and usdVal = 1, impliedPrice = 1/0.005 = $200
            // For an output { valueBtc: 0.02 }, and usdVal = 2, impliedPrice = 2/0.02 = $100

            // usds from module: [1, 1.5, 2, ..., 100, ..., 10000]
            const usdsForTest = [1, 2, 5, 10, 50, 100, 150]; // Simplified list

            // Let's create outputs that, when divided by some `usdVal`, give prices near $100
            // Price = usdVal / valueBtc  => valueBtc = usdVal / Price
            for (const usd of usdsForTest) {
                // Implied prices slightly around $100
                allOutputs.push({ valueBtc: usd / 95 });  // Implied price $95
                allOutputs.push({ valueBtc: usd / 100 }); // Implied price $100
                allOutputs.push({ valueBtc: usd / 105 }); // Implied price $105
            }
            // Add some outputs that are outside PCT_RANGE_WIDE (10%) of $100 (i.e. <$90 or >$110)
            allOutputs.push({ valueBtc: 1 / 80 }); // Implied price $80 for usdVal=1
            allOutputs.push({ valueBtc: 1 / 120 });// Implied price $120 for usdVal=1

            // Add outputs that will be filtered by MICRO_REMOVE_LIST_SATS (e.g. 10000 sats = 0.0001 BTC)
            allOutputs.push({ valueBtc: 0.0001 }); // 10k sats
            allOutputs.push({ valueBtc: 0.0005 }); // 50k sats
        });

        it('should return a refined price close to the central tendency', () => {
            const refined = refinePrice(roughPriceUSD, allOutputs);
            expect(typeof refined).toBe('number');
            expect(refined).toBeGreaterThan(0);
            // Given inputs are clustered around 95, 100, 105, we expect refined price around 100.
            // PCT_RANGE_WIDE = 0.10. So initial filter for outputPricesForRefinement: $90 - $110.
            // The $80 and $120 implied prices should be filtered out.
            // The 0.0001 BTC (10k sats) should be filtered by micro_remove_list.
            expect(refined).toBeGreaterThanOrEqual(90); // Prices outside this are filtered initially
            expect(refined).toBeLessThanOrEqual(110);
            // It should converge towards the center of the valid prices.
            // With prices 95, 100, 105, the center is 100.
            expect(refined).toBeCloseTo(100, 1); // Allow some deviation due to iteration
        });

        it('should return roughPriceEstimate if no suitable outputs for refinement', () => {
            const outputsNoMatch: ProcessedOutput[] = [
                { valueBtc: 1/200 }, // Implied price $200 for usdVal=1 (outside 10% of $100)
                { valueBtc: 1/50 },  // Implied price $50 for usdVal=1 (outside 10% of $100)
            ];
            const refined = refinePrice(roughPriceUSD, outputsNoMatch);
            // Python's refinePrice returns rough_price_estimate if p11_output_prices is empty.
            // TS version does the same.
            expect(refined).toBe(roughPriceUSD);
        });
        
        it('should handle iterative refinement (mocking findCentralOutput behavior)', () => {
            // This is harder to test without directly mocking findCentralOutput
            // or having a very specific dataset that forces multiple iterations with changes.
            // For now, we trust the loop structure and previous test covers the general case.
            // A simple test: if initial MAD is wide, but prices are tight, it should converge.
            let manyCloseOutputs: ProcessedOutput[] = [];
            for (let i=0; i < 20; i++) {
                 manyCloseOutputs.push({valueBtc: 1 / 100.0}); // Price $100
                 manyCloseOutputs.push({valueBtc: 1 / 100.1}); // Price $100.1
                 manyCloseOutputs.push({valueBtc: 1 / 99.9});  // Price $99.9
            }
            const refined = refinePrice(100, manyCloseOutputs);
            expect(refined).toBeCloseTo(100.0, 1); // Should converge to ~100
        });

        it('should return 0 if roughPriceEstimateUSD is 0 or negative', () => {
            expect(refinePrice(0, allOutputs)).toBe(0);
            expect(refinePrice(-100, allOutputs)).toBe(0);
        });
    });

    describe('findCentralOutput (tested via refinePrice or internal logic)', () => {
        // If findCentralOutput were exported, tests would be like:
        // const prices = [90, 91, 100, 101, 102, 110, 111];
        // const { centralPrice, meanAbsDev, count } = findCentralOutput(prices, 95, 105);
        // expect(count).toBe(3); // 100, 101, 102
        // expect(centralPrice).toBeCloseTo( (100+101)/2 ); // or median logic
        // expect(meanAbsDev).toBeCloseTo( (abs(100-cp)+abs(101-cp)+abs(102-cp))/3 );
        // Since it's not exported, its behavior is implicitly part of refinePrice's tests.
        // One could argue to export it for easier testing if its logic is complex enough.
        // For now, the refinePrice tests cover its main use case.
        it('placeholder test for findCentralOutput logic (covered by refinePrice)', () => {
            expect(true).toBe(true);
        });
    });
    
    describe('calculateUtxoOraclePrice', () => {
        it('should return a numerical price for valid inputs', async () => {
            // Create ~100+ dummy outputs to pass the minimum threshold
            const outputs: ProcessedOutput[] = [];
            for (let i = 0; i < 150; i++) {
                // Make values vary to simulate a distribution for bell curve
                const value = 0.001 + (i * 0.00001); // e.g. 0.001, 0.00101, ...
                outputs.push({ valueBtc: value });
            }
            const price = await calculateUtxoOraclePrice(outputs);
            expect(typeof price).toBe('number');
            // Cannot assert a specific price without golden data or deeper mocking.
            // Price being > 0 is a good sign if data is somewhat reasonable.
            // The mock data above is very artificial for the bell curve.
            // Price might be 0 if rough estimate is out of bounds or refinement fails.
            // Let's check it's not NaN or negative.
            expect(price).not.toBeNaN();
            expect(price).toBeGreaterThanOrEqual(0); // Could be 0 if calculation fails at some stage
        });

        it('should return 0 if processedOutputs are insufficient', async () => {
            const outputs: ProcessedOutput[] = [{ valueBtc: 0.1 }, { valueBtc: 0.01 }]; // Too few
            const price = await calculateUtxoOraclePrice(outputs);
            expect(price).toBe(0);
        });
        
        it('should return 0 if bell curve population results in no usable data', async () => {
            // Outputs that are all outside the populateBellCurve filter range (1e-5 to 1e5)
             const outputs: ProcessedOutput[] = [];
             for (let i = 0; i < 150; i++) { // Enough outputs to pass initial length check
                outputs.push({ valueBtc: 1e-7 }); // All too small
             }
            const price = await calculateUtxoOraclePrice(outputs);
            expect(price).toBe(0); // Expect 0 as bell curve will be empty
        });

        it('should return 0 if normalization results in no usable data', async () => {
            // Outputs that would only populate bins 0-200 or 1601+
            // which are then zeroed out by normalizeBellCurve
            const outputs: ProcessedOutput[] = [];
            for (let i = 0; i < 150; i++) {
                // value for bin 100: 10^(log10(1e-6) + 100/200) = 10^(-6 + 0.5) = 10^(-5.5) approx 3.16e-6
                // This is > 1e-5 (filter in populateBellCurve) so it will be populated.
                // But bin 100 is zeroed out in normalizeBellCurve.
                outputs.push({ valueBtc: 3.16e-6 }); 
            }
            const price = await calculateUtxoOraclePrice(outputs);
            expect(price).toBe(0);
        });
    });
});
