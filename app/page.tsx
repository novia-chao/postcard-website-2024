'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react'

interface Postcard {
  id: string
  month: string
  image_url: string
  custom_url: string
}

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [postcards, setPostcards] = useState<Postcard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchPostcards()
  }, [])

  const fetchPostcards = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('postcards')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (error) throw error

      setPostcards(data || [])
    } catch (err) {
      console.error('Error fetching postcards:', err)
      setError('Failed to fetch postcards. Please check your Supabase configuration.')
    } finally {
      setLoading(false)
    }
  }

  const handleScroll = () => {
    if (!containerRef.current) return
    const scrollPercentage = containerRef.current.scrollLeft / (containerRef.current.scrollWidth - containerRef.current.clientWidth)
    const index = Math.min(Math.floor(scrollPercentage * postcards.length), postcards.length - 1)
    setCurrentIndex(index)
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [postcards])

  const scrollTo = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return
    }

    setUploading(true)
    const file = event.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    try {
      let { error: uploadError } = await supabase.storage
        .from('postcards')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('postcards')
        .getPublicUrl(filePath)

      const { error: insertError } = await supabase
        .from('postcards')
        .insert({ image_url: publicUrl, month: new Date().toLocaleString('default', { month: 'long' }) })

      if (insertError) throw insertError

      await fetchPostcards()
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-amber-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-amber-50">
        <div className="text-red-500 text-center">
          <p className="text-2xl font-bold mb-4">Oops! Something went wrong.</p>
          <p>{error}</p>
          <p className="mt-4">Please check your Supabase configuration in the .env.local file.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="h-screen flex flex-col bg-amber-50">
      <header className="bg-amber-800 text-white py-6 px-6 shadow-lg">
        <h1 className="text-4xl font-bold text-center">Postcard Memories</h1>
        <p className="text-center mt-2 text-amber-200">Capture your moments, one postcard at a time</p>
      </header>

      {postcards.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-amber-800">No postcards found. Add some to get started!</p>
        </div>
      ) : (
        <>
          <div className="relative flex-1 overflow-hidden">
            <div 
              ref={containerRef}
              className="absolute inset-0 flex items-center snap-x snap-mandatory overflow-x-auto scrollbar-hide"
            >
              {postcards.map((postcard) => (
                <div 
                  key={postcard.id}
                  className="min-w-full h-full flex items-center justify-center snap-start px-4"
                >
                  <motion.div 
                    className="relative w-[80vw] h-[70vh] bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src={postcard.image_url}
                      alt={`Postcard from ${postcard.month}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                      <h2 className="text-3xl font-bold text-white">{postcard.month}</h2>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => scrollTo('left')} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg"
              aria-label="Previous postcard"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scrollTo('right')} 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg"
              aria-label="Next postcard"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="h-16 relative flex justify-center items-center bg-amber-100">
            <div className="h-px bg-amber-300 relative" style={{ width: `${(postcards.length - 1) * 16}px` }}>
              <AnimatePresence>
                {postcards.map((_, index) => (
                  <motion.div
                    key={index}
                    className="absolute top-1/2 w-2 h-2 rounded-full bg-amber-600"
                    initial={{ scale: 0.5, opacity: 0.5 }}
                    animate={{ 
                      scale: index === currentIndex ? 1.5 : 1,
                      opacity: index === currentIndex ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      left: `${index * 16}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}

      <div className="p-4 bg-amber-100">
        <label htmlFor="file-upload" className="flex items-center justify-center w-full px-4 py-2 bg-amber-600 text-white rounded-lg shadow cursor-pointer hover:bg-amber-700 transition-colors">
          <Upload className="mr-2" />
          <span>{uploading ? 'Uploading...' : 'Upload New Postcard'}</span>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
    </main>
  )
}

