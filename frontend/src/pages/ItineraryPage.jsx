import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowLeft, Send, Globe, Clock, Banknote, Languages,
  MapPin, Lightbulb, Star, Download, Package, MessageSquare,
} from 'lucide-react'
import Timeline from '../components/Timeline'
import WeatherWidget from '../components/WeatherWidget'
import EmailModal from '../components/EmailModal'
import PackingListModal from '../components/PackingListModal'
import ChatPanel from '../components/ChatPanel'
import { exportItineraryPDF } from '../utils/exportPdf'

export default function ItineraryPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const { weather, cityImage } = location.state || {}

  // itinerary is kept in state so the chat panel can update it
  const [itinerary, setItinerary]           = useState(location.state?.itinerary || null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showPacking, setShowPacking]       = useState(false)
  const [showChat, setShowChat]             = useState(false)

  if (!itinerary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <Globe className="w-12 h-12 text-indigo-300" />
        <p className="text-lg font-medium">No itinerary found.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Plan a Trip</button>
      </div>
    )
  }

  const { destination, country, duration, summary, highlights, practical_info, tips, days } = itinerary

  const bgStyle = cityImage?.url
    ? { backgroundImage: `url(${cityImage.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {}

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">

      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <div className="relative h-64 sm:h-80 flex items-end" style={bgStyle}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        {!cityImage?.url && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700" />
        )}

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pb-6 flex flex-col sm:flex-row items-end justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />{country}
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              {destination}
            </h1>
            <p className="text-white/80 mt-1 text-sm">{duration}-Day Itinerary</p>
          </div>
          {weather && <WeatherWidget weather={weather} />}
        </div>

        {cityImage?.photographer && (
          <a href={cityImage.photographer_url} target="_blank" rel="noopener noreferrer"
             className="absolute bottom-2 right-3 text-white/40 text-xs hover:text-white/70 transition-colors">
            Photo: {cityImage.photographer} / Unsplash
          </a>
        )}
      </div>

      {/* ── Action bar ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">

          <button onClick={() => navigate('/')}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Plan another trip</span>
          </button>

          {/* Right-side action buttons */}
          <div className="flex items-center gap-2">

            {/* Refine with AI */}
            <button
              onClick={() => setShowChat((s) => !s)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                showChat
                  ? 'bg-indigo-500 text-white border-indigo-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Refine with AI</span>
            </button>

            {/* Packing List */}
            <button
              onClick={() => setShowPacking(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Packing List</span>
            </button>

            {/* PDF Export */}
            <button
              onClick={() => exportItineraryPDF(itinerary)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            {/* Email */}
            <button
              onClick={() => setShowEmailModal(true)}
              className="btn-primary flex items-center gap-1.5 py-2 text-sm"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send Email</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left sidebar */}
          <aside className="lg:col-span-1 space-y-5">
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-3">Trip Overview</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{summary}</p>
            </div>

            {highlights?.length > 0 && (
              <div className="card p-5">
                <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />Highlights
                </h2>
                <ul className="space-y-2">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-indigo-400 font-bold mt-0.5">→</span>{h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {practical_info && (
              <div className="card p-5">
                <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />Practical Info
                </h2>
                <dl className="space-y-2 text-sm">
                  {practical_info.best_time && (
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <dt className="text-gray-500 text-xs">Best Time</dt>
                        <dd className="text-gray-800 font-medium">{practical_info.best_time}</dd>
                      </div>
                    </div>
                  )}
                  {practical_info.currency && (
                    <div className="flex items-start gap-2">
                      <Banknote className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <dt className="text-gray-500 text-xs">Currency</dt>
                        <dd className="text-gray-800 font-medium">{practical_info.currency}</dd>
                      </div>
                    </div>
                  )}
                  {practical_info.language && (
                    <div className="flex items-start gap-2">
                      <Languages className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <dt className="text-gray-500 text-xs">Language</dt>
                        <dd className="text-gray-800 font-medium">{practical_info.language}</dd>
                      </div>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {tips?.length > 0 && (
              <div className="card p-5">
                <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />Traveller Tips
                </h2>
                <ul className="space-y-2">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-amber-400 mt-0.5">💡</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* Timeline */}
          <main className="lg:col-span-2">
            <div className="card p-5 sm:p-7">
              <h2 className="font-bold text-gray-900 text-lg mb-6">Your Day-by-Day Itinerary</h2>
              <Timeline days={days} />
            </div>
          </main>
        </div>
      </div>

      {/* ── Modals & Panels ──────────────────────────────────────────── */}
      {showEmailModal && (
        <EmailModal itinerary={itinerary} onClose={() => setShowEmailModal(false)} />
      )}

      {showPacking && (
        <PackingListModal itinerary={itinerary} onClose={() => setShowPacking(false)} />
      )}

      {showChat && (
        <ChatPanel
          itinerary={itinerary}
          onUpdate={(updated) => setItinerary(updated)}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  )
}
