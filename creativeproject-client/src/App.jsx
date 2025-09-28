import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login.jsx'
import HomePage from './pages/Home.jsx'
import CreatePage from './pages/Create.jsx'
import Setup from './pages/Setup.jsx'
import Graph from './pages/Graph.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/create' element={<CreatePage />} />
        <Route path='/setup' element={<Setup />} />
        <Route path='/graph' element={<Graph />} />
      </Routes>
    </Router>
  )
}

export default App