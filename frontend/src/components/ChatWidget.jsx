import { useState, useRef, useEffect } from 'react'

const WELCOME_MESSAGE =
  "Hi! I'm Sibol, your virtual assistant. Ask me anything about our services, and I'll help you out!"

const QUICK_QUESTIONS = [
  'What services do you offer?',
  'How can I book a consultation?',
  'What are your prices?',
]

const EMAIL_REGEX = /[\w.+-]+@[\w-]+\.[\w.-]+/g
const NAME_REGEX = /(?:my name is|i am|i'm)\s+([A-Za-z][A-Za-z .'-]{1,40})/i

function BotAvatar() {
  return (
    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-green-400" viewBox="0 0 24 24" fill="none">
        <path d="M12 22V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 14C12 14 8 13 6 9C4 5 8 2 12 8" fill="currentColor" opacity="0.7" />
        <path d="M12 10C12 10 16 8 18 4C20 0 16 1 12 6" fill="currentColor" opacity="0.9" />
      </svg>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME_MESSAGE },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [lead, setLead] = useState({ name: '', email: '' })

  const listRef = useRef(null)
  const leadRef = useRef(lead)

  useEffect(() => {
    leadRef.current = lead
  }, [lead])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, typing])

  const extractName = (text) => {
    const match = text.match(NAME_REGEX)
    return match ? match[1].trim() : null
  }

  const extractEmail = (text) => {
    const match = text.match(EMAIL_REGEX)
    return match ? match[0] : null
  }

  const saveLead = async (name, email, transcript) => {
    try {
      const res = await fetch('/api/chat/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, transcript }),
      })
      return res.ok
    } catch {
      return false
    }
  }

  const captureLeadIfPresent = async (userText, transcript) => {
    const email = extractEmail(userText)
    if (!email || leadRef.current.email) return null

    const name = extractName(userText) || leadRef.current.name || 'Chat Visitor'
    const saved = await saveLead(name, email, transcript)
    if (saved) {
      setLead({ name, email })
      return { name, email }
    }
    return null
  }

  const send = async (text) => {
    const content = text.trim()
    if (!content || typing) return

    const userMessage = { role: 'user', content }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')

    const newLead = await captureLeadIfPresent(content, nextMessages)

    if (newLead) {
      const greeting = newLead.name === 'Chat Visitor' ? '' : `${newLead.name} `
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: `Got it, thanks ${greeting}!! I've noted your email, and our team will reach out to you soon. What else would you like to know?`,
        },
      ])
      return
    }

    setTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages,
          leadCaptured: !!leadRef.current.email,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || res.statusText)

      setMessages((m) => [...m, { role: 'assistant', content: data.message }])
    } catch (err) {
      const isNoApiKey =
        err?.message && err.message.includes('GEMINI_API_KEY')
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: isNoApiKey
            ? 'The assistant is not configured yet. Please ask the site owner to add their Gemini API key to the backend so I can start answering. 🌱'
            : "I'm having trouble connecting right now. Make sure the backend server is running on port 3000, then try again.",
        },
      ])
    } finally {
      setTyping(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const content = input.trim()
    if (!content || typing) return
    await send(content)
  }

  const inputClass =
    'flex-1 bg-white/60 dark:bg-white/[0.06] backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-full px-4 py-2.5 text-[13px] text-[#111] dark:text-[#f5f5f7] placeholder-[#999] dark:placeholder-[#666] focus:outline-none focus:border-green-400 dark:focus:border-green-500 transition-all duration-150'

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
          <button
            onClick={() => setIsOpen(true)}
            data-cursor="pointer"
            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-[0_4px_20px_rgba(34,197,94,0.4)] hover:shadow-[0_6px_28px_rgba(34,197,94,0.55)] flex items-center justify-center transition-all duration-200"
            aria-label="Open chat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-[380px] h-[560px] max-h-[calc(100vh-2.5rem)] flex flex-col rounded-2xl border border-white/20 dark:border-white/10 bg-black/30 dark:bg-black/40 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/5 dark:bg-white/[0.04]">
            <BotAvatar />
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-[#f5f5f7]">Sibol Assistant</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] text-[#aaa]">Online — replies instantly</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              data-cursor="pointer"
              className="w-7 h-7 flex items-center justify-center rounded-full text-[#aaa] hover:text-[#f5f5f7] hover:bg-white/10 transition-all duration-150"
              aria-label="Close chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
            {messages.map((msg, i) =>
              msg.role === 'assistant' ? (
                <div key={i} className="flex items-end gap-2">
                  <BotAvatar />
                  <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-white/10 dark:bg-white/10 border border-white/10 px-3.5 py-2.5 text-[13px] leading-relaxed text-[#eee]">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-green-500 text-white px-3.5 py-2.5 text-[13px] leading-relaxed shadow-[0_2px_12px_rgba(34,197,94,0.25)]">
                    {msg.content}
                  </div>
                </div>
              ),
            )}

            {typing && (
              <div className="flex items-end gap-2">
                <BotAvatar />
                <div className="rounded-2xl rounded-bl-sm bg-white/10 dark:bg-white/10 border border-white/10 px-4 py-3">
                  <TypingDots />
                </div>
              </div>
            )}

            {messages.length === 1 && !typing && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    data-cursor="pointer"
                    className="text-[11px] px-3 py-1.5 rounded-full border border-white/15 text-[#ccc] hover:text-[#f5f5f7] hover:border-green-400/60 hover:bg-green-500/10 transition-all duration-150"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-white/10 bg-white/5 dark:bg-white/[0.04]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                lead.email
                  ? 'Type a message...'
                  : 'Type a message... (share your email anytime)'
              }
              className={inputClass}
            />
            <button
              type="submit"
              disabled={typing || !input.trim()}
              data-cursor="pointer"
              className="w-10 h-10 shrink-0 rounded-full bg-green-500 hover:bg-green-600 disabled:opacity-40 text-white flex items-center justify-center transition-all duration-150 shadow-[0_2px_12px_rgba(34,197,94,0.3)]"
              aria-label="Send message"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}