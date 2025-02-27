import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { useKaraoke } from "../src/context/KaraokeContext";
import VideoPlayer from "./VideoPlayer";
import QueueDisplay from "./QueueDisplay";
import QRCodeDisplay from "./QRCodeDisplay";
import YouTube from "react-youtube"; // Agregar esta importación
export default function ProjectorInterface() {
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const { queue, setQueue } = useKaraoke();
  useEffect(() => {
    const fetchAndUpdateQueue = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/queue");
        const updatedQueue = await response.json();
        setQueue(updatedQueue);

        if (updatedQueue.length > 0) {
          const nextSong = updatedQueue.find((song) => !song.played);
          if (nextSong && nextSong.videoId !== currentVideoId) {
            setCurrentVideoId(nextSong.videoId);
          }
        } else {
          setCurrentVideoId(null);
        }
      } catch (error) {
        console.error("Error actualizando la cola:", error);
      }
    };
    fetchAndUpdateQueue();
  }, [currentVideoId]);
  const handleVideoEnd = async (event) => {
    if (event.data === YouTube.PlayerState.ENDED) {
      try {
        const currentSong = queue.find(
          (song) => song.videoId === currentVideoId
        );
        if (!currentSong) return;
        // Actualizar el estado de la canción en MongoDB
        await fetch("http://localhost:3000/api/songs/played", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            songId: currentSong._id,
            playedAt: new Date(),
          }),
        });
        // Obtener la cola actualizada
        const response = await fetch("http://localhost:3000/api/queue");
        const updatedQueue = await response.json();
        setQueue(updatedQueue);
        // Encontrar la siguiente canción no reproducida
        const nextSong = updatedQueue.find((song) => !song.played);
        if (nextSong) {
          setCurrentVideoId(nextSong.videoId);
        } else {
          setCurrentVideoId(null);
        }
      } catch (error) {
        console.error("Error actualizando el estado de la canción:", error);
      }
    }
  };
  return (
    <Box sx={{ position: "relative", height: "100vh" }}>
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            top: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: "2rem",
            fontWeight: "bold",
            zIndex: 1000,
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          by @luditalk
        </Typography>
        <VideoPlayer
          currentVideoId={currentVideoId}
          onVideoEnd={handleVideoEnd}
          queue={queue}
        />
        <QRCodeDisplay />
      </Box>
      <QueueDisplay queue={queue} />
    </Box>
  );
}
