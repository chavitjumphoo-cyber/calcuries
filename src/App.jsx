import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AddMeal from './pages/AddMeal'
import Stats from './pages/Stats'
import Navigation from './components/Navigation'

function App() {
  return (
    <Router>
      <div className="min-h-screen pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddMeal />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
        <Navigation />
      </div>
    </Router>
  )
}

export default App
