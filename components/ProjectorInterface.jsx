import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { Container, Box, Paper, Grid } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import YouTube from "react-youtube";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export default function ProjectorInterface() {
  const [queue, setQueue] = useState([
    {
      id: { videoId: "dQw4w9WgXcQ" },
      user: "Usuario 1",
      snippet: { title: "Canción 1" },
    },
    {
      id: { videoId: "kJQP7kiw5Fk" },
      user: "Usuario 2",
      snippet: { title: "Canción 2" },
    },
  ]);

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1,
      modestbranding: 1,
      enablejsapi: 1,
      origin: window.location.origin,
      host: "https://www.youtube.com",
    },
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
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: "60px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "calc(100vh - 60px)",
          }}
        >
          <YouTube
            videoId={queue[0]?.id.videoId}
            opts={opts}
            onStateChange={(event) => {
              if (event.data === YouTube.PlayerState.ENDED) {
                if (queue.length > 1) {
                  const newQueue = [...queue];
                  newQueue.shift();
                  setQueue(newQueue);
                } else {
                  event.target.playVideo();
                }
              }
            }}
            onReady={(event) => {
              try {
                const player = event.target;
                player.playVideo();
                player.unMute();
                player.setVolume(100);
              } catch (error) {
                console.error("Error en onReady:", error);
              }
            }}
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "177.78vh",
              maxHeight: "56.25vw",
              margin: "auto",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              right: "20px",
              bottom: "0px", // Ajustar para que esté encima del video
              zIndex: 1000,
              bgcolor: "rgba(255,255,255,0.9)", // Aumentar opacidad para mejor visibilidad
              p: 1,
              borderRadius: 1,
              textAlign: "center",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)", // Añadir sombra para mejor visibilidad
            }}
          >
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: "black",
                fontWeight: "bold", // Añadir esta línea para texto en negrita
                fontSize: "1.1rem", // Aumentar tamaño de fuente para mejor legibilidad
              }}
            >
              Escanea para agregar tu canción
            </Typography>
            <QRCodeCanvas value={`${window.location.origin}`} size={100} />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          bgcolor: "rgba(0,0,0,0.8)",
          p: 2,
          height: "auto",
          maxHeight: "20vh",
          overflowX: "auto",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          Próximas canciones:
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "nowrap",
            pb: 1,
          }}
        >
          {queue.slice(1).map((song, index) => (
            <Typography
              key={index}
              sx={{
                color: "white",
                minWidth: "max-content",
              }}
            >
              {song.snippet.title} - {song.user}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
