import { Button } from "../components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Crown } from 'lucide-react'
import { motion } from 'framer-motion'

interface PremiumUpgradeProps {
  onUpgradeClick: () => void
  fileSize: number
}

export function PremiumUpgrade({ onUpgradeClick, fileSize }: PremiumUpgradeProps) {
  const fileSizeMB = Math.round(fileSize / (1024 * 1024))
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4"
    >
      <Alert className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/50 dark:to-amber-800/50 border-amber-200 dark:border-amber-700">
        <Crown className="h-5 w-5 text-amber-500" />
        <AlertTitle className="text-amber-800 dark:text-amber-300">Premium Feature Required</AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-200">
          Your file is {fileSizeMB}MB. Free accounts are limited to 50MB.
          Upgrade to Premium to process files up to 500MB!
        </AlertDescription>
      </Alert>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4"
      >
        <Button
          onClick={onUpgradeClick}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-600 dark:to-amber-700 dark:hover:from-amber-700 dark:hover:to-amber-800 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out"
        >
          <Crown className="mr-2 h-4 w-4" />
          Upgrade to Premium
        </Button>
      </motion.div>
    </motion.div>
  )
}

