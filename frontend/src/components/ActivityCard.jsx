import { useState } from 'react'
import { MapPin, Clock, DollarSign, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'

const CATEGORY_STYLES = {
  Food:        { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500',   border: 'border-amber-400'   },
  History:     { bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500',    border: 'border-blue-400'    },
  Adventure:   { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-400' },
  Culture:     { bg: 'bg-violet-100',  text: 'text-violet-700',  dot: 'bg-violet-500',  border: 'border-violet-400'  },
  Nature:      { bg: 'bg-teal-100',    text: 'text-teal-700',    dot: 'bg-teal-500',    border: 'border-teal-400'    },
  Shopping:    { bg: 'bg-pink-100',    text: 'text-pink-700',    dot: 'bg-pink-500',    border: 'border-pink-400'    },
  Relaxation:  { bg: 'bg-sky-100',     text: 'text-sky-700',     dot: 'bg-sky-500',     border: 'border-sky-400'     },
}

const DEFAULT_STYLE = { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500', border: 'border-gray-300' }

export default function ActivityCard({ activity, isLast }) {
  const [expanded, setExpanded] = useState(false)
  const style = CATEGORY_STYLES[activity.category] || DEFAULT_STYLE

  return (
    <div className="relative flex gap-4 pb-6">
      {/* Timeline dot */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full ${style.bg} border-2 ${style.border} flex items-center justify-center z-10`}>
          <span className={`text-sm font-bold ${style.text}`}>
            {activity.time?.split(':')[0] || '?'}
          </span>
        </div>
        {!isLast && <div className="w-0.5 flex-1 mt-1 bg-gradient-to-b from-indigo-200 to-violet-100" />}
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 mb-2">
        {/* Header */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-semibold text-gray-500">{activity.time}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.bg} ${style.text}`}>
                  {activity.category}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 text-base leading-snug">
                {activity.title}
              </h4>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
            {activity.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-indigo-400" />
                {activity.location}
              </span>
            )}
            {activity.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" />
                {activity.duration}
              </span>
            )}
            {activity.cost && (
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-indigo-400" />
                {activity.cost}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mt-3 leading-relaxed">{activity.description}</p>
        </div>

        {/* Tip (collapsible) */}
        {activity.tip && (
          <div className="border-t border-gray-50">
            <button
              onClick={() => setExpanded((e) => !e)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-indigo-600 font-medium hover:bg-indigo-50 transition-colors rounded-b-xl"
            >
              <span className="flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                Local tip
              </span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {expanded && (
              <div className="px-4 pb-3 text-sm text-gray-600 bg-indigo-50/50 rounded-b-xl italic">
                💡 {activity.tip}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
