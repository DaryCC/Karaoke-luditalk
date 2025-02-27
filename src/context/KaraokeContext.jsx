// src/context/KaraokeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket"],
});

const KaraokeContext = createContext();

export function KaraokeProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    volume: 100,
  });
  // Inicializar deviceId con un valor por defecto
  const [deviceId, setDeviceId] = useState(null);

  // Mover la lógica de inicialización a useEffect
  useEffect(() => {
    let savedDeviceId = localStorage.getItem("deviceId");

    if (!savedDeviceId) {
      savedDeviceId = `device_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem("deviceId", savedDeviceId);
    }

    setDeviceId(savedDeviceId);
  }, []); // Se ejecuta solo una vez al montar el componente

  useEffect(() => {
    // Cargar cola inicial desde MongoDB
    const fetchQueue = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/queue");
        const data = await response.json();
        setQueue(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error obteniendo la cola:", error);
        setQueue([]);
      }
    };
    // Actualizar la cola inicialmente
    fetchQueue();

    // Configurar intervalo para sincronización periódica
    const syncInterval = setInterval(fetchQueue, 5000);
    return () => {
      socket.off("queueUpdated");
      clearInterval(syncInterval);
    };
  }, []);
  return (
    <KaraokeContext.Provider
      value={{ queue, setQueue, playerState, setPlayerState }}
    >
      {children}
    </KaraokeContext.Provider>
  );

  // Eliminar el useEffect que usa localStorage
}

export const useKaraoke = () => useContext(KaraokeContext);
