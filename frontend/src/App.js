import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import page components
import HomePage from './pages/HomePage';
import CreateCreatorPage from './pages/CreateCreatorPage';
import CreatorDetailPage from './pages/CreatorDetailPage';
import EditCreatorPage from './pages/EditCreatorPage';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateCreatorPage />} />
          <Route path="/creator/:id" element={<CreatorDetailPage />} />
          <Route path="/creator/:id/edit" element={<EditCreatorPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 