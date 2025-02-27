import React, { useRef } from "react";
import YouTube from "react-youtube";
import { Box } from "@mui/material";
const VideoPlayer = ({ currentVideoId, onVideoEnd, queue }) => {
  const playerRef = useRef(null);
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        "& > div": {
          // Estilo para el contenedor del reproductor de YouTube
          width: "100%",
          maxWidth: `calc(80vh * 16/9)`, // Mantiene proporción 16:9 basada en la altura
          aspectRatio: "16/9",
        },
      }}
    >
      {currentVideoId && (
        <YouTube
          videoId={currentVideoId}
          opts={{
            height: "100%",
            width: "100%",
            playerVars: {
              autoplay: 1,
              mute: 1,
              controls: 1,
              modestbranding: 1,
              enablejsapi: 1,
              loop: 0,
              origin: window.location.origin,
              host: "https://www.youtube.com",
            },
          }}
          onReady={(event) => {
            playerRef.current = event.target;
            if (event.target && event.target.playVideo) {
              event.target.playVideo();
              event.target.unMute();
              event.target.setVolume(100);
              // Asegurar que el video comience desde el principio
              event.target.seekTo(0);
            }
          }}
          onStateChange={(event) => {
            // Verificar si el video ha terminado
            if (event.data === YouTube.PlayerState.ENDED) {
              // Llamar a onVideoEnd solo cuando el video realmente termina
              onVideoEnd(event);
              // Limpiar la referencia del reproductor
              playerRef.current = null;
            }
          }}
        />
      )}
    </Box>
  );
};
export default VideoPlayer;
