/**
 * Kernel API Bridge x247 v3.1
 * Camada Unificada de Dados - 100% CLEAN ARCH
 */

const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000/api' 
  : 'https://api.fixitx247.pt/api';

export const api = {
  // AUTH
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Falha na autenticação Kernel.');
    return res.json();
  },

  // ORDERS / PEDIDOS
  getOrders: () => api._get('/orders'),
  getOrder: (id: string) => api._get(`/orders/${id}`),

  // PROS / RADAR
  searchPros: (q: string) => api._get(`/pros/search?q=${q}`),
  getProsByCategory: (catId: string) => api._get(`/pros/search?category=${catId}`),

  // UX247VERSE
  getVerseConfig: () => api._get('/ux247verse/config'),

  // WALLET / FIX BANK
  getWallet: () => api._get('/wallet'),

  // SUPPORT / FLIX AI
  chatWithFlix: (message: string, history: any[], category: string = 'GENERAL') => {
    return api._post('/support/chat/', { message, history, category });
  },

  // BASE FETCHERS
  _get: async (endpoint: string) => {
    const token = localStorage.getItem('X247_TOKEN');
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    if (res.status === 401) {
      api._handleAuthError();
    }
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  _post: async (endpoint: string, body: any) => {
    const token = localStorage.getItem('X247_TOKEN');
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(body)
    });
    if (res.status === 401) {
      api._handleAuthError();
    }
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  _handleAuthError: () => {
    localStorage.removeItem('X247_TOKEN');
    localStorage.removeItem('X247_USER');
    window.location.reload(); // Force app restart to login screen
  },

  /**
   * Realtime Event Subscription (SSE)
   */
  subscribeToEvents: (onEvent: (data: any) => void) => {
    const token = localStorage.getItem('X247_TOKEN');
    if (!token) return null;

    const eventSource = new EventSource(`${API_BASE}/realtime/stream?token=${token}`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onEvent(data);
      } catch (err) {
        console.error('[X247 REALTIME] SSE Parse Error:', err);
      }
    };
    return eventSource;
  }
};