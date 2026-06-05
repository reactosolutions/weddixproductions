import { getHomeAboutTeaser } from '@/lib/db/sections'
import AboutTeaserEditor from './AboutTeaserEditor'
export default async function Page() {
  const data = await getHomeAboutTeaser()
  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#2A1018] mb-2">Home — Our Philosophy</h1>
      <p className="text-sm text-[#A8768A] mb-8">Edits the About Teaser section on the home page.</p>
      <AboutTeaserEditor initialData={data} />
    </div>
  )
}
