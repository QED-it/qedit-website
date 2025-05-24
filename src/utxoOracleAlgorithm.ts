// --- Constants and Types ---

const BTC_MIN_PRICE_CENTS = 100; // $1.00 USD
const BTC_MAX_PRICE_CENTS = 100_000_000; // $1,000,000 USD

const BIN_MIN_BTC = 1e-6; // Smallest BTC amount for bell curve bins
const BIN_MAX_BTC = 1e6;  // Largest BTC amount for bell curve bins
const BINS_PER_10X = 200; // Number of bins per 10x change in BTC amount

// Total number of bins = log10(BIN_MAX_BTC/BIN_MIN_BTC) * BINS_PER_10X + 1
// = log10(1e12) * 200 + 1 = 12 * 200 + 1 = 2401
const TOTAL_BINS = Math.log10(BIN_MAX_BTC / BIN_MIN_BTC) * BINS_PER_10X + 1;

// For Part 9: Normalization
const MIN_SATS_FILTER_THRESHOLD = 10000; // 0.0001 BTC
const MAX_BTC_FILTER_THRESHOLD = 10;     // 10 BTC
const NORMALIZED_CURVE_CAP = 0.008;

// Indices for round BTC amounts in the bell curve (Python's round_btc_bins)
// These need to be calculated based on BIN_MIN_BTC and BINS_PER_10X
// log10(amount / BIN_MIN_BTC) * BINS_PER_10X
// Example: 0.001 BTC: log10(1e-3 / 1e-6) * 200 = log10(1e3) * 200 = 3 * 200 = 600
// 0.01 BTC: log10(1e-2 / 1e-6) * 200 = 4 * 200 = 800
// 0.1 BTC: 1000
// 1 BTC: 1200
// 10 BTC: 1400
const ROUND_BTC_BINS_INDICES = [
    600, 601, 800, 801, 1000, 1001, 1200, 1201, 1400, 1401
];

// For Part 10: Rough Price Estimation
const MIN_SLIDE = 0;     // Corresponds to $1 (100 cents)
const MAX_SLIDE = 600;   // Corresponds to $1M (100,000,000 cents)
// center_p001 = log10(0.001) * 200 = -3 * 200 = -600. This is an offset.
const CENTER_P001_OFFSET = -600; // log10(0.001) * BINS_PER_10X
const SMOOTH_WEIGHT_THRESHOLD_SLIDE = 150; // Slides less than this use more smooth_score

// For Part 11: Price Refinement
const PCT_RANGE_WIDE = 0.10; // 10%
const PCT_RANGE_NARROW = 0.01; // 1%
const MICRO_REMOVE_LIST_SATS = [ // Round satoshi amounts to ignore during refinement
    10000, 15000, 20000, 25000, 30000, 33333, 40000, 50000, 60000, 66667,
    70000, 75000, 80000, 90000, 100000, 150000, 200000, 250000, 300000,
    333333, 400000, 500000, 600000, 666667, 700000, 750000, 800000, 900000,
    1000000, 1500000, 2000000, 2500000, 3000000, 3333333, 4000000, 5000000,
    6000000, 6666667, 7000000, 7500000, 8000000, 9000000, 10000000
];
const MAX_REFINEMENT_ITERATIONS = 10;


export interface ProcessedOutput {
    valueBtc: number; // BTC value of the UTXO
    // blockHeight: number; // Block height of the transaction (not used in this module directly, but good for context)
    // timestamp: number; // Timestamp of the block (not used in this module directly)
    // txid: string; // Transaction ID (not used in this module directly)
}

export interface BellCurve {
    bins: number[];    // Array of BTC amount thresholds (logarithmically spaced)
    counts: number[];  // Corresponding counts for each bin
}

// --- Part 7 & 8: Bell Curve Generation ---

/**
 * Initializes the bell curve bins and counts.
 * Bins are logarithmically spaced BTC amount thresholds.
 * @returns {BellCurve} An object with 'bins' and 'counts' arrays.
 */
