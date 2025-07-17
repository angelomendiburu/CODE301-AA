"use server"

import { signIn } from "@/auth"
import { redirect } from "next/navigation"

export async function googleSignIn() {
  try {
    await signIn("google")
    redirect("/")
  } catch (error) {
    console.error("Error during sign in:", error)
    throw error
  }
}
