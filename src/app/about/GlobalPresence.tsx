const locations = ['Saudi Arabia', 'Turkey', 'Qatar', 'Europe']

const IconPin = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export default function GlobalPresence() {
  return (
    <section className="bg-white px-5 sm:px-6 lg:px-12 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14 sm:mb-20">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#8B1535] mb-4">
            International Presence
          </h2>
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#A8768A]">
            Crafting Legacies Across Borders
          </p>
        </div>

        {/* Location cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
          {locations.map((loc) => (
            <div key={loc} className="flex flex-col items-center gap-4">
              <div className="w-full aspect-square max-w-[140px] border border-[#E8E0DC] rounded-2xl flex items-center justify-center text-[#8B1535] hover:border-[#8B1535] hover:bg-[#FFF0F2] transition-colors">
                <IconPin />
              </div>
              <span className="text-sm font-semibold text-[#2A1018] tracking-wide text-center">
                {loc}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