export function initializeBellCurve(): BellCurve {
    const bins: number[] = [];
    // BIN_MIN_BTC = 1e-6, BIN_MAX_BTC = 1e6. Range is 1e12.
    // BINS_PER_10X = 200. So 12 * 200 = 2400 intervals, 2401 bins.
    for (let i = 0; i < TOTAL_BINS; i++) {
        bins.push(Math.pow(10, Math.log10(BIN_MIN_BTC) + i / BINS_PER_10X));
    }
    const counts: number[] = new Array(TOTAL_BINS).fill(0);
    return { bins, counts };
}

/**
 * Populates the bell curve counts based on transaction output values.
 * @param {number[]} counts - The initialized counts array.
 * @param {ProcessedOutput[]} processedOutputs - Array of pre-filtered transaction outputs.
 * @returns {number[]} The updated counts array.
 */
export function populateBellCurve(
    counts: number[],
    processedOutputs: ProcessedOutput[]
): number[] {
    // Filter for valueBtc similar to Python script's "p7_vouts_for_bell_curve"
    // Original: value_btc > 1e-5 and value_btc < 1e5
    // bin_idx = int(round(math.log10(value_btc / BIN_MIN_BTC) * BINS_PER_10X))
    // BIN_MIN_BTC = 1e-6
    // If value_btc = 1e-5, idx = log10(1e-5 / 1e-6) * 200 = log10(10) * 200 = 1 * 200 = 200
    // If value_btc = 1e5, idx = log10(1e5 / 1e-6) * 200 = log10(1e11) * 200 = 11 * 200 = 2200

    const minBtcFilter = 1e-5; // As per Python p7_vouts_for_bell_curve
    const maxBtcFilter = 1e5;  // As per Python p7_vouts_for_bell_curve

    for (const output of processedOutputs) {
        const valueBtc = output.valueBtc;
        if (valueBtc > minBtcFilter && valueBtc < maxBtcFilter) {
            const binIndex = Math.round(Math.log10(valueBtc / BIN_MIN_BTC) * BINS_PER_10X);
            if (binIndex >= 0 && binIndex < counts.length) {
                counts[binIndex]++;
            }
        }
    }
    return counts;
}

// --- Part 9: Bell Curve Normalization ---

/**
 * Normalizes the bell curve counts.
 * Applies filters, smooths round BTC amounts, and normalizes.
 * @param {number[]} originalCounts - The populated bell curve counts.
 * @returns {number[]} The normalized counts array.
 */
