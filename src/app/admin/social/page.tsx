import { getSocialLinks } from '@/lib/db/sections'
import SocialLinksEditor from './SocialLinksEditor'

export default async function Page() {
  const data = await getSocialLinks()
  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#2A1018] mb-8">Social Links</h1>
      <SocialLinksEditor initialData={data} />
    </div>
  )
}
