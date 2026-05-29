/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────
 * MODIFIED FROM ORIGINAL:
 * - OnboardingAck imported and mounted inside ProtectedRoute.
 * - hasAcknowledged() checked on every protected route render.
 * - If not acknowledged: OnboardingAck modal renders over Layout,
 *   blocking all platform access until confirmed.
 * - After confirmation: ackDone state flips, modal unmounts, Layout renders.
 *
 * NO OTHER CHANGES — all routes, guards, and structure unchanged.
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import OnboardingAck, { hasAcknowledged } from './components/OnboardingAck'

import Landing from './pages/Landing'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Documents from './pages/Documents'
import Chat from './pages/Chat'
import Briefing from './pages/Briefing'
import Feedback from './pages/Feedback'
import ForgotPassword from './pages/ForgotPassword'
import Prompts from './pages/Prompts'
import ResetPassword from './pages/ResetPassword'
import MediaLibrary from './pages/MediaLibrary'
import Admin from './pages/Admin'
import Pricing from './pages/Pricing'
import Analytics from './pages/Analytics'
import CaseBriefsPage from './pages/CaseBriefsPage'
import PrecedentsBrowser from './pages/PrecedentsBrowser'
import AdminMappings from './pages/AdminMappings'
import AdminFeedback from './pages/AdminFeedback'
import SubmitFeedback from './pages/SubmitFeedback'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'


// ─── ProtectedRoute ──────────────────────────────────────────────
// Wraps all authenticated routes.
// On first access: shows OnboardingAck modal before rendering Layout.
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const [ackDone, setAckDone] = useState(hasAcknowledged())

  if (loading) return <div className="bg-gray-950 h-screen" />
  if (!user) return <Navigate to="/login" replace />

  // User is authenticated but has not acknowledged yet
  if (!ackDone) {
    return (
      <>
        {/* Render Layout behind the modal so it's ready when modal closes */}
        <Layout>{children}</Layout>
        <OnboardingAck onComplete={() => setAckDone(true)} />
      </>
    )
  }

  return <Layout>{children}</Layout>
}

// ─── AdminRoute (unchanged) ──────────────────────────────────────
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="bg-gray-950 h-screen" />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return <Layout>{children}</Layout>
}

// ─── PublicRoute (unchanged) ─────────────────────────────────────
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="bg-gray-950 h-screen" />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
      <ScrollToTop />
      <Routes>
        {/* Public Marketing & Authentication Routes */}
        <Route path="/"                element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/pricing"         element={<Pricing />} />
        <Route path="/terms"           element={<Terms />} />
        <Route path="/privacy"         element={<Privacy />} />
        <Route path="/login"           element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register"        element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password"  element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* Private Protected Chamber Routes */}
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
        <Route path="/chat"      element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/media"     element={<ProtectedRoute><MediaLibrary /></ProtectedRoute>} />
        <Route path="/briefing"  element={<ProtectedRoute><Briefing /></ProtectedRoute>} />
        <Route path="/feedback"  element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        <Route path="/submit-feedback" element={<ProtectedRoute><SubmitFeedback /></ProtectedRoute>} />
        <Route path="/prompts"   element={<ProtectedRoute><Prompts /></ProtectedRoute>} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/briefs"    element={<CaseBriefsPage />} />
        <Route path="/precedents" element={<ProtectedRoute><PrecedentsBrowser /></ProtectedRoute>} />
        <Route path="/admin/mappings" element={<AdminMappings />} />
        <Route path="/admin/feedback" element={<AdminRoute><AdminFeedback /></AdminRoute>} />

        {/* Secure Admin Dashboard Route */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
