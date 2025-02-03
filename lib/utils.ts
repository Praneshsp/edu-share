import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { redirect } from 'next/navigation'
import { createClient } from "@/utils/supabase/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function checkUser() {
  const supabase = createClient()

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      console.log(error)
      redirect('/auth/login')
    }
    return user
  } catch (error) {
    console.log(error)
    redirect('/auth/login')
  }
}