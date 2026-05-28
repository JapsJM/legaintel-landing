import React, { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      // Direct post action passing the validation token alongside the payload
      const response = await axios.post('/api/auth/reset-password', {
        token,
        password
      })
      setMessage(response.data.message)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password. Link may be expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
        <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center space-y-4">
          <p className="text-sm text-rose-400 font-medium">⚠️ Missing security reset token identifier context.</p>
          <Link to="/login" className="text-sm text-blue-500 hover:underline block">Return to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-xl p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create New Password</h1>
          <p className="text-sm text-slate-400">Provide your new application account login password credentials below.</p>
        </div>

        {message && <p className="text-sm text-emerald-400 bg-emerald-950/20 border border-emerald-900/50 p-3 rounded-lg">{message}</p>}
        {error && <p className="text-sm text-rose-400 bg-rose-950/20 border border-rose-900/50 p-3 rounded-lg">⚠️ {error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-700 transition"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-700 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-sm font-medium py-3 rounded-lg transition"
          >
            {loading ? 'Updating Password...' : 'Save and Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}