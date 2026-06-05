interface Value { title: string; desc: string }
interface Props { narrative1: string; narrative2: string; values: Value[] }

const valueIcons = [
  <svg key="star" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  <svg key="palette" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12a10 10 0 0010 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>,
  <svg key="heart" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>,
]

export default function StoryValues({ narrative1, narrative2, values }: Props) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <div className="bg-white px-5 sm:px-10 lg:px-16 py-16 sm:py-24 border-r-0 md:border-r border-[#E8E0DC]">
        <div className="max-w-lg">
          <div className="w-1 h-10 bg-[#8B1535] mb-8" />
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#8B1535] mb-8">The Narrative</h2>
          <div className="flex flex-col gap-6 text-sm text-[#5A3A44] leading-8">
            <p>{narrative1}</p>
            <p>{narrative2}</p>
          </div>
        </div>
      </div>
      <div className="bg-[#FFF0F2] px-5 sm:px-10 lg:px-16 py-16 sm:py-24">
        <div className="max-w-lg">
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#8B1535] mb-10">Core Values</h2>
          <ul className="flex flex-col gap-10">
            {values.map(({ title, desc }, i) => (
              <li key={i} className="flex gap-5">
                <span className="shrink-0 mt-0.5 text-[#8B1535]">{valueIcons[i]}</span>
                <div>
                  <p className="text-sm font-bold tracking-wide text-[#8B1535] mb-2">{title}</p>
                  <p className="text-sm text-[#7A5560] leading-7">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
