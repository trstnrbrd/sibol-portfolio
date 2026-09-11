import { useState } from 'react'

const CALENDLY_URL = 'https://calendly.com/your-username'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <>
      <div className="h-16" aria-hidden />

      <div className="fixed top-3 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="flex items-center gap-1 bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-xl rounded-full px-2 py-1.5 shadow-[0_1px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_20px_rgba(0,0,0,0.4)] border border-[#e8f5e9] dark:border-[#333]">

          <a href="#home" className="flex items-center gap-1.5 px-3 shrink-0" data-cursor="pointer">
            <svg className="w-4 h-4 text-green-500 dark:text-green-400 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M12 22V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M12 14C12 14 8 13 6 9C4 5 8 2 12 8" fill="currentColor" opacity="0.7" />
              <path d="M12 10C12 10 16 8 18 4C20 0 16 1 12 6" fill="currentColor" opacity="0.9" />
            </svg>
            <span className="text-[13px] font-semibold text-[#111] dark:text-[#f5f5f7] hidden sm:inline">
              Sibol<span className="text-green-500 dark:text-green-400">.ph</span>
            </span>
          </a>

          <div className="w-px h-4 bg-[#e8f5e9] dark:bg-[#333] hidden md:block" />

          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-cursor="pointer"
                className="text-[12px] font-medium text-[#666] dark:text-[#888] hover:text-[#111] dark:hover:text-[#f5f5f7] px-3 py-1.5 rounded-full hover:bg-green-50 dark:hover:bg-[#2a2a2a] transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="w-px h-4 bg-[#e8f5e9] dark:bg-[#333] hidden md:block" />

          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            className="text-[12px] font-semibold bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full transition-all duration-150 shrink-0"
          >
            Book a Call
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            data-cursor="pointer"
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full text-[#888] dark:text-[#888] hover:bg-green-50 dark:hover:bg-[#2a2a2a] transition-all duration-150 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </button>
        </nav>
      </div>

      {isOpen && (
        <div className="fixed top-[72px] left-4 right-4 z-50 md:hidden bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border border-[#e8f5e9] dark:border-[#333] rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-[13px] font-medium text-[#666] dark:text-[#888] hover:text-[#111] dark:hover:text-[#f5f5f7] px-4 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-[#2a2a2a] transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
