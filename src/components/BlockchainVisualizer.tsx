"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Blockchain, Block } from "@/lib/blockchain";

export default function BlockchainVisualizer() {
  const [blockchain, setBlockchain] = useState(() => new Blockchain());
  const [blocks, setBlocks] = useState<Block[]>([blockchain.head]);
  const [newBlockData, setNewBlockData] = useState("");
  const [isChainValid, setIsChainValid] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, [blocks]);

  const addBlock = () => {
    if (!newBlockData.trim()) return;

    const newBlock = new Block(
      blockchain.getLatestBlock().index + 1,
      new Date().toISOString(),
      newBlockData
    );
    blockchain.addBlock(newBlock);
    setBlocks([...blocks, newBlock]);
    setNewBlockData("");
    setIsChainValid(blockchain.isChainValid());
  };

  const tamperBlock = (index: number) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index].data = "Tampered Data";
    updatedBlocks[index].hash = updatedBlocks[index].calculateHash();
    setBlocks(updatedBlocks);
    setIsChainValid(false);
  };

  const checkChainValidity = () => {
    const isValid = blockchain.isChainValid();
    setIsChainValid(isValid);
    alert(isValid ? "Blockchain is Valid" : "Blockchain is Invalid");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 space-y-6">
      {!isChainValid && (
        <div className="bg-red-600 text-white p-4 rounded-md font-bold text-center animate-pulse">
          Warning: Blockchain Integrity Compromised
        </div>
      )}

      <div className="space-y-4">
        <Input
          placeholder="Enter block data"
          value={newBlockData}
          onChange={(e) => setNewBlockData(e.target.value)}
          className="bg-gray-800 border-blue-500 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
        />
        <Button
          onClick={addBlock}
          disabled={!isChainValid || !newBlockData.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 transition-all duration-300 ease-in-out transform"
        >
          Add Block
        </Button>
        {!isChainValid && (
          <p className="text-red-500 text-sm">
            Cannot add new blocks while the chain is invalid.
          </p>
        )}
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-700">
        <div className="flex p-4 space-x-4" ref={scrollContainerRef}>
          <AnimatePresence>
            {blocks.map((block, index) => (
              <motion.div
                key={block.index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <Card
                  className={`w-64 transition-all duration-300 bg-gradient-to-br ${
                    !isChainValid && index > 0
                      ? "from-red-900 to-red-700"
                      : "from-gray-800 to-gray-700"
                  } border-2 ${
                    !isChainValid && index > 0
                      ? "border-red-500"
                      : "border-blue-500"
                  } shadow-lg hover:shadow-2xl`}
                >
                  <CardContent className="p-4 space-y-4">
                    <h3 className="text-2xl font-bold text-center mb-2">
                      Block {block.index}
                    </h3>
                    <p className="text-sm truncate">Data: {block.data}</p>
                    <p className="text-xs truncate font-mono">
                      Hash: {block.hash}
                    </p>

                    <div className="flex flex-col space-y-2">
                      {/* View Details Button */}
                      <div className="w-full">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-400"
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 text-white border-2 border-blue-500">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold">
                                Block {block.index} Details
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2 mt-4 text-[#71717A]">
                              <p>
                                <strong>Timestamp:</strong>{" "}
                                {new Date(block.timestamp).toLocaleString()}
                              </p>
                              <p>
                                <strong>Data:</strong> {block.data}
                              </p>
                              <p className="font-mono">
                                <strong>Previous Hash:</strong>{" "}
                                {block.previousHash}
                              </p>
                              <p className="font-mono">
                                <strong>Hash:</strong> {block.hash}
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {/* Tamper Block Button */}
                      {index > 0 && (
                        <div className="w-full">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => tamperBlock(index)}
                          >
                            Tamper Block
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {index < blocks.length - 1 && (
                  <div
                    className={`absolute top-1/2 right-0 w-4 h-0.5 ${
                      !isChainValid ? "bg-red-500" : "bg-blue-500"
                    } transform translate-x-full`}
                  >
                    <Zap
                      className={`absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 ${
                        !isChainValid ? "text-red-500" : "text-blue-500"
                      }`}
                      size={16}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Button
        onClick={checkChainValidity}
        className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 ease-in-out transform "
      >
        Check Chain Validity
      </Button>
    </div>
  );
}
