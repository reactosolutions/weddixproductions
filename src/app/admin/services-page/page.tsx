import { getServicesPage } from '@/lib/db/sections'
import ServicesPageEditor from './ServicesPageEditor'
export default async function Page() {
  const data = await getServicesPage()
  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#2A1018] mb-2">Services Page</h1>
      <p className="text-sm text-[#A8768A] mb-8">Edits the /services page content and photos.</p>
      <ServicesPageEditor initialData={data} />
    </div>
  )
}