export function normalizeBellCurve(originalCounts: number[]): number[] {
    const counts = [...originalCounts]; // Work on a copy

    // Filter 1: Set counts for bins < 10k sats (0.0001 BTC) to 0
    // 0.0001 BTC / BIN_MIN_BTC (1e-6) = 1e-4 / 1e-6 = 100
    // index = log10(100) * 200 = 2 * 200 = 400. Python's first 201 bins (0 to 200).
    // Python's `p9_counts[0:201] = 0` -> indices 0 to 200.
    // Smallest bin is 1e-6. 10k sats = 1e-4 BTC.
    // Bin index for 1e-4 BTC: log10(1e-4 / 1e-6) * 200 = log10(100) * 200 = 2 * 200 = 400.
    // The Python script's "first 201 bins" (index 0 to 200) corresponds to amounts up to:
    // 10^(log10(1e-6) + 200/200) = 10^(-6 + 1) = 1e-5 BTC.
    // This seems to be a discrepancy with the comment "10k sats".
    // Let's follow the Python code's bin indices directly.
    // Python `p9_counts[0:201] = 0` means indices 0 through 200.
    for (let i = 0; i <= 200; i++) {
        counts[i] = 0;
    }

    // Filter 2: Set counts for bins > 10 BTC to 0
    // Python `p9_counts[1601:] = 0` means indices 1601 to end.
    // Bin 1601 corresponds to BTC amount: 10^(log10(1e-6) + 1601/200) = 10^(-6 + 8.005) = 10^2.005 approx 100 BTC.
    // This also seems discrepant with "10 BTC".
    // Index for 10 BTC: log10(10 / 1e-6) * 200 = log10(1e7) * 200 = 7 * 200 = 1400.
    // Let's use the Python code's bin indices directly: 1601 onwards.
    for (let i = 1601; i < counts.length; i++) {
        counts[i] = 0;
    }

    // Smooth over "round BTC amounts"
    // Python's round_btc_bins = [600,601, 800,801, 1000,1001, 1200,1201, 1400,1401]
    // These are indices.
    for (const idx of ROUND_BTC_BINS_INDICES) {
        if (idx > 0 && idx < counts.length - 1) {
            counts[idx] = (counts[idx - 1] + counts[idx + 1]) / 2;
        }
    }

    // Normalize the curve (sum counts from bin 201 to 1600)
    let sumCounts = 0;
    for (let i = 201; i <= 1600; i++) {
        sumCounts += counts[i];
    }

    if (sumCounts > 0) {
        for (let i = 201; i <= 1600; i++) {
            counts[i] = counts[i] / sumCounts;
            // Cap at NORMALIZED_CURVE_CAP (0.008)
            if (counts[i] > NORMALIZED_CURVE_CAP) {
                counts[i] = NORMALIZED_CURVE_CAP;
            }
        }
    }
    return counts;
}

// --- Part 10: Stencil Creation ---
const STENCIL_SIZE = 803; // As per Python, length of p10_smooth_stencil / p10_spike_stencil

/**
 * Creates the smooth stencil for rough price estimation.
 * @returns {number[]} The smooth stencil array.
 */
export function createSmoothStencil(): number[] {
    const stencil = new Array(STENCIL_SIZE).fill(0);
    const center = 401; // Center index of the stencil (0 to 802)
    for (let i = 0; i < STENCIL_SIZE; i++) {
        const x = (i - center) / 100; // Scale factor as in Python
        stencil[i] = Math.exp(-x * x / 2); // Gaussian-like formula
    }
    return stencil;
}

/**
 * Creates the spike stencil for rough price estimation.
 * @returns {number[]} The spike stencil array.
 */
export function createSpikeStencil(): number[] {
    const stencil = new Array(STENCIL_SIZE).fill(0);
    // Values from Python's p10_spike_stencil definition
    stencil[0] = 1;   // Corresponds to $1 (USD price / BTC price = 0.001)
    stencil[200] = 1; // Corresponds to $10
    stencil[300] = 1; // Corresponds to $31.6
    stencil[400] = 1; // Corresponds to $100
    stencil[500] = 1; // Corresponds to $316
    stencil[600] = 1; // Corresponds to $1k
    stencil[700] = 1; // Corresponds to $3.16k
    stencil[800] = 1; // Corresponds to $10k
    return stencil;
}


// --- Part 10: Rough Price Estimation ---
/**
 * Estimates a rough BTC/USD price using stencil sliding.
 * @param {number[]} normalizedCurve - The normalized bell curve counts.
 * @param {number[]} bellCurveBins - The BTC amount for each bin in the bell curve.
 * @param {number[]} smoothStencil - The smooth stencil.
 * @param {number[]} spikeStencil - The spike stencil.
 * @returns {number} The rough BTC/USD price estimate in USD.
 */
