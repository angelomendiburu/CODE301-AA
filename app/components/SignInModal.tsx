"use client";

import { motion } from "framer-motion";
import { googleSignIn } from "../actions";

interface SignInModalProps {
  onClose: () => void;
}

export function SignInModal({ onClose }: SignInModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <span className="sr-only">Close</span>
          ×
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
        
        <button
          onClick={() => googleSignIn()}
          className="w-full mb-4 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-all duration-75"
        >
          Continue with Google
        </button>
      </div>
    </motion.div>
  );
}
