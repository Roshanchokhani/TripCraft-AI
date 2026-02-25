import { useState } from 'react'
import ActivityCard from './ActivityCard'
import { Sun, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Timeline({ days }) {
  const [activeDay, setActiveDay] = useState(0)

  if (!days || days.length === 0) return null

  const currentDay = days[activeDay]

  return (
    <div className="animate-fade-in">
      {/* Day selector tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveDay((d) => Math.max(0, d - 1))}
          disabled={activeDay === 0}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-2 flex-1 overflow-x-auto">
          {days.map((day, i) => (
            <button
              key={day.day}
              onClick={() => setActiveDay(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeDay === i
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
              }`}
            >
              Day {day.day}
            </button>
          ))}
        </div>

        <button
          onClick={() => setActiveDay((d) => Math.min(days.length - 1, d + 1))}
          disabled={activeDay === days.length - 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day theme header */}
      {currentDay.theme && (
        <div className="flex items-center gap-2 mb-6 px-1">
          <Sun className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Day {currentDay.day}
            </p>
            <h3 className="text-lg font-bold text-gray-800">{currentDay.theme}</h3>
          </div>
        </div>
      )}

      {/* Activities */}
      <div className="relative">
        {currentDay.activities?.map((activity, i) => (
          <ActivityCard
            key={`${activeDay}-${i}`}
            activity={activity}
            isLast={i === currentDay.activities.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