export function estimateRoughPrice(
    normalizedCurve: number[],
    bellCurveBins: number[], // Used to convert slide to price
    smoothStencil: number[],
    spikeStencil: number[]
): number {
    let bestScore = -Infinity;
    let bestSlide = -1;

    // Slide range from MIN_SLIDE to MAX_SLIDE (0 to 600 in Python)
    for (let slide = MIN_SLIDE; slide <= MAX_SLIDE; slide++) {
        let slideScoreSmooth = 0;
        let slideScoreSpike = 0;

        for (let i = 0; i < STENCIL_SIZE; i++) {
            // bin_idx = i + slide + center_p001 (center_p001 = -600 from Python)
            // Python: p10_bell_curve[i + slide - 600]
            // stencil index `i` (0 to 802)
            // bell curve index `j = i + slide + CENTER_P001_OFFSET`
            const curveIndex = i + slide + CENTER_P001_OFFSET; // CENTER_P001_OFFSET is -600

            if (curveIndex >= 0 && curveIndex < normalizedCurve.length) {
                slideScoreSmooth += smoothStencil[i] * normalizedCurve[curveIndex];
                slideScoreSpike += spikeStencil[i] * normalizedCurve[curveIndex];
            }
        }

        let combinedScore: number;
        if (slide < SMOOTH_WEIGHT_THRESHOLD_SLIDE) { // slide < 150
            // smooth_weight = 1 - slide / 200 (Python) -> slide/ (BINS_PER_10X)
            const smoothWeight = 1 - slide / BINS_PER_10X; // BINS_PER_10X = 200
            combinedScore = (slideScoreSmooth * smoothWeight) + (slideScoreSpike * (1 - smoothWeight));
        } else {
            combinedScore = (slideScoreSmooth * 0.25) + (slideScoreSpike * 0.75); // Default weights
        }

        if (combinedScore > bestScore) {
            bestScore = combinedScore;
            bestSlide = slide;
        }
    }

    if (bestSlide === -1) {
        // This should ideally not happen if there's any data.
        // Fallback or error handling needed. For now, returning a placeholder.
        console.warn("estimateRoughPrice: bestSlide not found, returning 0. This may indicate issues with input data or parameters.");
        return 0; // Or throw an error
    }

    // Price calculation logic from Python:
    // p_slide = 10**(best_slide / 200)
    // p_slide_up = 10**((best_slide + 1) / 200)
    // p_slide_down = 10**((best_slide - 1) / 200)
    // score_up and score_down are calculated similarly to best_slide's score
    // rough_price_estimate = (p_slide*score + p_slide_up*score_up + p_slide_down*score_down) / (score + score_up + score_down)

    const calculateCombinedScore = (slide: number): number => {
        if (slide < MIN_SLIDE || slide > MAX_SLIDE) return 0; // Invalid slide for score calculation
        let scoreSmooth = 0;
        let scoreSpike = 0;
        for (let i = 0; i < STENCIL_SIZE; i++) {
            const curveIndex = i + slide + CENTER_P001_OFFSET;
            if (curveIndex >= 0 && curveIndex < normalizedCurve.length) {
                scoreSmooth += smoothStencil[i] * normalizedCurve[curveIndex];
                scoreSpike += spikeStencil[i] * normalizedCurve[curveIndex];
            }
        }
        if (slide < SMOOTH_WEIGHT_THRESHOLD_SLIDE) {
            const smoothWeight = 1 - slide / BINS_PER_10X;
            return (scoreSmooth * smoothWeight) + (scoreSpike * (1 - smoothWeight));
        }
        return (scoreSmooth * 0.25) + (scoreSpike * 0.75);
    };

    const scoreBest = bestScore;
    const scoreUp = calculateCombinedScore(bestSlide + 1);
    const scoreDown = calculateCombinedScore(bestSlide - 1);

    // Price associated with a slide: 10^(slide / BINS_PER_10X)
    // This is because each unit of slide corresponds to a 1/BINS_PER_10X change in log10(price).
    // slide = log10(price_usd_cents) * BINS_PER_10X
    // So, price_usd_cents = 10^(slide / BINS_PER_10X)
    // The price here is in USD cents.
    const priceSlide = Math.pow(10, bestSlide / BINS_PER_10X);
    const priceSlideUp = Math.pow(10, (bestSlide + 1) / BINS_PER_10X);
    const priceSlideDown = Math.pow(10, (bestSlide - 1) / BINS_PER_10X);
    
    let weightedPriceSum = priceSlide * scoreBest;
    let weightSum = scoreBest;

    // Python code chooses the better of up/down neighbor
    // Here, let's try to match the Python logic:
    // if score_up > score_down: rough_price_estimate = (p_slide*score + p_slide_up*score_up) / (score+score_up)
    // else: rough_price_estimate = (p_slide*score + p_slide_down*score_down) / (score+score_down)
    // If both scores are 0 or negative, it implies issues.
    
    let roughPriceEstimateCents: number;

    if (scoreUp > 0 || scoreDown > 0) { // Ensure there's a valid neighbor score
        if (scoreUp > scoreDown) {
            weightedPriceSum += priceSlideUp * scoreUp;
            weightSum += scoreUp;
        } else { // scoreDown >= scoreUp (if scoreUp is not > scoreDown)
            weightedPriceSum += priceSlideDown * scoreDown;
            weightSum += scoreDown;
        }
        roughPriceEstimateCents = weightedPriceSum / weightSum;
    } else { // Only bestSlide has a meaningful score, or all scores are bad
        roughPriceEstimateCents = priceSlide;
    }
    
    // The price from slide is in USD CENTS. Convert to USD.
    return roughPriceEstimateCents / 100;
}


