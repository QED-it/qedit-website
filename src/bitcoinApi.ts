import axios, { AxiosInstance, AxiosError } from 'axios';

const BASE_URL = 'https://blockstream.info/api';

// Configure Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'User-Agent': 'BitcoinBlockExplorer/1.0.0', // Example User-Agent
  },
});

// Helper function for error handling
const handleError = (error: any, functionName: string): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Error in ${functionName}: Status ${axiosError.response.status} - ${axiosError.response.statusText}`);
      console.error('Response data:', axiosError.response.data);
      throw new Error(`API Error in ${functionName}: ${axiosError.response.status} - ${axiosError.response.data}`);
    } else if (axiosError.request) {
      // The request was made but no response was received
      console.error(`Error in ${functionName}: No response received from server.`);
      throw new Error(`Network Error in ${functionName}: No response received.`);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`Error in ${functionName}: ${axiosError.message}`);
      throw new Error(`Request Setup Error in ${functionName}: ${axiosError.message}`);
    }
  } else {
    // Non-Axios error
    console.error(`Unexpected error in ${functionName}:`, error);
    throw new Error(`Unexpected error in ${functionName}: ${error.message || error}`);
  }
};


// --- Interfaces ---

export interface TxInput {
  txid: string;
  vout: number;
  is_coinbase: boolean;
  // prevout might be needed if not a coinbase
  prevout?: TxOutput; // For non-coinbase, this would contain the previous output
  scriptsig_asm?: string; // ScriptSig in assembly format
  witness?: string[]; // SegWit witness data
}

export interface TxOutput {
  value: number; // in satoshis
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  scriptpubkey_address?: string; // Address, if available
}

export interface TransactionStatus {
  confirmed: boolean;
  block_height: number | null;
  block_hash: string | null;
  block_time: number | null; // Unix timestamp
}

export interface Transaction {
  txid: string;
  version: number;
  locktime: number;
  vin: TxInput[];
  vout: TxOutput[];
  size: number;
  weight: number;
  fee: number; // in satoshis
  status: TransactionStatus;
}

export interface BlockInfo {
  id: string; // Block hash
  height: number;
  version: number;
  timestamp: number; // Unix timestamp
  tx_count: number;
  size: number;
  weight: number;
  merkle_root: string;
  // previousblockhash will be fetched separately if needed for Block type
}

// Extended Block interface for getBlock, including transaction IDs
export interface BlockWithTxids extends BlockInfo {
  txids: string[];
}


// --- API Functions ---

/**
 * Fetches the height of the latest block.
 * @returns Promise<number> The current block height.
 */
export const getLatestBlockHeight = async (): Promise<number> => {
  try {
    const response = await apiClient.get<string>('/blocks/tip/height');
    return parseInt(response.data, 10);
  } catch (error) {
    return handleError(error, 'getLatestBlockHeight');
  }
};

/**
 * Fetches the hash of a block at a given height.
 * @param height The block height.
 * @returns Promise<string> The block hash.
 */
export const getBlockHash = async (height: number): Promise<string> => {
  try {
    const response = await apiClient.get<string>(`/block-height/${height}`);
    return response.data;
  } catch (error) {
    return handleError(error, `getBlockHash(height: ${height})`);
  }
};

/**
 * Fetches detailed information for a block, given its hash.
 * This includes tx_count, but not the full list of transactions or their IDs.
 * @param hash The block hash.
 * @returns Promise<BlockInfo> The block information.
 */
export const getBlockInfo = async (hash: string): Promise<BlockInfo> => {
  try {
    const response = await apiClient.get<BlockInfo>(`/block/${hash}`);
    return response.data;
  } catch (error) {
    return handleError(error, `getBlockInfo(hash: ${hash})`);
  }
};


/**
 * Fetches detailed information for a block, including its transaction IDs.
 * @param hash The block hash.
 * @returns Promise<BlockWithTxids> The block information with transaction IDs.
 */
export const getBlock = async (hash: string): Promise<BlockWithTxids> => {
  try {
    // First, get the basic block information
    const blockInfoPromise = apiClient.get<BlockInfo>(`/block/${hash}`);
    // Then, get the list of transaction IDs for the block
    const txidsPromise = apiClient.get<string[]>(`/block/${hash}/txids`);

    const [blockInfoResponse, txidsResponse] = await Promise.all([blockInfoPromise, txidsPromise]);
    
    return {
      ...blockInfoResponse.data,
      txids: txidsResponse.data,
    };
  } catch (error) {
    return handleError(error, `getBlock(hash: ${hash})`);
  }
};


/**
 * Fetches a single transaction by its ID.
 * @param txid The transaction ID.
 * @returns Promise<Transaction> The transaction details.
 */
export const getTransaction = async (txid: string): Promise<Transaction> => {
  try {
    const response = await apiClient.get<Transaction>(`/tx/${txid}`);
    return response.data;
  } catch (error) {
    return handleError(error, `getTransaction(txid: ${txid})`);
  }
};

// --- Combined Operations ---

/**
 * Fetches all transactions for a given block hash.
 * It first gets the block to retrieve all txids, then fetches each transaction.
 * @param blockHash The hash of the block.
 * @returns Promise<Transaction[]> An array of transactions.
 */
export const getTransactionsForBlock = async (blockHash: string): Promise<Transaction[]> => {
  console.log(`Fetching transactions for block: ${blockHash}`);
  try {
    const block = await getBlock(blockHash); // Gets block info including txids
    console.log(`Found ${block.tx_count} transactions in block ${blockHash}. Fetching details...`);

    // In an environment with actual rate limits, we might need to batch these
    // or introduce delays. For now, fetching all concurrently.
    const transactionPromises = block.txids.map(txid => getTransaction(txid));
    const transactions = await Promise.all(transactionPromises);
    console.log(`Successfully fetched ${transactions.length} transactions for block ${blockHash}`);
    return transactions;
  } catch (error) {
    // handleError is already called by getBlock or getTransaction,
    // but we might want to add specific context here or re-throw.
    console.error(`Failed to get all transactions for block ${blockHash}:`, error);
    // Re-throw the error to be handled by the caller
    throw error; 
  }
};


/**
 * Finds all blocks mined on a specific UTC date.
 * @param targetDateStr UTC date string in "YYYY-MM-DD" format.
 * @returns Promise<{ id: string; height: number; timestamp: number; }[]> Array of block metadata.
 */
export const findBlocksForDate = async (
  targetDateStr: string
): Promise<{ id: string; height: number; timestamp: number; }[]> => {
  console.log(`Searching for blocks on date: ${targetDateStr}`);
  const targetDate = new Date(`${targetDateStr}T00:00:00.000Z`);
  const targetTimestampStart = targetDate.getTime() / 1000; // Convert to seconds
  targetDate.setDate(targetDate.getDate() + 1);
  const targetTimestampEnd = targetDate.getTime() / 1000; // Convert to seconds

  const blocksOnDate: { id: string; height: number; timestamp: number; }[] = [];

  try {
    let currentHeight = await getLatestBlockHeight();
    let earliestBlockTimestampChecked = Infinity; // To detect if we've gone too far back

    // Estimate starting height (very rough, assumes ~10 min blocks)
    // This is a heuristic and might need several adjustments
    const now = Math.floor(Date.now() / 1000);
    const secondsSinceTarget = now - targetTimestampStart;
    const estimatedBlocksSinceTarget = Math.floor(secondsSinceTarget / (10 * 60));
    let searchHeight = Math.max(1, currentHeight - estimatedBlocksSinceTarget); 

    console.log(`Initial search height estimate: ${searchHeight} (current tip: ${currentHeight})`);

    // Iteratively search backwards to find the first block of the target day
    let firstBlockOfTargetDayFound = false;
    let blockSearchAttempts = 0;
    const MAX_SEARCH_ATTEMPTS = 500; // Safety break for the search loop

    while (searchHeight > 0 && blockSearchAttempts < MAX_SEARCH_ATTEMPTS) {
      blockSearchAttempts++;
      let blockHash: string;
      try {
        blockHash = await getBlockHash(searchHeight);
      } catch (e: any) {
        if (e.message && e.message.includes("404") && e.message.includes("No block found")) {
          console.warn(`Block at height ${searchHeight} not found, trying previous height.`);
          searchHeight--; // Block might not exist (e.g. during sync)
          continue;
        }
        throw e; // Re-throw other errors
      }
      
      const block = await getBlockInfo(blockHash);
      earliestBlockTimestampChecked = Math.min(earliestBlockTimestampChecked, block.timestamp);

      if (block.timestamp < targetTimestampStart) {
        // We've gone too far back, or the first block of the day is the next one
        if (!firstBlockOfTargetDayFound) {
           // If the *previous* block (searchHeight + 1) was the first, we start from there
           // This means block.timestamp is before target, so (searchHeight + 1) could be on or after target
           searchHeight++; // Adjust to check the block that was *after* this one
           console.log(`Overshot: block ${block.height} at ${new Date(block.timestamp * 1000).toISOString()} is before target. Adjusting search to height ${searchHeight}.`);
        }
        break; // Exit the backward search
      } else if (block.timestamp >= targetTimestampStart && block.timestamp < targetTimestampEnd) {
        // This block is within the target day, but we need to find the *first* one.
        // So, keep searching backwards.
        firstBlockOfTargetDayFound = true;
        console.log(`Block ${block.height} at ${new Date(block.timestamp*1000).toISOString()} is on target day. Continuing search for earlier blocks on this day.`);
        searchHeight--;
      } else { // block.timestamp >= targetTimestampEnd
        // This block is after the target day, continue searching backwards.
        console.log(`Block ${block.height} at ${new Date(block.timestamp*1000).toISOString()} is after target day. Searching previous block.`);
        searchHeight--;
      }
       if (searchHeight <= 0) {
         console.log("Reached genesis block or height 0 during backward search.");
         searchHeight = 1; // Start collecting from the first valid block if we hit the bottom
         break;
       }
    }
    
    if (blockSearchAttempts >= MAX_SEARCH_ATTEMPTS) {
        console.warn("Reached max search attempts looking for first block of the day.");
        // Depending on requirements, could throw error or return what's found.
        // For now, proceed with current searchHeight.
    }


    console.log(`Starting to collect blocks from height: ${searchHeight}`);
    // Now, iterate forward from the determined searchHeight
    let collectionHeight = searchHeight;
    while (true) {
      let blockHash: string;
      try {
        blockHash = await getBlockHash(collectionHeight);
      } catch (e:any) {
         if (e.message && e.message.includes("404") && e.message.includes("No block found")) {
          console.warn(`Block at height ${collectionHeight} not found while collecting. This might be the current tip. Stopping.`);
          break;
        }
        throw e;
      }
      
      const block = await getBlockInfo(blockHash);

      if (block.timestamp >= targetTimestampEnd) {
        // This block is on the next day, so we stop.
        console.log(`Block ${block.height} at ${new Date(block.timestamp * 1000).toISOString()} is after target day. Collection finished.`);
        break;
      }

      if (block.timestamp >= targetTimestampStart) {
        // This block is within the target day.
        blocksOnDate.push({ id: block.id, height: block.height, timestamp: block.timestamp });
        // console.log(`Collected block ${block.height} (Timestamp: ${new Date(block.timestamp * 1000).toISOString()})`);
      }
      
      collectionHeight++;
      // Safety break: if we somehow loop too many times past the current tip (e.g., > 200 blocks beyond tip)
      if (collectionHeight > currentHeight + 200) {
          console.warn("Collection height significantly exceeds current chain tip. Breaking.");
          break;
      }
    }

    console.log(`Found ${blocksOnDate.length} blocks for date ${targetDateStr}.`);
    return blocksOnDate.sort((a, b) => a.height - b.height); // Sort by height just in case

  } catch (error) {
    // handleError is called by underlying functions, but we add context.
    console.error(`Failed to find blocks for date ${targetDateStr}:`, error);
    throw error; // Re-throw
  }
};


/**
 * Gets the most recent 'count' blocks.
 * @param count Number of recent blocks to fetch.
 * @returns Promise<{ id: string; height: number; timestamp: number; }[]> Array of block metadata.
 */
export const getRecentBlocks = async (
  count: number
): Promise<{ id: string; height: number; timestamp: number; }[]> => {
  if (count <= 0) {
    return [];
  }
  console.log(`Fetching ${count} recent blocks.`);
  try {
    const latestHeight = await getLatestBlockHeight();
    const recentBlocks: { id: string; height: number; timestamp: number; }[] = [];

    const startHeight = Math.max(0, latestHeight - count + 1); // Ensure height doesn't go below 0

    for (let h = startHeight; h <= latestHeight; h++) {
      try {
        const hash = await getBlockHash(h);
        // We only need id, height, timestamp for "recent blocks mode"
        // Getting full block info might be too slow if count is large.
        // Blockstream's API doesn't have an endpoint for just block header by height.
        // We can fetch `/api/block/:hash` and just take what we need, or optimize if needed.
        // For now, let's get the BlockInfo to have the timestamp.
        const block = await getBlockInfo(hash); 
        recentBlocks.push({ id: block.id, height: block.height, timestamp: block.timestamp });
      } catch (error: any) {
         // If a block in this range is not found (e.g. reorg during fetch), skip it or handle
         console.warn(`Could not fetch block at height ${h}: ${error.message}. Skipping.`);
      }
    }
    console.log(`Successfully fetched ${recentBlocks.length} recent blocks.`);
    return recentBlocks.sort((a,b)=> a.height - b.height); // Ensure sorted by height
  } catch (error) {
    console.error(`Failed to get recent ${count} blocks:`, error);
    throw error; // Re-throw
  }
};

// Example of how to allow base URL configuration for testing
export const TESTING_ONLY = {
  setBaseUrl: (newUrl: string) => {
    apiClient.defaults.baseURL = newUrl;
    console.warn(`API base URL changed to: ${newUrl} for testing purposes.`);
  },
  resetBaseUrl: () => {
    apiClient.defaults.baseURL = BASE_URL;
  }
};
