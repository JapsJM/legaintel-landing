import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

// Use same VITE_API_URL as api.js — single env var for all backend connections
const SOCKET_URL = import.meta.env.VITE_API_URL || window.location.origin

/**
 * useDocumentSocket
 *
 * Connects to Flask-SocketIO over a unified channel, listens to global updates,
 * and passes the matching target state up to onStatusUpdate.
 */
export function useDocumentSocket(onStatusUpdate) {
  const { user } = useAuth()
  const socketRef = useRef(null)
  const callbackRef = useRef(onStatusUpdate)

  // Keep callback ref current without re-connecting
  callbackRef.current = onStatusUpdate

  useEffect(() => {
    if (!user?.id) return

    // Establish multi-transport fallback link
    const socket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'],
      withCredentials: true
    })

    socketRef.current = socket

    socket.on('connect', () => {
      // Legacy compatibility call — kept for registration tracking
      socket.emit('join', { user_id: user.id })
    })

    socket.on('document_status', (data) => {
      // Safely cross-validate user_id signature context to filter out neighbor updates
      if (data && data.user_id === user.id) {
        callbackRef.current?.({
          doc_id:   data.doc_id,
          status:   data.status,
          progress: data.progress,
          error:    data.error
        })
      }
    })

    socket.on('disconnect', () => {
      // Automatic re-connection handler managed natively
    })

    return () => {
      socket.emit('leave', { user_id: user.id })
      socket.disconnect()
    }
  }, [user?.id])

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect()
  }, [])

  return { disconnect }
}