// --- Part 11: Price Refinement ---

interface CentralOutputResult {
    centralPrice: number;
    meanAbsDev: number;
    count: number;
}

/**
 * Finds the central output price and mean absolute deviation from a list of prices.
 * This is a direct translation of Python's `p11_find_central_output`.
 * @param {number[]} prices - Array of USD prices (derived from UTXOs).
 * @param {number} priceMin - Minimum price for filtering.
 * @param {number} priceMax - Maximum price for filtering.
 * @returns {CentralOutputResult}
 */
function findCentralOutput(
    prices: number[],
    priceMin: number,
    priceMax: number
): CentralOutputResult {
    const p = prices.filter(price => price >= priceMin && price <= priceMax);
    if (p.length === 0) {
        return { centralPrice: 0, meanAbsDev: 0, count: 0 };
    }

    p.sort((a, b) => a - b); // Sort ascending

    let bestGap = Infinity;
    let bestI = -1;

    // Find point with smallest gap to next point, biased towards center
    for (let i = 0; i < p.length - 1; i++) {
        const gap = p[i+1] - p[i];
        // Bias: `abs(i - len(p)//2)`
        const bias = Math.abs(i - Math.floor((p.length -1) / 2));
        const biasedGap = gap * (1 + bias / p.length); // Python: gap * (1 + bias/len(p))

        if (biasedGap < bestGap) {
            bestGap = biasedGap;
            bestI = i;
        }
    }
    
    let centralPrice: number;
    if (bestI === -1 ) { // Only one element or no elements after filter.
        if (p.length > 0) centralPrice = p[Math.floor(p.length / 2)]; // Median if only one element
        else centralPrice = 0; // Should be caught by p.length === 0 earlier
    } else {
       centralPrice = (p[bestI] + p[bestI+1]) / 2;
    }


    if (p.length === 0) { // Recalculate median if list was empty initially or after filtering
         return { centralPrice: 0, meanAbsDev: 0, count: 0 };
    }
    
    // Calculate Mean Absolute Deviation (MAD) from the centralPrice
    let sumAbsDev = 0;
    for (const price of p) {
        sumAbsDev += Math.abs(price - centralPrice);
    }
    const meanAbsDev = p.length > 0 ? sumAbsDev / p.length : 0;

    return { centralPrice, meanAbsDev, count: p.length };
}


/**
 * Refines the rough BTC/USD price estimate.
 * @param {number} roughPriceEstimateUSD - The rough price estimate in USD.
 * @param {ProcessedOutput[]} allProcessedOutputs - All initially filtered transaction outputs.
 * @returns {number} The refined BTC/USD price in USD.
 */
