import { ThemeProvider } from './contexts/ThemeContext'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'

export default function App() {
  return (
    <ThemeProvider>
      <Cursor />
      <div className="min-h-screen font-sans">
        <Navbar />
        <Hero />
        <Services />
        <Portfolio />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
      <ChatWidget />
    </ThemeProvider>
  )
}
