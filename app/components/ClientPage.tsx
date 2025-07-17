'use client'

import { AnimatePresence } from "framer-motion"
import { gradient } from "@/components/Gradient"
import { useEffect, useState } from "react"
import { SignInModal } from "./SignInModal"
import { Session } from "next-auth"
import { type FC } from 'react'

interface ClientPageProps {
  session: Session | null
}

export const ClientPage: FC<ClientPageProps> = ({ session }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const initGrad = async () => {
      try {
        await gradient.initGradient("#gradient-canvas")
      } catch (error) {
        console.error("Error initializing gradient:", error)
      }
    }
    initGrad()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <canvas id="gradient-canvas" className="fixed inset-0 -z-10" />
      <AnimatePresence>
        {isModalOpen && <SignInModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
      
      <main className="flex-grow">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold mb-8">Welcome to StartupTech</h1>
          <div className="space-x-4">
            {!session ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Sign In
              </button>
            ) : (
              <div className="text-lg">
                Welcome back, {session.user?.name}!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
