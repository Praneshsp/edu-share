import { Sidebar } from '@/components/Sidebar'
import { createClient } from '@/utils/supabase/server'

export default async function GroupsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex">
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
