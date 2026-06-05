import { getHeroContent } from '@/lib/db/settings'
import HeroEditor from './HeroEditor'

export default async function AdminHeroPage() {
  const hero = await getHeroContent()
  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#2A1018] mb-2">Hero Section</h1>
      <p className="text-sm text-[#A8768A] mb-8">Changes go live on the home page immediately after saving.</p>
      <HeroEditor initialHero={hero} />
    </div>
  )
}
