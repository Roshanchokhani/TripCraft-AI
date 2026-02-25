import { useState } from 'react'
import { X, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { sendItineraryEmail } from '../api/tripcraft'

export default function EmailModal({ itinerary, onClose }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSend = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('sending')
    try {
      await sendItineraryEmail(email.trim(), itinerary)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to send email. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-slide-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Itinerary Sent!</h3>
            <p className="text-gray-500 mb-6">
              Check your inbox at <strong>{email}</strong>
            </p>
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-100 p-2.5 rounded-xl">
                <Mail className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Send Itinerary by Email</h3>
                <p className="text-sm text-gray-500">
                  Get a beautifully formatted copy in your inbox
                </p>
              </div>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                  required
                  autoFocus
                />
              </div>

              {status === 'error' && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {status === 'sending' ? 'Sending...' : 'Send Itinerary'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
