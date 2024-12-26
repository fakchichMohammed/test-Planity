'use client'

import { useState, useEffect } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Upload, FileText, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSubscription } from '../contexts/subscription-context'
import { PremiumUpgrade } from './premium-upgrade'
import { PremiumStatus } from './premium-status'
import { UpgradeModal } from './upgrade-modal'

interface FileUploadFormProps {
  onSubmit: (file: File) => void
  isUploading: boolean
}

export function FileUploadForm({ onSubmit, isUploading }: FileUploadFormProps) {
  const { isPremium, maxFileSize } = useSubscription()
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [oversizedFile, setOversizedFile] = useState<number | null>(null)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [showProcessButton, setShowProcessButton] = useState(false)

  const validateFile = (file: File): string | null => {
    console.log('Validating file:', file.name, 'Size:', file.size, 'Max size:', maxFileSize, 'Is Premium:', isPremium)
    if (!file.name.endsWith('.csv')) {
      return 'Only CSV files are allowed'
    }
    if (file.size > maxFileSize) {
      if (!isPremium) {
        setShowUpgradePrompt(true)
        setOversizedFile(file.size)
        return null // Don't return error for premium upgrade prompt
      } else {
        return `File size exceeds the maximum limit of ${maxFileSize / (1024 * 1024)}MB`
      }
    }
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null)
    setShowUpgradePrompt(false)
    setOversizedFile(null)
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      console.log('Selected file:', selectedFile.name, 'Size:', selectedFile.size)
      setFile(selectedFile)
      const error = validateFile(selectedFile)
      if (error) {
        console.log('File validation error:', error)
        setFileError(error)
        if (!error.includes('free plan limit')) {
          e.target.value = '' // Reset input only if not showing upgrade prompt
        }
      } else {
        console.log('File validation passed')
      }
    } else {
      setFile(null)
      console.log('No file selected')
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (file && !fileError) {
      console.log('Submitting file:', file.name, 'Size:', file.size)
      onSubmit(file)
    } else {
      console.log('Submit prevented. File:', file, 'Error:', fileError)
    }
  }

  const handleUpgradeClick = () => {
    setIsUpgradeModalOpen(true)
  }

useEffect(() => {
  // const isFileValid = file && !fileError
  const shouldShowButton = isPremium || (file && file.size <= maxFileSize)
  const shouldDisableButton = isUploading || (!isPremium && file && file.size > maxFileSize)
  setIsButtonDisabled(shouldDisableButton ?? false)
  setShowProcessButton(shouldShowButton ?? false)
  console.log('Button state updated:', {
    show: shouldShowButton,
    disabled: shouldDisableButton,
    isPremium,
    fileSize: file?.size,
    maxSize: maxFileSize
  })
}, [file, fileError, isUploading, isPremium, maxFileSize])

  useEffect(() => {
    console.log('Subscription status:', isPremium ? 'Premium' : 'Free')
    console.log('Max file size:', maxFileSize / (1024 * 1024), 'MB')
  }, [isPremium, maxFileSize])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <FileText className="text-purple-500" />
          <Input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            disabled={isUploading} 
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 dark:file:bg-purple-900 dark:file:text-purple-300 hover:file:bg-purple-100 dark:hover:file:bg-purple-800 text-gray-700 dark:text-gray-300" 
          />
        </div>
        {fileError && !showUpgradePrompt && (
          <p className="text-sm text-red-500 dark:text-red-400 mt-1">
            {fileError}
          </p>
        )}
        {showProcessButton && (
          <Button 
            type="submit" 
            disabled={isButtonDisabled}
            className="w-full bg-purple-500 hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-800 text-white dark:text-gray-200 font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Process CSV
              </>
            )}
          </Button>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {isPremium 
            ? `Premium account: Maximum file size ${maxFileSize / (1024 * 1024)}MB`
            : 'Free account: Maximum file size 50MB'
          }. Only CSV files are accepted.
        </p>
      </form>
      {isPremium ? (
        <PremiumStatus />
      ) : (
        showUpgradePrompt && oversizedFile && (
          <PremiumUpgrade 
            onUpgradeClick={handleUpgradeClick}
            fileSize={oversizedFile}
          />
        )
      )}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </motion.div>
  )
}

