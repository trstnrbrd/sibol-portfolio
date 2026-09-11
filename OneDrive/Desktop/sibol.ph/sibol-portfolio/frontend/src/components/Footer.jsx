export default function Footer() {
  return (
    <footer className="relative z-0 border-t border-green-100/50 dark:border-[#222] py-12">
      <div className="max-w-[1000px] mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="md:col-span-2">
            <a href="#home" className="inline-flex items-center gap-1.5" data-cursor="pointer">
              <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none">
                <path d="M12 22V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M12 14C12 14 8 13 6 9C4 5 8 2 12 8" fill="currentColor" opacity="0.7" />
                <path d="M12 10C12 10 16 8 18 4C20 0 16 1 12 6" fill="currentColor" opacity="0.9" />
              </svg>
              <span className="text-[14px] font-semibold text-[#111] dark:text-[#f5f5f7]">
                Sibol<span className="text-green-500">.ph</span>
              </span>
            </a>
            <p className="mt-3 text-[13px] text-[#888] dark:text-[#666] max-w-[320px] leading-relaxed md:mx-0 mx-auto">
              Full-stack web development agency helping businesses grow online with modern, scalable digital experiences.
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-[#111] dark:text-[#f5f5f7] uppercase tracking-wider mb-4">Links</h4>
            <ul className="space-y-2.5">
              {['Home', 'Services', 'Portfolio', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    data-cursor="pointer"
                    className="text-[13px] text-[#888] dark:text-[#666] hover:text-green-600 dark:hover:text-green-400 transition-colors duration-150"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-[#111] dark:text-[#f5f5f7] uppercase tracking-wider mb-4">Connect</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" data-cursor="pointer" className="text-[13px] text-[#888] dark:text-[#666] hover:text-green-600 dark:hover:text-green-400 transition-colors duration-150">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" data-cursor="pointer" className="text-[13px] text-[#888] dark:text-[#666] hover:text-green-600 dark:hover:text-green-400 transition-colors duration-150">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="mailto:hello@sibol.ph" data-cursor="pointer" className="text-[13px] text-[#888] dark:text-[#666] hover:text-green-600 dark:hover:text-green-400 transition-colors duration-150">
                  hello@sibol.ph
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-100/50 dark:border-[#222] mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
          <p className="text-[12px] text-[#ccc] dark:text-[#555]">
            &copy; {new Date().getFullYear()} Sibol.ph
          </p>
          <p className="text-[12px] text-[#ccc] dark:text-[#555]">
            Built with care in the Philippines
          </p>
        </div>
      </div>
    </footer>
  )
}
