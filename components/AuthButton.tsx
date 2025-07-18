"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex gap-[15px] mt-8 md:mt-0">
        <motion.div
          initial={{
            opacity: 0,
            y: 40
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.55,
            duration: 0.55,
            ease: [0.075, 0.82, 0.965, 1]
          }}
        >
          <button
            onClick={() => signOut()}
            className="group rounded-full pl-[8px] min-w-[120px] pr-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:bg-[#0D2247] no-underline active:scale-95 scale-100 duration-75"
            style={{
              boxShadow: "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)"
            }}
          >
            <span className="mr-2">Sign Out</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex gap-[15px] mt-8 md:mt-0">
      <motion.div
        initial={{
          opacity: 0,
          y: 40
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.55,
          duration: 0.55,
          ease: [0.075, 0.82, 0.965, 1]
        }}
      >
        <button
          onClick={() => signIn('google')}
          className="group rounded-full pl-[8px] min-w-[120px] pr-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:bg-[#0D2247] no-underline active:scale-95 scale-100 duration-75"
          style={{
            boxShadow: "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)"
          }}
        >
          <span className="mr-2">Sign In</span>
        </button>
      </motion.div>
    </div>
  );
}
