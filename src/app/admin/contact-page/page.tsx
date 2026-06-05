import { getContactPage } from '@/lib/db/sections'
import ContactPageEditor from './ContactPageEditor'
export default async function Page() {
  const data = await getContactPage()
  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#2A1018] mb-2">Contact Page</h1>
      <p className="text-sm text-[#A8768A] mb-8">Edits the /contact page content.</p>
      <ContactPageEditor initialData={data} />
    </div>
  )
}
