import { Button } from '@/shared/ui/Button'
import { cn } from '@/lib/utils'

interface FundUsNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
  className?: string
}

export function FundUsNavigation({ activeSection, onSectionChange, className }: FundUsNavigationProps) {
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'mission', label: 'Mission' },
    { id: 'transparency', label: 'Transparency' }
  ]

  return (
    <nav className={cn('flex items-center space-x-4', className)}>
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={activeSection === section.id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onSectionChange(section.id)}
        >
          {section.label}
        </Button>
      ))}
    </nav>
  )
} 