export function refinePrice(
    roughPriceEstimateUSD: number,
    allProcessedOutputs: ProcessedOutput[]
): number {
    if (roughPriceEstimateUSD <= 0) {
        console.warn("Refine price called with non-positive rough estimate. Returning 0.");
        return 0;
    }
    // Python's usds list: [1, 1.5, 2, ..., 9000, 9500, 10000]
    // These are used as fixed USD amounts to divide BTC values by.
    // This creates a distribution of implied prices for each UTXO.
    const usds: number[] = [];
    for (let i = 1; i <= 9; i++) usds.push(i);
    for (let i = 10; i <= 90; i += 5) usds.push(i);
    for (let i = 100; i <= 900; i += 50) usds.push(i);
    for (let i = 1000; i <= 9000; i += 500) usds.push(i);
    usds.push(1.5, 2.5, 3.5, 4.5, // from original script
              10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000, 90000, 100000);
    usds.sort((a,b) => a-b);


    const outputPricesForRefinement: number[] = [];
    const microRemoveSet = new Set(MICRO_REMOVE_LIST_SATS.map(sats => sats / 1e8)); // Convert to BTC

    for (const output of allProcessedOutputs) {
        const valueBtc = output.valueBtc;
        if (microRemoveSet.has(valueBtc)) {
            continue;
        }
        for (const usdVal of usds) {
            // Implied price: usdVal / valueBtc
            // Only consider if this implied price is within PCT_RANGE_WIDE of the rough estimate
            const impliedPrice = usdVal / valueBtc;
            if (impliedPrice >= roughPriceEstimateUSD * (1 - PCT_RANGE_WIDE) &&
                impliedPrice <= roughPriceEstimateUSD * (1 + PCT_RANGE_WIDE)) {
                outputPricesForRefinement.push(impliedPrice);
            }
        }
    }

    if (outputPricesForRefinement.length === 0) {
        console.warn("No UTXO prices for refinement found near the rough estimate. Returning rough estimate.");
        return roughPriceEstimateUSD;
    }

    let centralPrice = roughPriceEstimateUSD;
    let meanAbsDev = roughPriceEstimateUSD * PCT_RANGE_WIDE; // Initial wide MAD

    for (let iter = 0; iter < MAX_REFINEMENT_ITERATIONS; iter++) {
        const priceMin = centralPrice * (1 - PCT_RANGE_NARROW);
        const priceMax = centralPrice * (1 + PCT_RANGE_NARROW);
        
        // Filter based on current centralPrice and its MAD, or PCT_RANGE_NARROW, whichever is tighter for bounds.
        // Python: range_limit = max(0.001, min(p11_mad, 0.01))
        // Here, using PCT_RANGE_NARROW for the iteration's bounds as per p11_central_price loop.
        // The actual filtering for findCentralOutput uses these narrow bounds.
        const result = findCentralOutput(outputPricesForRefinement, priceMin, priceMax);

        if (result.count === 0) {
            // If no prices in the narrow range, stop.
            // This might happen if PCT_RANGE_NARROW is too tight or data is sparse.
            // Python script has a check: if p11_count == 0: break
            console.warn(`Refinement iteration ${iter + 1}: No prices found in range [${priceMin.toFixed(2)}, ${priceMax.toFixed(2)}]. Stopping refinement.`);
            break;
        }
        
        const previousPrice = centralPrice;
        centralPrice = result.centralPrice;
        meanAbsDev = result.meanAbsDev; // This MAD is from the narrow-range calculation

        // Convergence check (e.g., if price changes by less than 0.01%)
        if (Math.abs(centralPrice - previousPrice) / previousPrice < 0.0001) {
             console.log(`Refinement converged at iteration ${iter + 1}.`);
            break;
        }
        if (iter === MAX_REFINEMENT_ITERATIONS -1) {
            console.log("Refinement reached max iterations.");
        }
    }

    return centralPrice;
}


