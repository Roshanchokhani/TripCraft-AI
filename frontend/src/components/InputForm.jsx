import { useState } from 'react'
import { MapPin, Calendar, Minus, Plus, Sparkles } from 'lucide-react'

const INTERESTS = [
  { id: 'Food', label: 'Food & Dining', emoji: '🍜' },
  { id: 'History', label: 'History', emoji: '🏛️' },
  { id: 'Adventure', label: 'Adventure', emoji: '🏔️' },
  { id: 'Culture', label: 'Culture & Arts', emoji: '🎭' },
  { id: 'Nature', label: 'Nature', emoji: '🌿' },
  { id: 'Shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'Relaxation', label: 'Relaxation', emoji: '🧘' },
]

export default function InputForm({ onSubmit, loading }) {
  const [destination, setDestination] = useState('')
  const [duration, setDuration] = useState(3)
  const [interests, setInterests] = useState(['Food', 'Culture'])

  const toggleInterest = (id) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!destination.trim()) return
    onSubmit({ destination: destination.trim(), duration, interests })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Destination */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Where do you want to go?
        </label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Tokyo, Paris, Bali..."
            className="input-field pl-11"
            required
          />
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Calendar className="inline w-4 h-4 mr-1 text-indigo-400" />
          Trip Duration
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setDuration((d) => Math.max(1, d - 1))}
            className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 text-center">
            <span className="text-4xl font-bold text-indigo-600">{duration}</span>
            <span className="text-gray-500 ml-2 text-lg">{duration === 1 ? 'day' : 'days'}</span>
          </div>
          <button
            type="button"
            onClick={() => setDuration((d) => Math.min(14, d + 1))}
            className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <input
          type="range"
          min={1}
          max={14}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full mt-3 accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1 day</span>
          <span>14 days</span>
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          What are your interests?
          <span className="text-gray-400 font-normal ml-2">(select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(({ id, label, emoji }) => (
            <button
              key={id}
              type="button"
              onClick={() => toggleInterest(id)}
              className={`interest-chip ${interests.includes(id) ? 'interest-chip-active' : 'interest-chip-inactive'}`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !destination.trim()}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
      >
        <Sparkles className="w-5 h-5" />
        {loading ? 'Generating your itinerary...' : 'Generate My Itinerary'}
      </button>
    </form>
  )
}
