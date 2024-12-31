'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { postcards } from '../lib/localData'

const Gallery = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleScroll = () => {
    if (!containerRef.current) return
    const scrollPercentage = containerRef.current.scrollLeft / (containerRef.current.scrollWidth - containerRef.current.clientWidth)
    const newIndex = Math.min(Math.floor(scrollPercentage * postcards.length), postcards.length - 1)
    setCurrentIndex(newIndex)
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="relative flex-1 overflow-hidden">
        <div 
          ref={containerRef}
          className="absolute inset-0 flex items-center overflow-x-auto hide-scrollbar"
        >
          {postcards.map((postcard) => (
            <div 
              key={postcard.id}
              className="min-w-full h-full flex items-center justify-center flex-shrink-0"
            >
              <div 
                className="relative w-[80vw] h-[70vh] bg-white rounded-lg overflow-hidden"
              >
                <img
                  src={postcard.image_url}
                  alt={`Postcard from ${postcard.month}`}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-32 relative flex flex-col justify-center items-center bg-white">
        <div className="relative w-full max-w-xl mx-auto">
          <div className="h-px bg-gray-300 relative" style={{ width: '100%' }}>
            <AnimatePresence>
              {postcards.map((_, index) => {
                const isActive = index === currentIndex
                const isAdjacent = Math.abs(index - currentIndex) === 1
                const baseHeight = isActive ? 16 : isAdjacent ? 10 : 4

                return (
                  <motion.div
                    key={index}
                    className="absolute top-0 w-[1px] bg-gray-900"
                    initial={{ height: 4 }}
                    animate={{ 
                      height: baseHeight,
                      opacity: isActive ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      left: `calc(${(index / (postcards.length - 1)) * 100}% - ${index * 10}px)`,
                      transformOrigin: 'top',
                    }}
                  />
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default Gallery

