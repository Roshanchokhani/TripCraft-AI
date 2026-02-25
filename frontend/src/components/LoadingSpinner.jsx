import { useState, useEffect } from 'react'
import { Plane } from 'lucide-react'

const MESSAGES = [
  'Consulting local experts...',
  'Crafting the perfect itinerary...',
  'Discovering hidden gems...',
  'Optimising your schedule...',
  'Adding local food recommendations...',
  'Checking cultural highlights...',
  'Finalising your adventure...',
]

export default function LoadingSpinner({ destination }) {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 animate-fade-in">
      {/* Spinning plane */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center animate-pulse">
          <Plane className="w-8 h-8 text-indigo-500 animate-bounce" />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-indigo-300 border-t-indigo-600 animate-spin" />
      </div>

      <div className="text-center">
        {destination && (
          <p className="text-2xl font-bold text-gray-800 mb-1">
            Planning your trip to {destination}
          </p>
        )}
        <p className="text-indigo-500 font-medium transition-all duration-500">
          {MESSAGES[msgIndex]}
        </p>
        <p className="text-gray-400 text-sm mt-2">This usually takes 15–30 seconds</p>
      </div>
    </div>
  )
}
