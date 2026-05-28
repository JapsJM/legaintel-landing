import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

// --- FIX: Dynamically strip "/api" from VITE_API_URL to target the backend root ---
// This ensures compatibility in both local development and production domains!
const rawUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
const SOCKET_URL = rawUrl.replace('/api', '');

export const useChatSocket = ({ onThinking, onToken, onResult, onError }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);

  const onThinkingRef = useRef(onThinking);
  const onTokenRef = useRef(onToken);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  useEffect(() => { onThinkingRef.current = onThinking; }, [onThinking]);
  useEffect(() => { onTokenRef.current = onToken; }, [onToken]);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);

  useEffect(() => {
    if (!user?.id) {
      if (socketRef.current) socketRef.current.disconnect();
      return;
    }

    if (socketRef.current) socketRef.current.disconnect();

    // --- FIX: Allow both 'polling' and 'websocket' transports ---
    // This allows seamless handshake fallbacks on Windows development environments.
    const socket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`%c[Socket] Connected: ${socket.id}`, 'color: #c5a059');
      socket.emit('join_query_room', { user_id: user.id });
    });

    socket.on('query_status', (data) => {
      if (data.status === 'thinking') {
        onThinkingRef.current?.(data.session_id);
      }
    });

    socket.on('query_token', (data) => {
      onTokenRef.current?.(data);
    });

    socket.on('query_result', (data) => {
      onResultRef.current?.(data);
    });

    socket.on('disconnect', (reason) => {
      console.warn(`[Socket] Disconnected: ${reason}`);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection Error:', err.message);
      onErrorRef.current?.('Failed to connect to the intelligence service.');
    });

    return () => {
      if (socket.connected) {
        socket.disconnect();
        console.log('[Socket] Disconnected on cleanup.');
      }
    };
  }, [user?.id]);

  // --- FIX: Cleanly accept courtId as a parameter ---
  const sendQuery = useCallback((message, sessionId, courtId = null) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_query', {
        message,
        session_id: sessionId,
        user_id: user.id,
        court_id: courtId
      });
    } else {
      onErrorRef.current?.('Unable to send query. Connection is offline.');
    }
  }, [user?.id]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
  }, []);

  return { sendQuery, disconnect };
};