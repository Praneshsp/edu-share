'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("login data:", data);
  console.log("login error:", error);

  if (error) {
    return {
      success: false,
      error: error.message, // Send error message back
      code: error.code, // Capture Supabase error code
    };
  }

  revalidatePath("/", "layout");

  return {
    success: true,
    message: "Successfully logged in",
  };
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data,error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`
    }
  })
  console.log('signup data :',data)
  console.log('signup error :',error)
  
  if (error) {
    return { 
      success: false, 
      error: error.message 
    }
  }

  return { 
    success: true, 
    message: 'Please check your email to verify your account' 
  }
}
