import type { Metadata } from 'next'
import { getAboutPage } from '@/lib/db/sections'
import AboutHero from './AboutHero'
import AboutQuote from './AboutQuote'
import StoryValues from './StoryValues'
import GlobalPresence from './GlobalPresence'
import AboutCTA from './AboutCTA'

export const metadata: Metadata = {
  title: 'About — Weddiex',
  description: 'Meet Abeer Sawaan — the vision behind Weddiex fine art wedding photography.',
}

export default async function Page() {
  const c = await getAboutPage()
  return (
    <>
      <AboutHero eyebrow={c.eyebrow} name={c.name} description={c.description} imageUrl={c.image_url} />
      <AboutQuote quote={c.quote} attribution={c.attribution} />
      <StoryValues
        narrative1={c.narrative_1} narrative2={c.narrative_2}
        values={[
          { title: c.value1_title, desc: c.value1_desc },
          { title: c.value2_title, desc: c.value2_desc },
          { title: c.value3_title, desc: c.value3_desc },
        ]}
      />
      <GlobalPresence />
      <AboutCTA heading={c.cta_heading} subtext={c.cta_subtext} buttonLabel={c.cta_label} />
    </>
  )
}
