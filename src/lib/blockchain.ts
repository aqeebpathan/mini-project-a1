import SHA256 from "crypto-js/sha256";

export class Block {
  index: number;
  timestamp: string;
  data: string;
  previousHash: string;
  hash: string;
  next: Block | null;

  constructor(
    index: number,
    timestamp: string,
    data: string,
    previousHash = ""
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.next = null;
  }

  calculateHash() {
    const fullHash = SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
    // Shorten the hash to the first 16 characters
    return fullHash.substring(0, 32); // Change the number as needed for length
  }
}

export class Blockchain {
  head: Block;

  constructor() {
    this.head = this.createGenesisBlock();
  }

  createGenesisBlock() {
    return new Block(0, "01/01/2023", "Genesis Block", "0");
  }

  getLatestBlock() {
    let currentBlock = this.head;
    while (currentBlock.next) {
      currentBlock = currentBlock.next;
    }
    return currentBlock;
  }

  addBlock(newBlock: Block) {
    const latestBlock = this.getLatestBlock();
    newBlock.previousHash = latestBlock.hash;
    newBlock.hash = newBlock.calculateHash();
    latestBlock.next = newBlock;
  }

  isChainValid() {
    let currentBlock = this.head;
    while (currentBlock.next) {
      const nextBlock = currentBlock.next;
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      if (nextBlock.previousHash !== currentBlock.hash) {
        return false;
      }
      currentBlock = nextBlock;
    }
    return true;
  }
}

// // Proof of Work Algorithm
// function proofOfWork(block, difficulty) {
//   let nonce = 0; // A number to change the hash output
//   let hash;

//   do {
//     nonce++; // Increment nonce to change the hash result each time
//     hash = generateHash(block, nonce); // Generate a new hash with updated nonce
//   } while (!hash.startsWith("0".repeat(difficulty))); // Check if hash meets difficulty

//   return { hash, nonce };
// }

// // A function to generate a hash with the block data and nonce
// function generateHash(block, nonce) {
//   return (
//     block.number +
//     block.timestamp +
//     block.data +
//     block.previousHash +
//     nonce
//   )
//     .split("")
//     .map((char) => char.charCodeAt(0).toString(16))
//     .join("");
// }

// // Sample usage
// function addBlockWithProofOfWork(block, difficulty) {
//   const { hash, nonce } = proofOfWork(block, difficulty);
//   block.hash = hash; // Assign the new hash to the block
//   block.nonce = nonce; // Assign the nonce that generated the valid hash
// }
