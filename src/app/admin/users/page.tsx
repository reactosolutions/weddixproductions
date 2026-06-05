import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UsersManager from './UsersManager'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#2A1018] mb-2">Users</h1>
      <p className="text-xs text-[#A8768A] mb-8">Manage who has access to this admin panel.</p>
      <UsersManager currentUserId={user.id} />
    </div>
  )
}
