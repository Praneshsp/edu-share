'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LogOut, 
  Users, 
  Video, 
} from 'lucide-react'
import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/client'

export function Sidebar({ user } : { user: any }) {
  const pathname = usePathname()
  const supabase = createClient();
  const router = useRouter();
  console.log(user)
  const menuItems = [
    { 
      href: '/dashboard/groups', 
      icon: Users, 
      label: 'Groups', 
      active: pathname.startsWith('/dashboard/groups') 
    },
    { 
      href: '/dashboard/mentors', 
      icon: Video, 
      label: 'Mentoring', 
      active: pathname.startsWith('/dashboard/mentors') 
    },
  ]

  const handleSignOut = () => {
    try {
      supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="bg-bg-secondary w-64 h-screen  border-r flex flex-col">
      <div className="mb-8 text-center p-4">
        <h1 className="text-3xl font-bold text-primary-blue italic tracking-tight underline ">EduShare</h1>
      </div>
      <nav className='p-4'>
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`
              flex items-center p-3 rounded-lg mb-2 transition-all
              ${item.active 
                ? 'bg-primary-gold text-white' 
                : 'text-text-primary hover:bg-secondary-gold'
              }
            `}
          >
            <item.icon className="mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
     <div className='mt-auto'>
     <hr className='w-full flex border-primary-gold border'/>
      <p className='pb-4 text-lg font-bold p-4'>

          {user.email}
          <Button className='mt-2' onClick={handleSignOut}>
            Logout <LogOut/>
          </Button>
      </p>
     </div>
    </div>
  )
}