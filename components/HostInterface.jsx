import React, { useState } from "react";
import YouTube from "react-youtube";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Search,
  PlayArrow,
  Pause,
  SkipNext,
  Add,
  Delete,
} from "@mui/icons-material";
import { useKaraoke } from "../src/context/KaraokeContext";

export default function HostInterface() {
  const { queue, setQueue, playerState, setPlayerState } = useKaraoke();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  // const [queue, setQueue] = useState([]);
  const [previewVideoId, setPreviewVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const [playerControls, setPlayerControls] = useState({
    volume: 100,
    position: 0,
    isplaying: true,
    ismuted: false,
  });

  // Añadir métodos para manipular la cola
  const reorderQueue = (fromIndex, toIndex) => {
    const newQueue = [...queue];
    const [removed] = newQueue.splice(fromIndex, 1);
    newQueue.splice(toIndex, 0, removed);
    setQueue(newQueue);
  };
  const removeFromQueue = (index) => {
    setQueue(queue.filter((_, i) => i !== index));
  };
  //api de youtube
  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  // Opciones para el reproductor de YouTube
  const opts = {
    height: "200",
    width: "350",
    playerVars: {
      autoplay: 0,
    },
  };
  const searchYouTube = async () => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${searchTerm}&type=video&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    setResults(data.items);
  };

  const handlePlayPause = () => {
    setPlayerState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  };

  const handleNext = () => {
    if (currentSongIndex < queue.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    }
  };

  const addToQueue = (video) => {
    setQueue([...queue, video]);
    setSearchTerm("");
    setResults([]);
  };

  const handleVolumeChange = (value) => {
    setPlayerState((prev) => ({
      ...prev,
      volume: value,
    }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h4"
          sx={{ color: "white", mb: 4, textAlign: "center" }}
        >
          Panel de Control
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Buscar canciones"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchYouTube()}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "white" },
                  },
                  "& .MuiInputLabel-root": { color: "white" },
                  "& .MuiInputBase-input": { color: "white" },
                }}
              />
              <Button variant="contained" onClick={searchYouTube}>
                <Search /> Buscar
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Button variant="contained" onClick={handlePlayPause}>
                {isPlaying ? <Pause /> : <PlayArrow />}
                {isPlaying ? "Pausar" : "Reproducir"}
              </Button>
              <Button variant="contained" onClick={handleNext}>
                <SkipNext /> Siguiente
              </Button>
            </Box>
            {/* Botones adicionales */}
            {/* <Button onClick={() => handleVolumeChange(value)}>
              <VolumeUp /> Ajustar Volumen
            </Button>

            <Button onClick={() => handleSeek(seconds)}>
              <FastForward /> Adelantar
            </Button> */}
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }}>
              {results.map((video) => (
                <Card
                  key={video.id.videoId}
                  sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.05)" }}
                >
                  <CardContent>
                    <Typography sx={{ color: "white" }}>
                      {video.snippet.title}
                    </Typography>

                    {previewVideoId === video.id.videoId && (
                      <Box sx={{ my: 2 }}>
                        <YouTube videoId={video.id.videoId} opts={opts} />
                      </Box>
                    )}

                    <Button
                      variant="outlined"
                      onClick={() => setPreviewVideoId(video.id.videoId)}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      <PlayArrow /> Previsualizar
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => addToQueue(video)}
                      sx={{ mt: 1 }}
                    >
                      <Add /> Agregar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
