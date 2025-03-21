
import { Resource } from "@/components/ResourceManager";
import { createClient } from "@/utils/supabase/client";

// add response type
export async function getResources(groupId: string): Promise<Resource[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("group_resources").select("*").eq("group_id", groupId);

  if (error) {
    console.error("Error fetching resources:", error.message);
    return [];
  }

  return data;
}
