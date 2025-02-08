
import { createClient } from "@/utils/supabase/server";


export async function getGroups() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("groups").select("*");

  if (error) {
    console.error("Error fetching groups:", error.message);
    return [];
  }

  return data;
}
