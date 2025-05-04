import { motion } from 'framer-motion'

interface TransparencyScoreProps {
  score: number
  maxScore: number
}

export function TransparencyScore({ score, maxScore }: TransparencyScoreProps) {
  const percentage = (score / maxScore) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">{score}</span>
        <span className="text-sm text-gray-500">/ {maxScore}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-teal-400"
        />
      </div>
    </div>
  )
} 