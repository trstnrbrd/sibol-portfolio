import { useState, useRef } from 'react'

const projects = [
  {
    title: 'E-Commerce Platform',
    category: 'Web Development',
    description: 'Full-stack online store with payment processing and admin dashboard.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    accent: '#22c55e',
  },
  {
    title: 'Restaurant Booking App',
    category: 'Mobile App',
    description: 'Table reservation system with real-time availability and notifications.',
    tech: ['React Native', 'Firebase', 'Google Maps'],
    accent: '#16a34a',
  },
  {
    title: 'SaaS Dashboard',
    category: 'Web Application',
    description: 'Analytics dashboard with real-time data visualization and reporting.',
    tech: ['Next.js', 'D3.js', 'Tailwind CSS'],
    accent: '#15803d',
  },
  {
    title: 'Healthcare Portal',
    category: 'Web Development',
    description: 'Patient management system with appointment scheduling and records.',
    tech: ['React', 'Express', 'MongoDB'],
    accent: '#4ade80',
  },
  {
    title: 'Fintech Wallet',
    category: 'Web Application',
    description: 'Digital wallet with real-time transactions and bill payments.',
    tech: ['Next.js', 'Prisma', 'PostgreSQL'],
    accent: '#22c55e',
  },
  {
    title: 'Logistics Tracker',
    category: 'Web Development',
    description: 'Real-time package tracking with route optimization and notifications.',
    tech: ['React', 'Node.js', 'Redis'],
    accent: '#16a34a',
  },
]

export default function Portfolio() {
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
    const cardWidth = el.querySelector('[data-card]')?.offsetWidth || 340
    el.scrollBy({ left: dir * (cardWidth + 16), behavior: 'smooth' })
  }

  return (
    <section id="portfolio" className="py-24 relative z-0">
      <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
          Our work
        </span>
        <h2 className="mt-3 text-[32px] sm:text-[36px] font-bold text-[#111] dark:text-[#f5f5f7] tracking-tight">
          Featured Projects
        </h2>
        <p className="mt-3 text-[14px] text-[#888] dark:text-[#666] max-w-[400px] mx-auto">
          A selection of our recent work
        </p>

        <div className="relative mt-14">
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
            {projects.map((project) => (
              <div
                key={project.title}
                data-card
                data-cursor="pointer"
                className="group flex-shrink-0 w-[320px] snap-start border border-white/60 dark:border-white/10 bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-[0_8px_32px_rgba(34,197,94,0.12)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300"
              >
                <div className="h-40 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-[#222] dark:to-[#1a1a1a] relative overflow-hidden flex items-center justify-center">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white group-hover:scale-110 transition-transform duration-500 shadow-lg"
                    style={{ backgroundColor: project.accent }}
                  >
                    {project.title.charAt(0)}
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-[11px] font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">
                    {project.category}
                  </span>
                  <h3 className="text-[15px] font-semibold text-[#111] dark:text-[#f5f5f7] mt-1.5">
                    {project.title}
                  </h3>
                  <p className="text-[13px] text-[#888] dark:text-[#666] mt-1.5 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] bg-green-50 dark:bg-[#222] text-green-700 dark:text-[#999] px-2.5 py-1 rounded-full border border-green-100 dark:border-transparent"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
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
      </div>
    </section>
  )
}
