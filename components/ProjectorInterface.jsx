import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { Container, Box, Paper, Grid } from "@mui/material";
import { List, ListItem } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import YouTube from "react-youtube";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
export default function ProjectorInterface() {
  //Agregar controles de reproducción que respondan a las acciones del HostInterface
  const [playerState, setPlayerState] = useState({
    isplaying: true,
    ismuted: false,
    volume: 100,
  });

// // Añadir ref para controlar el player
// const playerRef = useRef(null);

// // Implementar métodos de control
// const handlePlayerControls = (action) => {
//   switch(action) {
//     case 'play':
//       playerRef.current?.playVideo();
//       break;
//     case 'pause':
//       playerRef.current?.pauseVideo();
//       break;
//     // ... otros controles
//   }
// };



  const [queue, setQueue] = useState([
    {
      id: { videoId: "dQw4w9WgXcQ" },
      user: "Juan Pérez",
      snippet: { title: "Never Gonna Give You Up - Rick Astley" },
    },
    {
      id: { videoId: "kJQP7kiw5Fk" },
      user: "María García",
      snippet: { title: "Despacito - Luis Fonsi" },
    },
    {
      id: { videoId: "9bZkp7q19f0" },
      user: "Carlos Rodríguez",
      snippet: { title: "Gangnam Style - PSY" },
    },
    {
      id: { videoId: "L_jWHffIx5E" },
      user: "Ana Martínez",
      snippet: { title: "All Star - Smash Mouth" },
    },
    {
      id: { videoId: "y6120QOlsfU" },
      user: "Pedro Sánchez",
      snippet: { title: "Sandstorm - Darude" },
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
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ color: "white", mb: 2 }}>
            Próximas canciones:
          </Typography>
          <List
            sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", borderRadius: 1, p: 2 }}
          >
            {queue.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  color: "white",
                  bgcolor:
                    index === 0
                      ? "rgba(76, 175, 80, 0.3)"
                      : "rgba(255, 255, 255, 0.05)",
                  mb: 1,
                  borderRadius: 1,
                  position: "relative",
                  padding: 2,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: -10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    bgcolor: index === 0 ? "#4CAF50" : "#666",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}
                </Box>
                <Box sx={{ ml: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {item.user}
                  </Typography>
                  <Typography variant="body1">{item.snippet.title}</Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Box>
    </Box>
  );
}
