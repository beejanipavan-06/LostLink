import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ReportLost } from './pages/ReportLost';
import { ReportFound } from './pages/ReportFound';
import { BrowseItems } from './pages/BrowseItems';
import { ItemDetails } from './pages/ItemDetails';
import { Claims } from './pages/Claims';
import { Notifications } from './pages/Notifications';
import { CampusMap } from './pages/CampusMap';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminClaims } from './pages/AdminClaims';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/browse" element={<BrowseItems />} />
              <Route path="/items/:id" element={<ItemDetails />} />
              <Route path="/map" element={<CampusMap />} />

              {/* Protected Student Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/report-lost" element={<ProtectedRoute><ReportLost /></ProtectedRoute>} />
              <Route path="/report-found" element={<ProtectedRoute><ReportFound /></ProtectedRoute>} />
              <Route path="/claims" element={<ProtectedRoute><Claims /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/claims" element={<ProtectedRoute requireAdmin={true}><AdminClaims /></ProtectedRoute>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
