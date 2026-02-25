import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Brain, Map, Mail } from 'lucide-react'
import InputForm from '../components/InputForm'
import LoadingSpinner from '../components/LoadingSpinner'
import { generateItinerary, fetchWeather, fetchCityImage } from '../api/tripcraft'

const FEATURES = [
  { icon: Brain, title: 'AI-Powered', desc: 'Gemini 1.5 Flash generates personalised day-by-day plans tailored to your interests.' },
  { icon: Map,   title: 'RAG-Enhanced', desc: 'Retrieval-Augmented Generation injects curated travel knowledge for richer recommendations.' },
  { icon: Mail,  title: 'Email Export', desc: 'Send your beautiful, formatted itinerary straight to your inbox with one click.' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingDest, setLoadingDest] = useState('')

  const handleGenerate = async ({ destination, duration, interests }) => {
    setLoading(true)
    setError('')
    setLoadingDest(destination)

    try {
      // Run AI generation and bonus data fetches in parallel
      const [itineraryRes, weatherRes, imageRes] = await Promise.allSettled([
        generateItinerary(destination, duration, interests),
        fetchWeather(destination),
        fetchCityImage(destination),
      ])

      const itinerary =
        itineraryRes.status === 'fulfilled' ? itineraryRes.value.data.itinerary : null

      if (!itinerary) {
        throw new Error(
          itineraryRes.reason?.response?.data?.detail || 'Failed to generate itinerary'
        )
      }

      navigate('/itinerary', {
        state: {
          itinerary,
          weather: weatherRes.status === 'fulfilled' ? weatherRes.value.data : null,
          cityImage: imageRes.status === 'fulfilled' ? imageRes.value.data : null,
        },
      })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            Powered by Google Gemini + RAG
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            Plan Your Perfect Trip<br />
            <span className="text-yellow-300">in Seconds</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-4">
            Tell us your destination and interests — our AI travel planner handles the rest,
            generating a detailed day-by-day itinerary tailored just for you.
          </p>
        </div>
      </section>

      {/* Main form card */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 -mt-10 relative z-10 pb-16">
        <div className="card p-6 sm:p-8 shadow-xl shadow-indigo-100">
          {loading ? (
            <LoadingSpinner destination={loadingDest} />
          ) : (
            <>
              {error && (
                <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
                  ⚠️ {error}
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900 mb-6">Plan Your Trip</h2>
              <InputForm onSubmit={handleGenerate} loading={loading} />
            </>
          )}
        </div>

        {/* Feature cards */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 animate-fade-in">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-4 text-center hover:shadow-md transition-shadow">
                <div className="bg-indigo-50 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
