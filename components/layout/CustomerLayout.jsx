// src/components/layout/CustomerLayout.jsx
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">

      {/* Toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1E3A8A',
            color: '#fff',
            borderRadius: '8px'
          }
        }}
      />

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}