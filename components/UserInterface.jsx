import { Search, Add, PlayArrow, QueueMusic } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import { useNavigate } from "react-router-dom";
// En UserInterface.jsx, añade al inicio:
import logo from "/src/media/ludi-logo.png";
import {
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  Paper,
  Snackbar,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

export default function UserInterface() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [queue, setQueue] = useState([]);
  const [userName, setUserName] = useState("");
  const [lastAdded, setLastAdded] = useState(null);
  const navigate = useNavigate();
  const [previewVideoId, setPreviewVideoId] = useState(null);

  // Agregar las opciones para el reproductor de YouTube
  const opts = {
    height: "200",
    width: "350",
    playerVars: {
      autoplay: 0,
    },
  };

  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  // const WAIT_TIME = 180000; // 3 minutos en milisegundos
  const WAIT_TIME = 10000; // 10 segundos en milisegundos (antes era 180000)

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const searchYouTube = async () => {
    // Primero validamos el tiempo
    if (lastAdded && Date.now() - lastAdded < WAIT_TIME) {
      alert("Debes esperar 10 segundos entre canciones");
      return;
    }
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${searchTerm}&type=video&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    setResults(data.items);
  };

  const addToQueue = (video) => {
    if (!userName) return alert("Ingresa tu nombre");
    if (lastAdded && Date.now() - lastAdded < WAIT_TIME) {
      return alert("Debes esperar 10 segundos entre canciones");
    }
    // En UserInterface.jsx, dentro de la función addToQueue:
    setTimeRemaining(30); // 180 segundos = 3 minutos
    setQueue([...queue, { ...video, user: userName }]);
    setLastAdded(Date.now());
    setUserName("");
    setSearchTerm(""); /// Agregar el mensaje de confirmación
    setResults([]); // Agregar esta línea para limpiar los resultados
    setOpenSnackbar(true);

    // alert('Canción agregada a la cola');/ Añadir esta línea para resetear el campo de búsqueda
  };
  // Agregar este useEffect para actualizar el temporizador
  useEffect(() => {
    let timer;
    if (lastAdded) {
      const remaining = Math.max(
        0,
        Math.ceil((WAIT_TIME - (Date.now() - lastAdded)) / 1000)
      );
      setTimeRemaining(remaining);

      timer = setInterval(() => {
        const newRemaining = Math.max(
          0,
          Math.ceil((WAIT_TIME - (Date.now() - lastAdded)) / 1000)
        );
        setTimeRemaining(newRemaining);

        if (newRemaining <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [lastAdded]);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        {/* <img
          src={logo}
          alt="Logo"
          style={{
            width: "100%", // Cambia a 100%
            maxWidth: "200px", // Añade un maxWidth
            height: "auto",
            display: "block",
            margin: "0 auto",
          }}
        /> */}
        <Typography
          variant="h4"
          sx={{ color: "white", mb: 4, textAlign: "center" }}
        >
          Karaoke chingón
        </Typography>
        {timeRemaining > 0 && (
          <Typography
            variant="h6"
            sx={{ color: "white", mb: 2, textAlign: "center" }}
          >
            Tiempo restante para enviar otra canción: {timeRemaining} segundos
          </Typography>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Escribe tu nombre"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                },
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiInputBase-input": { color: "white" },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                label="Buscar canciones"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchYouTube();
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "white" },
                  },
                  "& .MuiInputLabel-root": { color: "white" },
                  "& .MuiInputBase-input": { color: "white" },
                }}
              />
              <Button
                variant="contained"
                onClick={searchYouTube}
                sx={{ minWidth: "100px" }}
              >
                <Search /> Buscar
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                bgcolor: "rgba(255, 255, 0, 0.2)", // Fondo amarillo semi-transparente
                textAlign: "center",
                mb: 2,
                border: "2px solid yellow", // Borde amarillo
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "yellow", // Texto amarillo
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold", // Texto en negrita
                  textShadow: "1px 1px 2px black", // Sombra para mejor legibilidad
                }}
              >
                <QueueMusic sx={{ mr: 1 }} />
                ¡ATENCIÓN! ¿Quieres adelantar tu canción? Acércate al host y por
                solo $15 pesos podrás cantarla antes
                <PlayArrow sx={{ ml: 1 }} />
              </Typography>
            </Paper>
          </Grid>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            message="Canción agregada a la cola"
          />
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

                    {/* Mostrar el reproductor cuando se seleccione el video */}
                    {previewVideoId === video.id.videoId && (
                      <Box sx={{ my: 2 }}>
                        <YouTube videoId={video.id.videoId} opts={opts} />
                      </Box>
                    )}

                    {/* Agregar botón para previsualizar */}
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

          <Grid item xs={12}>
            <Typography variant="h5" sx={{ color: "white", mb: 2 }}>
              Cola actual:
            </Typography>
            <List
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 1,
                p: 2,
              }}
            >
              {queue.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    mb: 1,
                    borderRadius: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Usuario: {item.user}
                  </Typography>
                  <Typography variant="body1">
                    Canción: {item.snippet.title}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{ color: "white", mb: 4, textAlign: "center" }}
            >
              Agrega tu canción
            </Typography>
            <QRCodeCanvas value={window.location.href} />
          </Grid>
        </Grid>
        <Typography
          variant="h6"
          sx={{ color: "white", mb: 4, textAlign: "center" }}
        >
          by @luditalk
        </Typography>
      </Box>
    </Container>
    // <Container maxWidth="md">
    //   {/* ... resto del código ... */}
    //   <div className="watermark">by @luditalk</div>
    // </Container>
  );
}
