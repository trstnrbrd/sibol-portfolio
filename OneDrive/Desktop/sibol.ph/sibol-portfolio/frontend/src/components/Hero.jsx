const CALENDLY_URL = 'https://calendly.com/your-username'

function HeroSprout() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32 sm:w-40 sm:h-40 text-green-500 dark:text-green-400 opacity-10 dark:opacity-8">
      <path d="M100 180V100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M100 120C100 120 70 115 55 85C40 55 65 35 100 80" fill="currentColor" opacity="0.4" />
      <path d="M100 100C100 100 130 90 145 60C160 30 135 15 100 70" fill="currentColor" opacity="0.3" />
      <path d="M100 85C100 85 110 65 107 50C104 35 95 40 100 60" fill="currentColor" opacity="0.2" />
    </svg>
  )
}

const brands = [
  'Globe Telecom',
  'Ayala Corp',
  'Jollibee Foods',
  'SM Investments',
  'BDO Unibank',
  'Ayala Land',
  'BPI',
  'Manila Water',
  'Universal Robina',
  'Emperador',
  'Monde Nissin',
  'DMCI Holdings',
]

export default function Hero() {
  return (
    <>
      {/* Full-viewport animated gradient behind everything */}
      <div className="fixed inset-0 -z-10 hero-bg-dark" />

      <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <HeroSprout />
        </div>

        <div className="relative z-10 max-w-[640px] mx-auto">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium text-green-600 dark:text-green-400 mb-8 tracking-wide uppercase bg-green-100/70 dark:bg-green-950/30 px-3 py-1 rounded-full border border-green-200 dark:border-green-900/30">
            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
            Web Development Agency
          </div>

          <h1 className="text-[44px] sm:text-[56px] lg:text-[64px] font-bold leading-[1.05] tracking-[-0.03em] text-[#111] dark:text-[#f5f5f7]">
            Sibol
            <br />
            <span className="font-light text-[#999] dark:text-[#666]">Helping Businesses</span>
            <br />
            <span className="text-green-600 dark:text-green-400">Grow Online</span>
          </h1>

          <p className="mt-6 text-[15px] text-[#777] dark:text-[#888] leading-relaxed max-w-[440px] mx-auto">
            We craft modern, scalable web experiences that help your business thrive in the digital landscape.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="bg-green-500 hover:bg-green-600 text-white text-[13px] font-medium px-7 py-3 rounded-full transition-all duration-150 shadow-[0_2px_12px_rgba(34,197,94,0.25)] hover:shadow-[0_4px_20px_rgba(34,197,94,0.35)]"
            >
              Book a Free Consultation
            </a>
            <a
              href="#portfolio"
              data-cursor="pointer"
              className="text-[13px] font-medium text-[#888] dark:text-[#999] hover:text-green-600 dark:hover:text-green-400 px-7 py-3 rounded-full border border-green-200 dark:border-[#333] hover:border-green-300 dark:hover:border-green-800 transition-colors duration-150"
            >
              View Our Work
            </a>
          </div>
        </div>

        {/* Brand logos marquee */}
        <div className="relative z-10 mt-20 w-full max-w-[800px] mx-auto">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#bbb] dark:text-[#555] mb-6 font-medium">
            Trusted by
          </p>
          <div className="overflow-hidden mask-gradient">
            <div className="flex gap-12 animate-marquee whitespace-nowrap">
              {[...brands, ...brands].map((brand, i) => (
                <span
                  key={`${brand}-${i}`}
                  className="text-[15px] font-semibold text-[#ccc]/70 dark:text-[#444] shrink-0 tracking-tight"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
