const testimonials = [
  {
    name: 'Maria Santos',
    role: 'CEO, TechStart PH',
    content: 'Sibol.ph transformed our outdated website into a modern, fast platform. Our conversion rate increased by 40% within the first month!',
    rating: 5,
  },
  {
    name: 'Gabriel Vicente',
    role: 'Founder, ShopLocal',
    content: 'The e-commerce platform they built handles thousands of orders daily without any issues. Their support team is always responsive and professional.',
    rating: 5,
  },
  {
    name: 'Sarah Garcia',
    role: 'Marketing Director, GrowthCo',
    content: 'Professional, skilled, and delivered ahead of schedule. The attention to detail in both design and code quality was impressive.',
    rating: 5,
  },
]

function StarIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative z-0 overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
          Testimonials
        </span>
        <h2 className="mt-3 text-[32px] sm:text-[36px] font-bold text-[#111] dark:text-[#f5f5f7] tracking-tight">
          What Clients Say
        </h2>
        <p className="mt-3 text-[14px] text-[#888] dark:text-[#666] max-w-[400px] mx-auto">
          Don't just take our word for it
        </p>

        <div className="mt-14 grid md:grid-cols-3 gap-4 text-left">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="p-6 rounded-2xl border border-white/60 dark:border-white/10 bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className="text-[13px] text-[#777] dark:text-[#999] leading-relaxed mb-6">
                "{testimonial.content}"
              </p>
              <div className="border-t border-green-100 dark:border-[#222] pt-4">
                <div className="text-[13px] font-medium text-[#111] dark:text-[#f5f5f7]">
                  {testimonial.name}
                </div>
                <div className="text-[12px] text-[#999] dark:text-[#666] mt-0.5">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
