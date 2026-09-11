import { useState, useRef } from 'react'

const services = [
  {
    title: 'Web Design',
    description: 'Beautiful, modern designs that capture your brand identity and engage your audience.',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="14" rx="3" />
        <path d="M3 9h18" />
        <path d="M9 20h6" />
        <path d="M12 17v3" />
      </svg>
    ),
  },
  {
    title: 'Full-Stack Development',
    description: 'Robust applications built with modern technologies like React, Node.js, and PostgreSQL.',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6l-4 6 4 6" />
        <path d="M16 6l4 6-4 6" />
        <path d="M14 4l-4 16" />
      </svg>
    ),
  },
  {
    title: 'E-Commerce',
    description: 'Custom online stores with secure payment processing and inventory management.',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    title: 'SEO & Performance',
    description: 'Optimize your site for search engines and ensure lightning-fast load times.',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: 'Mobile Apps',
    description: 'Cross-platform mobile applications using React Native for iOS and Android.',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="3" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
  {
    title: 'Maintenance & Support',
    description: 'Ongoing support, updates, and monitoring to keep your application running smoothly.',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
]

export default function Services() {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector('[data-card]')?.offsetWidth || 300
    el.scrollBy({ left: dir * (cardWidth + 16), behavior: 'smooth' })
  }

  return (
    <section id="services" className="py-24 relative z-0">
      <div className="max-w-[1000px] mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
            What we do
          </span>
          <h2 className="mt-3 text-[32px] sm:text-[36px] font-bold text-[#111] dark:text-[#f5f5f7] tracking-tight">
            Our Services
          </h2>
          <p className="mt-3 text-[14px] text-[#888] dark:text-[#666] max-w-[400px] mx-auto">
            End-to-end solutions tailored for your digital growth
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            data-cursor="pointer"
            disabled={!canScrollLeft}
            className={`absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] border border-green-100 dark:border-[#333] shadow-md flex items-center justify-center transition-all duration-150 ${
              canScrollLeft ? 'opacity-100 hover:shadow-lg' : 'opacity-0 pointer-events-none'
            }`}
          >
            <svg className="w-4 h-4 text-[#111] dark:text-[#f5f5f7]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-2 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {services.map((service) => (
              <div
                key={service.title}
                data-card
                data-cursor="pointer"
                className="group flex-shrink-0 w-[280px] snap-start p-6 rounded-2xl border border-white/60 dark:border-white/10 bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl hover:border-green-300/50 dark:hover:border-green-500/30 hover:shadow-[0_8px_32px_rgba(34,197,94,0.12)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-950/40 mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors duration-200">
                  {service.icon}
                </div>
                <h3 className="text-[14px] font-semibold text-[#111] dark:text-[#f5f5f7] mb-1.5">
                  {service.title}
                </h3>
                <p className="text-[13px] text-[#888] dark:text-[#666] leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll(1)}
            data-cursor="pointer"
            disabled={!canScrollRight}
            className={`absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] border border-green-100 dark:border-[#333] shadow-md flex items-center justify-center transition-all duration-150 ${
              canScrollRight ? 'opacity-100 hover:shadow-lg' : 'opacity-0 pointer-events-none'
            }`}
          >
            <svg className="w-4 h-4 text-[#111] dark:text-[#f5f5f7]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center gap-1.5 mt-8">
          {services.map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-green-200 dark:bg-[#333]"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