// --- Main Orchestration Function ---

/**
 * Calculates the UTXOracle BTC/USD price from pre-filtered transaction outputs.
 *
 * @param {ProcessedOutput[]} filteredTransactionOutputs - Array of transaction outputs
 *   that have already passed initial filtering (input/output counts, coinbase, OP_RETURN,
 *   not same-day-reuse of inputs).
 * @returns {Promise<number>} The calculated BTC/USD price in USD.
 *   Returns 0 if the price cannot be determined.
 */
export async function calculateUtxoOraclePrice(
    filteredTransactionOutputs: ProcessedOutput[]
): Promise<number> {
    console.log(`Starting UTXO Oracle price calculation with ${filteredTransactionOutputs.length} pre-filtered outputs.`);

    if (filteredTransactionOutputs.length === 0) {
        console.warn("calculateUtxoOraclePrice: No filtered transaction outputs provided. Cannot calculate price.");
        return 0;
    }

    // 1. Bell Curve Generation
    const { bins: bellCurveBins, counts: initialCounts } = initializeBellCurve();
    console.log(`Initialized bell curve with ${bellCurveBins.length} bins.`);

    const populatedCounts = populateBellCurve(initialCounts, filteredTransactionOutputs);
    const nonZeroPopulated = populatedCounts.filter(c => c > 0).length;
    console.log(`Populated bell curve. Found ${nonZeroPopulated} non-zero bins.`);
    if (nonZeroPopulated === 0) {
        console.warn("Bell curve is empty after population. Cannot proceed.");
        return 0;
    }


    // 2. Bell Curve Normalization
    const normalizedCurve = normalizeBellCurve(populatedCounts);
    const nonZeroNormalized = normalizedCurve.filter(c => c > 0).length;
    console.log(`Normalized bell curve. Found ${nonZeroNormalized} non-zero bins after normalization.`);
     if (nonZeroNormalized === 0) {
        console.warn("Bell curve is empty after normalization. Cannot proceed.");
        return 0;
    }

    // 3. Stencil Creation
    const smoothStencil = createSmoothStencil();
    const spikeStencil = createSpikeStencil();
    console.log("Created smooth and spike stencils.");

    // 4. Rough Price Estimation
    const roughPriceEstimate = estimateRoughPrice(
        normalizedCurve,
        bellCurveBins, // Pass bins for price conversion if needed, though current estimateRoughPrice uses slide directly for price
        smoothStencil,
        spikeStencil
    );
    console.log(`Rough BTC/USD price estimate: $${roughPriceEstimate.toFixed(2)}`);
    if (roughPriceEstimate <= 0 || roughPriceEstimate < BTC_MIN_PRICE_CENTS/100 || roughPriceEstimate > BTC_MAX_PRICE_CENTS/100) {
        console.warn(`Rough price estimate $${roughPriceEstimate.toFixed(2)} is out of valid range or invalid. Cannot proceed with refinement.`);
        return 0; // Or return roughPriceEstimate if no refinement is desired in this case
    }

    // 5. Price Refinement
    // The `allProcessedOutputs` for `refinePrice` is the same list used for `populateBellCurve`.
    const finalPrice = refinePrice(roughPriceEstimate, filteredTransactionOutputs);
    console.log(`Refined BTC/USD price: $${finalPrice.toFixed(2)}`);
    
    if (finalPrice <= 0 || finalPrice < BTC_MIN_PRICE_CENTS/100 || finalPrice > BTC_MAX_PRICE_CENTS/100) {
        console.warn(`Final price $${finalPrice.toFixed(2)} is out of valid range or invalid. Returning 0 or rough estimate.`);
        // Depending on desired behavior, could return roughPriceEstimate here if finalPrice is invalid
        return 0; 
    }

    return finalPrice;
}
