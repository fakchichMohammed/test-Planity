import * as React from "react"
// import { Progress } from "../components/ui/progress"
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface UploadProgressProps {
  progress: number
  isProcessing: boolean
}

export function UploadProgress({ progress, isProcessing }: UploadProgressProps) {
  const [processingProgress, setProcessingProgress] = React.useState(0)

  React.useEffect(() => {
    if (isProcessing) {
      setProcessingProgress(0)
      
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isProcessing])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg shadow-md"
    >
      <div className="relative w-full h-2 bg-blue-200 dark:bg-blue-700 rounded-full overflow-hidden">
        <motion.div 
          className="absolute left-0 top-0 h-full bg-blue-500 dark:bg-blue-400"
          initial={{ width: 0 }}
          animate={{ width: `${isProcessing ? processingProgress : progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <motion.div
        className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300 mt-2 font-semibold"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        {isProcessing ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing CSV file... {processingProgress}%
          </div>
        ) : (
          <div>Uploading: {progress}%</div>
        )}
      </motion.div>
    </motion.div>
  )
}

