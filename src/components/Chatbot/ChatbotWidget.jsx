import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Bot,
  User,
  Star,
  MapPin,
  Square
} from 'lucide-react';
import { chatService } from '../../services/chatService';
import { HOTELS_DATA } from '../../data/hotelsData';
import { TICKETS_DATA } from '../../data/ticketsData';
import { GUIDES_DATA } from '../../data/guidesData';

const INITIAL_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: `Hello! I am the **TravelEase AI Concierge** 🌍✨\n\nI can help you:\n- Discover and book luxury & boutique **Hotels**\n- Find the fastest **Flights, High-Speed Trains & Buses**\n- Reserve certified local **Tour Guides**\n- Plan tailored day-by-day **Itineraries**\n- Assist with cancellations and booking questions\n\nWhere would you like to travel today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export function ChatbotWidget({ onSelectHotel, onSelectTicket, onSelectGuide, setActivePage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Load suggestions on mount
  useEffect(() => {
    chatService.getSuggestions().then((sugs) => {
      if (sugs && sugs.length) setSuggestions(sugs);
    });
  }, []);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend) => {
    const queryText = (textToSend || inputValue).trim();
    if (!queryText || isStreaming) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsStreaming(true);

    const botMessageId = `assistant-${Date.now()}`;
    const botPlaceholder = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, botPlaceholder]);

    abortControllerRef.current = new AbortController();

    try {
      await chatService.streamChat({
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        signal: abortControllerRef.current.signal,
        onChunk: (chunk) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        },
        onDone: () => {
          setIsStreaming(false);
          if (!isOpen) setHasUnread(true);
        },
        onError: (err) => {
          console.error('[Chatbot] Stream error:', err);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? {
                    ...msg,
                    content:
                      msg.content ||
                      `*I apologize, I encountered a temporary network delay with the travel concierge engine. Please try asking again in a moment!*`
                  }
                : msg
            )
          );
          setIsStreaming(false);
        }
      });
    } catch (err) {
      console.error('[Chatbot] Send error:', err);
      setIsStreaming(false);
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  const handleClearChat = () => {
    if (isStreaming) handleStopGeneration();
    setMessages([
      {
        ...INITIAL_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Action Tag & Rich Card Extraction
  // ─────────────────────────────────────────────────────────────
  const parseActionTags = (content) => {
    const hotelRegex = /\[\[HOTEL:([a-zA-Z0-9_\-]+)\]\]/g;
    const ticketRegex = /\[\[TICKET:([a-zA-Z0-9_\-]+)\]\]/g;
    const guideRegex = /\[\[GUIDE:([a-zA-Z0-9_\-]+)\]\]/g;

    const cards = [];
    let match;

    while ((match = hotelRegex.exec(content)) !== null) {
      const hotel = HOTELS_DATA.find((h) => h.id === match[1]);
      if (hotel) cards.push({ type: 'hotel', data: hotel });
    }

    while ((match = ticketRegex.exec(content)) !== null) {
      const ticket = TICKETS_DATA.find((t) => t.id === match[1]);
      if (ticket) cards.push({ type: 'ticket', data: ticket });
    }

    while ((match = guideRegex.exec(content)) !== null) {
      const guide = GUIDES_DATA.find((g) => g.id === match[1]);
      if (guide) cards.push({ type: 'guide', data: guide });
    }

    const cleanContent = content
      .replace(hotelRegex, '')
      .replace(ticketRegex, '')
      .replace(guideRegex, '')
      .trim();

    return { cleanContent, cards };
  };

  // Simple Markdown Parser for bubbles
  const renderFormattedMarkdown = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="chatbot-md-h3">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="chatbot-md-h2">
            {line.replace('## ', '')}
          </h3>
        );
      }

      // Bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const item = line.trim().replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="chatbot-md-li">
            {renderBoldSpans(item)}
          </li>
        );
      }

      // Empty lines
      if (!line.trim()) {
        return <div key={idx} className="chatbot-md-spacing" />;
      }

      return (
        <p key={idx} className="chatbot-md-p">
          {renderBoldSpans(line)}
        </p>
      );
    });
  };

  const renderBoldSpans = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. Floating Action Trigger Button
          ───────────────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`chatbot-fab-trigger ${isOpen ? 'active' : ''}`}
        aria-label="Toggle TravelEase AI Concierge"
        title="TravelEase AI Concierge"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="chatbot-fab-inner">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
            {hasUnread && <span className="chatbot-unread-dot" />}
          </div>
        )}
      </button>

      {/* ─────────────────────────────────────────────────────────────
          2. Chat Window Drawer / Modal
          ───────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className={`chatbot-window ${isExpanded ? 'expanded' : ''}`}>
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar-badge">
                <Bot className="w-5 h-5 text-indigo-400" />
                <span className="chatbot-status-indicator" />
              </div>
              <div>
                <h3 className="chatbot-title">TravelEase AI Concierge</h3>
                <span className="chatbot-subtitle">Powered by Groq LPUs • Instant travel assistance</span>
              </div>
            </div>

            <div className="chatbot-header-actions">
              <button
                onClick={handleClearChat}
                className="chatbot-header-btn"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="chatbot-header-btn"
                title={isExpanded ? 'Collapse' : 'Expand window'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="chatbot-header-btn"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestions Chips */}
          {messages.length <= 2 && suggestions.length > 0 && (
            <div className="chatbot-suggestions-bar">
              <span className="chatbot-suggestions-label">Suggestions:</span>
              <div className="chatbot-suggestions-scroll">
                {suggestions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(item.query)}
                    className="chatbot-suggestion-chip"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message List */}
          <div className="chatbot-messages-container">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const { cleanContent, cards } = parseActionTags(msg.content);

              return (
                <div key={msg.id} className={`chatbot-message-row ${isUser ? 'user' : 'assistant'}`}>
                  {!isUser && (
                    <div className="chatbot-msg-avatar assistant">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                    </div>
                  )}

                  <div className="chatbot-msg-body">
                    <div className={`chatbot-msg-bubble ${isUser ? 'user' : 'assistant'}`}>
                      {cleanContent ? (
                        renderFormattedMarkdown(cleanContent)
                      ) : isStreaming && msg.id === messages[messages.length - 1].id ? (
                        <div className="chatbot-typing-dots">
                          <span />
                          <span />
                          <span />
                        </div>
                      ) : null}
                    </div>

                    {/* Interactive Item Cards if attached */}
                    {cards.length > 0 && (
                      <div className="chatbot-cards-grid">
                        {cards.map((card, cIdx) => {
                          if (card.type === 'hotel') {
                            const h = card.data;
                            return (
                              <div key={cIdx} className="chatbot-item-card">
                                <img
                                  src={h.image}
                                  alt={h.name}
                                  className="chatbot-item-image"
                                />
                                <div className="chatbot-item-content">
                                  <div className="chatbot-item-header">
                                    <h4 className="chatbot-item-name">{h.name}</h4>
                                    <span className="chatbot-item-rating">
                                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline mr-0.5" />
                                      {h.rating}
                                    </span>
                                  </div>
                                  <p className="chatbot-item-sub">
                                    <MapPin className="w-3 h-3 inline mr-1 text-slate-400" />
                                    {h.city}, {h.country}
                                  </p>
                                  <div className="chatbot-item-footer">
                                    <span className="chatbot-item-price">
                                      {h.currency}{h.pricePerNight}
                                      <small>/night</small>
                                    </span>
                                    <button
                                      onClick={() => {
                                        if (onSelectHotel) onSelectHotel(h);
                                      }}
                                      className="chatbot-item-btn"
                                    >
                                      View & Book <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          if (card.type === 'ticket') {
                            const t = card.data;
                            return (
                              <div key={cIdx} className="chatbot-item-card">
                                <div className="chatbot-item-content ticket-card-content">
                                  <div className="chatbot-item-header">
                                    <span className="chatbot-ticket-mode-badge">{t.modeName}</span>
                                    <span className="chatbot-item-price">${t.price}</span>
                                  </div>
                                  <h4 className="chatbot-item-name">{t.carrier}</h4>
                                  <p className="chatbot-item-sub route">
                                    {t.origin} → {t.destination}
                                  </p>
                                  <p className="chatbot-item-meta">
                                    Departs: {t.departureTime} • {t.duration}
                                  </p>
                                  <div className="chatbot-item-footer">
                                    <span className="chatbot-item-seats">
                                      {t.seatsAvailable} seats left
                                    </span>
                                    <button
                                      onClick={() => {
                                        if (onSelectTicket) onSelectTicket(t);
                                      }}
                                      className="chatbot-item-btn"
                                    >
                                      Select Ticket <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          if (card.type === 'guide') {
                            const g = card.data;
                            return (
                              <div key={cIdx} className="chatbot-item-card guide">
                                <img
                                  src={g.avatar}
                                  alt={g.name}
                                  className="chatbot-guide-avatar"
                                />
                                <div className="chatbot-item-content">
                                  <div className="chatbot-item-header">
                                    <h4 className="chatbot-item-name">{g.name}</h4>
                                    <span className="chatbot-item-rating">
                                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline mr-0.5" />
                                      {g.rating}
                                    </span>
                                  </div>
                                  <p className="chatbot-item-sub">
                                    <MapPin className="w-3 h-3 inline mr-1 text-slate-400" />
                                    {g.city} • {g.specialty}
                                  </p>
                                  <div className="chatbot-item-footer">
                                    <span className="chatbot-item-price">
                                      ${g.pricePerDay}
                                      <small>/day</small>
                                    </span>
                                    <button
                                      onClick={() => {
                                        if (onSelectGuide) onSelectGuide(g);
                                      }}
                                      className="chatbot-item-btn"
                                    >
                                      Book Guide <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    )}

                    <span className="chatbot-msg-time">{msg.timestamp}</span>
                  </div>

                  {isUser && (
                    <div className="chatbot-msg-avatar user">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Footer Controls */}
          <div className="chatbot-input-bar">
            {isStreaming && (
              <div className="chatbot-stop-bar">
                <span>TravelEase AI is writing...</span>
                <button onClick={handleStopGeneration} className="chatbot-stop-btn">
                  <Square className="w-3 h-3 mr-1 fill-current" /> Stop
                </button>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="chatbot-form"
            >
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about hotels, flights, itineraries..."
                rows={1}
                className="chatbot-textarea"
                disabled={isStreaming}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isStreaming}
                className="chatbot-send-btn"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="chatbot-footer-caption">
              Direct booking actions link to TravelEase verified inventory.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
