import { Crown } from 'lucide-react'
import { motion } from 'framer-motion'

export function PremiumStatus() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 border border-purple-200 dark:border-purple-700 rounded-lg"
    >
      <div className="flex items-center space-x-2">
        <Crown className="h-5 w-5 text-purple-500" />
        <span className="text-purple-800 dark:text-purple-300 font-semibold">
          Premium Features Active
        </span>
      </div>
      <p className="text-purple-700 dark:text-purple-200 text-sm mt-1">
        You can now process files up to 500MB
      </p>
    </motion.div>
  )
}

