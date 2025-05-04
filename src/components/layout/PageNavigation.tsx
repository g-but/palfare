import { Home, Heart, DollarSign, BarChart2, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PageNavigationProps {
  className?: string
}

export function PageNavigation({ className = '' }: PageNavigationProps) {
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['mission', 'support', 'transparency', 'accountability']
      const scrollPosition = window.scrollY + 100 // Offset for header

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed left-0 top-0 h-screen w-16 bg-white border-r border-gray-200 pt-24 ${className}`}>
      <div className="flex flex-col items-center space-y-4 px-2">
        <a 
          href="#mission" 
          className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${
            activeSection === 'mission' 
              ? 'bg-orange-100 text-orange-500' 
              : 'text-gray-700 hover:text-orange-500 hover:bg-gray-100'
          }`}
          title="Mission"
        >
          <Home className="h-6 w-6" />
        </a>
        <a 
          href="#support" 
          className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${
            activeSection === 'support' 
              ? 'bg-orange-100 text-orange-500' 
              : 'text-gray-700 hover:text-orange-500 hover:bg-gray-100'
          }`}
          title="Support"
        >
          <Heart className="h-6 w-6" />
        </a>
        <a 
          href="#transparency" 
          className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${
            activeSection === 'transparency' 
              ? 'bg-orange-100 text-orange-500' 
              : 'text-gray-700 hover:text-orange-500 hover:bg-gray-100'
          }`}
          title="Transparency"
        >
          <BarChart2 className="h-6 w-6" />
        </a>
        <a 
          href="#accountability" 
          className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${
            activeSection === 'accountability' 
              ? 'bg-orange-100 text-orange-500' 
              : 'text-gray-700 hover:text-orange-500 hover:bg-gray-100'
          }`}
          title="Accountability"
        >
          <DollarSign className="h-6 w-6" />
        </a>
        <button 
          onClick={() => window.location.href = window.location.href}
          className="flex items-center justify-center w-12 h-12 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-gray-100"
          title="Share"
        >
          <Share2 className="h-6 w-6" />
        </button>
      </div>
    </nav>
  )
} 