import { motion } from 'framer-motion'
import { Card, CardContent } from '@/shared/ui/Card'
import { cn } from '@/lib/utils'

interface ProfileBannerProps {
  className?: string
}

export function ProfileBanner({ className }: ProfileBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('w-full', className)}
    >
      <Card className="bg-gradient-to-r from-orange-500 to-teal-400">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">
              Support Open Source AI Development
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Help us build the future of AI with transparency and community-driven development.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 