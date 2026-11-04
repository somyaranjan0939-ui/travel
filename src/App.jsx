import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { HotelsPage } from './pages/HotelsPage';
import { TicketsPage } from './pages/TicketsPage';
import { GuidesPage } from './pages/GuidesPage';
import { MapPage } from './pages/MapPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { RegisterPage } from './pages/RegisterPage';

import { HotelModal } from './components/HotelModal';
import { TicketModal } from './components/TicketModal';
import { GuideModal } from './components/GuideModal';
import { AuthModal } from './components/AuthModal';
import { BookingReceiptModal } from './components/BookingReceiptModal';
import { NotificationToast } from './components/NotificationToast';
import { ChatbotWidget } from './components/Chatbot/ChatbotWidget';

export function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const [searchParams, setSearchParams] = useState({ query: '', type: 'all', mode: 'all' });

  const handleGlobalSearch = ({ query, type, mode }) => {
    setSearchParams({ query, type, mode: mode || 'all' });
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomePage
            setActivePage={setActivePage}
            onSelectHotel={setSelectedHotel}
            onSelectTicket={setSelectedTicket}
            onSelectGuide={setSelectedGuide}
            onSearch={handleGlobalSearch}
          />
        );
      case 'hotels':
        return (
          <HotelsPage
            onSelectHotel={setSelectedHotel}
            initialQuery={searchParams.type === 'hotel' ? searchParams.query : ''}
          />
        );
      case 'tickets':
        return (
          <TicketsPage
            onSelectTicket={setSelectedTicket}
            initialQuery={searchParams.type === 'ticket' ? searchParams.query : ''}
            initialMode={searchParams.mode || 'all'}
          />
        );
      case 'guides':
        return (
          <GuidesPage
            onSelectGuide={setSelectedGuide}
            initialQuery={searchParams.type === 'guide' ? searchParams.query : ''}
          />
        );
      case 'map':
        return (
          <MapPage
            onSelectHotel={setSelectedHotel}
          />
        );
      case 'bookings':
        return (
          <MyBookingsPage
            setActivePage={setActivePage}
          />
        );
      case 'about':
        return (
          <AboutPage
            setActivePage={setActivePage}
          />
        );
      case 'contact':
        return (
          <ContactPage />
        );
      case 'admin':
        return (
          <AdminPage setActivePage={setActivePage} />
        );
      case 'register':
        return (
          <RegisterPage setActivePage={setActivePage} />
        );
      default:
        return (
          <HomePage
            setActivePage={setActivePage}
            onSelectHotel={setSelectedHotel}
            onSelectTicket={setSelectedTicket}
            onSelectGuide={setSelectedGuide}
            onSearch={handleGlobalSearch}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">
        {renderPage()}
      </main>

      {activePage !== 'map' && activePage !== 'admin' && <Footer setActivePage={setActivePage} />}

      {/* Global Modals */}
      {selectedHotel && (
        <HotelModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />
      )}

      {selectedTicket && (
        <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}

      {selectedGuide && (
        <GuideModal guide={selectedGuide} onClose={() => setSelectedGuide(null)} />
      )}

      <AuthModal setActivePage={setActivePage} />
      <BookingReceiptModal />
      <NotificationToast />

      {/* TravelEase AI Concierge Chatbot */}
      <ChatbotWidget
        onSelectHotel={setSelectedHotel}
        onSelectTicket={setSelectedTicket}
        onSelectGuide={setSelectedGuide}
        setActivePage={setActivePage}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </BookingProvider>
    </AuthProvider>
  );
}
