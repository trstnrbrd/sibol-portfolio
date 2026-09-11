import { useState } from 'react'

const CALENDLY_URL = 'https://calendly.com/your-username'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] text-[#111] dark:text-[#f5f5f7] placeholder-[#ccc] dark:placeholder-[#666] focus:outline-none focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all duration-150'

  return (
    <section id="contact" className="py-24 relative z-0">
      <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
          Contact us
        </span>
        <h2 className="mt-3 text-[32px] sm:text-[36px] font-bold text-[#111] dark:text-[#f5f5f7] tracking-tight">
          Get In Touch
        </h2>
        <p className="mt-3 text-[14px] text-[#888] dark:text-[#666] max-w-[400px] mx-auto">
          Ready to start your project? Let's talk.
        </p>

        <div className="mt-14 grid lg:grid-cols-2 gap-8 text-left max-w-[860px] mx-auto">
          <div>
            <h3 className="text-[15px] font-semibold text-[#111] dark:text-[#f5f5f7] mb-5">
              Send us a message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#888] dark:text-[#666] mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#888] dark:text-[#666] mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#888] dark:text-[#666] mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell us about your project..."
                />
              </div>

              {status === 'success' && (
                <p className="text-[13px] text-green-600 dark:text-green-400">Message sent! We'll get back to you soon.</p>
              )}
              {status === 'error' && (
                <p className="text-[13px] text-red-500">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={loading}
                data-cursor="pointer"
                className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-[13px] font-medium px-7 py-3 rounded-full transition-all duration-150 shadow-[0_2px_12px_rgba(34,197,94,0.25)] hover:shadow-[0_4px_20px_rgba(34,197,94,0.35)]"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className="flex flex-col justify-center">
            <div className="bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-2xl p-8 text-center">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-5 border border-green-100 dark:border-green-900/30">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="text-[15px] font-semibold text-[#111] dark:text-[#f5f5f7] mb-2">
                Prefer to schedule a call?
              </h3>
              <p className="text-[13px] text-[#888] dark:text-[#666] mb-6">
                Book a free 30-minute consultation to discuss your project.
              </p>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="pointer"
                className="inline-block bg-green-500 hover:bg-green-600 text-white text-[13px] font-medium px-7 py-3 rounded-full transition-all duration-150 shadow-[0_2px_12px_rgba(34,197,94,0.25)] hover:shadow-[0_4px_20px_rgba(34,197,94,0.35)]"
              >
                Schedule on Calendly
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
