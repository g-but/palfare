import { Shield } from 'lucide-react'

export function MissionStatement() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
      <p className="text-gray-600 mb-6">
        Building a future where funding is transparent, accessible, and community-driven. Your support helps us create a better way to fund projects.
      </p>
      <div className="flex items-center space-x-4">
        <Shield className="h-6 w-6 text-orange-500" />
        <span className="text-gray-600">100% Transparent</span>
      </div>
    </div>
  )
} 