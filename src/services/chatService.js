const API_BASE = '/api';

export const chatService = {
  getSuggestions: async () => {
    try {
      const res = await fetch(`${API_BASE}/chat/suggestions`);
      if (!res.ok) throw new Error('Failed to fetch suggestions');
      const data = await res.json();
      return data.suggestions || [];
    } catch {
      return [
        { label: 'Hotels in Paris', query: 'Recommend a luxury hotel in Paris with Eiffel Tower views.' },
        { label: 'Beach resort in Goa', query: 'What is the best beachfront resort in Goa with wellness spa?' },
        { label: 'Tokyo to Kyoto Bullet Train', query: 'How do I take the Shinkansen bullet train from Tokyo to Kyoto?' },
        { label: 'Certified guide in Kyoto', query: 'I need an English-speaking guide for historic temples in Kyoto.' },
        { label: 'Cancellation Policy', query: 'What is your refund policy if I need to cancel my booking?' }
      ];
    }
  },

  streamChat: async ({ messages, onChunk, onDone, onError, signal }) => {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, stream: true }),
        signal
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      if (!res.body) {
        throw new Error('Response body is empty or streaming not supported');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue;

          if (trimmed === 'data: [DONE]') {
            if (onDone) onDone();
            return;
          }

          if (trimmed.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(trimmed.slice(6));
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.chunk && onChunk) {
                onChunk(parsed.chunk);
              }
            } catch (jsonErr) {
              if (jsonErr.message && !jsonErr.message.includes('JSON')) {
                throw jsonErr;
              }
            }
          }
        }
      }

      if (onDone) onDone();
    } catch (err) {
      if (err.name === 'AbortError') {
        if (onDone) onDone();
        return;
      }
      // If streaming failed, try fallback non-streaming request
      try {
        const fallbackRes = await fetch(`${API_BASE}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages, stream: false }),
          signal
        });
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          if (data.message?.content && onChunk) {
            onChunk(data.message.content);
          }
          if (onDone) onDone();
          return;
        }
      } catch {
        // Fallback also failed
      }

      if (onError) onError(err);
    }
  }
};
