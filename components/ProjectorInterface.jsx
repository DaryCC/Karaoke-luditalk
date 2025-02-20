import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { Container, Box, Paper, Grid } from "@mui/material";
import { List, ListItem } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import YouTube from "react-youtube";
import { useKaraoke } from "../src/context/KaraokeContext";
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export default function ProjectorInterface() {
  //Agregar controles de reproducción que respondan a las acciones del HostInterface
  const { queue, setQueue, playerState, setPlayerState } = useKaraoke();
  const playerRef = useRef(null);

  //se encarga de sincronizar el estado del reproductor de YouTube con los controles del HostInterface
  useEffect(() => {
    if (playerRef.current?.getPlayerState() !== undefined) {
      try {
        if (playerRef.current && queue.length > 0) {
          if (playerState.isPlaying) {
            playerRef.current.playVideo();
          } else {
            playerRef.current.pauseVideo();
          }
          playerRef.current.setVolume(playerState.volume);
        }
      } catch (error) {
        console.error("Error controlling player:", error);
      }
    }
  }, [playerState, queue]);

  // const opts = {
  //   height: "100%",
  //   width: "100%",
  //   playerVars: {
  //     autoplay: 1,
  //     mute: 1,
  //     controls: 1,
  //     modestbranding: 1,
  //     enablejsapi: 1,
  //     origin: window.location.origin,
  //     host: "https://www.youtube.com",
  //   },
  // };

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
          {queue.length > 0 && queue[0]?.videoId && (
            <YouTube
              videoId={queue[0].videoId}
              opts={{
                height: "100%",
                width: "100%",
                playerVars: {
                  autoplay: 1,
                  mute: 1,
                  controls: 1,
                  modestbranding: 1,
                  enablejsapi: 1,
                  loop: 0, // Asegúrate que loop esté en 0
                  origin: window.location.origin, // Importante
                  host: "https://www.youtube.com",
                },
              }}
              onReady={(event) => {
                playerRef.current = event.target;
                if (event.target && event.target.playVideo) {
                  event.target.playVideo();
                  event.target.unMute();
                  event.target.setVolume(100);
                }
              }}
              onStateChange={async (event) => {
                if (event.data === YouTube.PlayerState.ENDED) {
                  if (queue.length > 1) {
                    const finishedSong = queue[0];

                    // Primero actualizar el estado en la base de datos
                    await fetch("http://localhost:3000/api/songs/played", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        songId: finishedSong._id,
                        playedAt: new Date(),
                      }),
                    });

                    // Luego actualizar la cola local
                    const newQueue = [...queue];
                    newQueue.shift();
                    setQueue(newQueue);
                  }
                }
              }}
            />
          )}

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
            Next:
          </Typography>
          <List
            sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", borderRadius: 1, p: 2 }}
          >
            {/* // En ProjectorInterface.jsx, modificar la sección donde se mapea la cola */}
            {queue.slice(1).map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255, 255, 255, 0.05)",
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
                    bgcolor: (() => {
                      // Gradiente de rojo a verde basado en la posición
                      if (index === 0) return "#4CAF50"; // Verde para el siguiente
                      if (index === 1) return "#8BC34A"; // Verde claro
                      if (index === 2) return "#FFEB3B"; // Amarillo
                      if (index === 3) return "#FF9800"; // Naranja
                      return "#F44336"; // Rojo para los más lejanos
                    })(),
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
