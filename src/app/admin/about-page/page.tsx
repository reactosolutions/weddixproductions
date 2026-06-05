import { getAboutPage } from '@/lib/db/sections'
import AboutPageEditor from './AboutPageEditor'
export default async function Page() {
  const data = await getAboutPage()
  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#2A1018] mb-2">About Page</h1>
      <p className="text-sm text-[#A8768A] mb-8">Edits the /about page content and photo.</p>
      <AboutPageEditor initialData={data} />
    </div>
  )
}
