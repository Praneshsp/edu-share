import { Sidebar } from '@/components/Sidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if(!user){
    redirect('/auth/login');
  }

  return (
    <div className="flex">
      <Sidebar user={user}/>
      <main className="flex-1 bg-bg-primary p-6">
        {children}
      </main>
    </div>
  )
}

/*
import Dashboard from '@/components/Dashboard'
import { createClient } from '@/utils/supabase/server'

export default async function Account() {


  return <Dashboard user={user} />
}
 */