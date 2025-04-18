import { Profile } from '@/types/profile'
import { useRouter } from 'next/navigation'
import { Edit, Share2, Copy } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { toast } from 'react-hot-toast'

interface ProfileHeaderProps {
  profile: Profile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const router = useRouter()

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.display_name || profile.username}'s Profile`,
          text: `Check out ${profile.display_name || profile.username}'s profile on OrangeCat`,
          url: window.location.href
        })
      } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = window.location.href
        window.open(`https://twitter.com/intent/tweet?text=Check out my profile on OrangeCat&url=${encodeURIComponent(shareUrl)}`, '_blank')
      }
    } catch (err) {
      console.error('Error sharing:', err)
      toast.error('Failed to share profile')
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Copied to clipboard!')
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard')
      })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{profile.display_name || profile.username}</h1>
          {profile.bio && <p className="mt-1 text-gray-600">{profile.bio}</p>}
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => router.push('/edit-profile')}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Donation Addresses */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.bitcoin_address && (
          <Card>
            <h3 className="text-lg font-medium text-gray-900">Bitcoin Address</h3>
            <div className="mt-2 flex items-center">
              <code className="text-sm bg-gray-100 p-2 rounded">{profile.bitcoin_address}</code>
              <Button variant="outline" className="ml-2 p-2" onClick={() => handleCopy(profile.bitcoin_address!)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}
        {profile.lightning_address && (
          <Card>
            <h3 className="text-lg font-medium text-gray-900">Lightning Address</h3>
            <div className="mt-2 flex items-center">
              <code className="text-sm bg-gray-100 p-2 rounded">{profile.lightning_address}</code>
              <Button variant="outline" className="ml-2 p-2" onClick={() => handleCopy(profile.lightning_address!)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Profile Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Username</h3>
          <div className="mt-1 flex items-center">
            <p className="text-lg font-semibold text-gray-900">{profile.username}</p>
            <Button 
              variant="outline" 
              className="ml-2 p-2" 
              onClick={() => handleCopy(profile.username)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Profile URL</h3>
          <div className="mt-1 flex items-center">
            <p className="text-lg font-semibold text-gray-900 truncate">
              {window.location.href}
            </p>
            <Button 
              variant="outline" 
              className="ml-2 p-2" 
              onClick={() => handleCopy(window.location.href)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 