import { Routes, Route } from "react-router-dom";
import UserInterface from "./components/UserInterface";
import HostInterface from "./components/HostInterface";
import ProjectorInterface from "./components/ProjectorInterface";
import { KaraokeProvider } from "./src/context/KaraokeContext";

function App() {
  return (
    <KaraokeProvider>
      <Routes>
        <Route path="/" element={<UserInterface />} />
        <Route path="/host" element={<HostInterface />} />
        <Route path="/projector" element={<ProjectorInterface />} />
      </Routes>
    </KaraokeProvider>
  );
}

export default App;
