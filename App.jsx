import { Routes, Route } from 'react-router-dom'
import UserInterface from './components/UserInterface'
import HostInterface from './components/HostInterface'
import ProjectorInterface from './components/ProjectorInterface'

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserInterface />} />
      <Route path="/host" element={<HostInterface />} />
      <Route path="/projector" element={<ProjectorInterface />} />
    </Routes>
  )
}

export default App