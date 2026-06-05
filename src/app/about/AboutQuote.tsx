interface Props { quote: string; attribution: string }

export default function AboutQuote({ quote, attribution }: Props) {
  return (
    <section className="bg-[#FFF0F2] px-5 sm:px-6 lg:px-12 py-20 sm:py-28">
      <div className="max-w-3xl mx-auto text-center">
        <svg className="mx-auto mb-6 text-[#D4949F] opacity-60" width="40" height="32" viewBox="0 0 40 32" fill="currentColor">
          <path d="M0 32V19.2C0 8.533 5.333 2.4 16 0l2.4 3.2C13.067 4.533 10.133 7.467 9.6 12H16V32H0zm24 0V19.2C24 8.533 29.333 2.4 40 0l2.4 3.2C37.067 4.533 34.133 7.467 33.6 12H40V32H24z" />
        </svg>
        <blockquote className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light italic text-[#2A1018] leading-[1.25] mb-8">
          {quote}
        </blockquote>
        <p className="text-xs tracking-[0.2em] uppercase text-[#A8768A]">— {attribution}</p>
      </div>
    </section>
  )
}
