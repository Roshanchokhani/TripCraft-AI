import { useState, useEffect } from 'react'
import { X, Package, RefreshCw, CheckCircle2, Circle } from 'lucide-react'
import { generatePackingList } from '../api/tripcraft'

export default function PackingListModal({ itinerary, onClose }) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState({})

  const generate = async () => {
    setLoading(true)
    try {
      const res = await generatePackingList(itinerary)
      setData(res.data)
    } catch (err) {
      console.error('Packing list error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { generate() }, [])

  const toggle = (key) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }))

  const total   = data?.categories?.reduce((s, c) => s + c.items.length, 0) ?? 0
  const packed  = Object.values(checked).filter(Boolean).length

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col animate-slide-up"
           style={{ maxHeight: '85vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2.5 rounded-xl">
              <Package className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Packing List</h3>
              <p className="text-sm text-gray-500">
                {itinerary.destination} · {itinerary.duration} days
                {!loading && total > 0 && (
                  <span className="ml-2 text-indigo-500 font-medium">
                    {packed}/{total} packed
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={generate}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-500 transition-colors disabled:opacity-40"
              title="Regenerate"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {!loading && total > 0 && (
          <div className="h-1.5 bg-gray-100 flex-shrink-0">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
              style={{ width: `${(packed / total) * 100}%` }}
            />
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
              <p className="text-gray-500 font-medium">Generating your packing list...</p>
            </div>
          ) : data ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.categories?.map((cat) => (
                <div key={cat.name} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                    <span className="text-xl">{cat.icon}</span>
                    {cat.name}
                  </h4>
                  <ul className="space-y-2">
                    {cat.items?.map((item) => {
                      const key = `${cat.name}__${item}`
                      const done = !!checked[key]
                      return (
                        <li
                          key={item}
                          onClick={() => toggle(key)}
                          className="flex items-center gap-2.5 cursor-pointer group"
                        >
                          {done
                            ? <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                            : <Circle className="w-4 h-4 text-gray-300 group-hover:text-indigo-300 flex-shrink-0 transition-colors" />
                          }
                          <span className={`text-sm transition-colors ${done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {item}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end flex-shrink-0">
          <button onClick={onClose} className="btn-primary py-2 text-sm">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
