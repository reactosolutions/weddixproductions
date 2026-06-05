import { getHomeServices } from '@/lib/db/sections'
import HomeServicesEditor from './HomeServicesEditor'
export default async function Page() {
  const data = await getHomeServices()
  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#2A1018] mb-2">Home — Artisan Services</h1>
      <p className="text-sm text-[#A8768A] mb-8">Edits the Services section on the home page.</p>
      <HomeServicesEditor initialData={data} />
    </div>
  )
}
