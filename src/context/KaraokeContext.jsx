// src/context/KaraokeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

const KaraokeContext = createContext();

export function KaraokeProvider({ children }) {
  const [queue, setQueue] = useState([]);

  const [deviceId, setDeviceId] = useState(() => {
    let savedDeviceId = localStorage.getItem("deviceId");

    if (!savedDeviceId) {
      savedDeviceId = `device_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem("deviceId", savedDeviceId);
    }

    return savedDeviceId;
  });

  useEffect(() => {
    // Cargar cola inicial desde MongoDB
    const fetchQueue = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/queue");
        const data = await response.json();
        // Asegúrate que data sea un array
        setQueue(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching queue:", error);
        setQueue([]); // Inicializa como array vacío en caso de error
      }
    };
    fetchQueue();

    // Escuchar actualizaciones de Socket.io
    socket.on("queueUpdated", (updatedQueue) => {
      setQueue(updatedQueue);
    });
  }, []);
  return (
    <KaraokeContext.Provider value={{ queue, setQueue }}>
      {children}
    </KaraokeContext.Provider>
  );

  // Eliminar el useEffect que usa localStorage
}

export const useKaraoke = () => useContext(KaraokeContext);
