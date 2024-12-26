import { Button } from "../components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Download, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface DownloadButtonProps {
  downloadUrl: string
}

export function DownloadButton({ downloadUrl }: DownloadButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4"
    >
      <Alert className="bg-green-50 dark:bg-green-900 border-green-400 dark:border-green-800 text-green-700 dark:text-green-200">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your file has been processed. Click the button below to download the result.
        </AlertDescription>
      </Alert>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button asChild className="mt-2 w-full bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white dark:text-gray-200 font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out">
          <a href={downloadUrl} download="processed_csv.zip">
            <Download className="mr-2 h-4 w-4" /> Download Result
          </a>
        </Button>
      </motion.div>
    </motion.div>
  )
}

