'use client'

import { useState } from 'react'
import { FileUploadForm } from './components/file-upload-form'
import { UploadProgress } from './components/upload-progress'
import { ErrorDisplay } from './components/error-display'
import { DownloadButton } from './components/download-button'
import { motion } from 'framer-motion'
import { ThemeSwitcher } from './components/theme-switcher'
import { SubscriptionProvider, useSubscription } from './contexts/subscription-context'

function CSVProcessor() {
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const { isPremium, maxFileSize } = useSubscription()

  const handleThemeChange = (isDark: boolean) => {
    setIsDarkTheme(isDark)
  }

  const uploadWithProgress = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    // Create a new ReadableStream from the file
    const fileStream = new ReadableStream({
      start(controller) {
        const reader = new FileReader()
        let bytesRead = 0

        reader.onload = (e) => {
          if (e.target?.result instanceof ArrayBuffer) {
            const chunk = new Uint8Array(e.target.result)
            bytesRead += chunk.length
            const percentComplete = Math.round((bytesRead / file.size) * 100)
            setProgress(percentComplete)
            controller.enqueue(chunk)
          }
        }

        reader.onloadend = () => {
          controller.close()
        }

        reader.onerror = (error) => {
          controller.error(error)
        }

        // Read the file in chunks
        const CHUNK_SIZE = 64 * 1024 // 64KB chunks
        let offset = 0

        function readNextChunk() {
          const chunk = file.slice(offset, offset + CHUNK_SIZE)
          offset += chunk.size
          if (chunk.size > 0) {
            reader.readAsArrayBuffer(chunk)
          } else {
            controller.close()
          }
        }

        readNextChunk()
      }
    })

    try {
      const response = await fetch('/api/process-csv', {
        method: 'POST',
        body: formData,
        headers: {
          'X-File-Size': file.size.toString(),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'File processing failed')
      }

      const blob = await response.blob()
      return window.URL.createObjectURL(blob)
    } catch (error) {
      throw error
    }
  }

  const handleSubmit = async (file: File) => {
    console.log('Handling submit for file:', file.name, 'Size:', file.size)
    setUploading(true)
    setProcessing(false)
    setProgress(0)
    setError(null)
    setDownloadUrl(null)

    try {
      setProcessing(true)
      const url = await uploadWithProgress(file)
      setDownloadUrl(url)
      console.log('Download URL set:', url)
    } catch (err) {
      console.error('Error in handleSubmit:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setUploading(false)
      setProcessing(false)
    }
  }

  return (
    <main className={`container mx-auto p-4 min-h-screen transition-colors duration-300 ${
      isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-end mb-4">
          <ThemeSwitcher onThemeChange={handleThemeChange} />
        </div>
        <h1 className={`text-4xl font-bold mb-8 text-center ${
          isDarkTheme ? 'text-white' : 'text-purple-600'
        }`}>
          CSV Processor
        </h1>
      </motion.div>
      <div className="max-w-md mx-auto">
        <FileUploadForm onSubmit={handleSubmit} isUploading={uploading || processing} />
        {(uploading || processing) && (
          <UploadProgress progress={progress} isProcessing={processing} />
        )}
        {error && <ErrorDisplay error={error} />}
        {downloadUrl && <DownloadButton downloadUrl={downloadUrl} />}
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <SubscriptionProvider>
      <CSVProcessor />
    </SubscriptionProvider>
  )
}

