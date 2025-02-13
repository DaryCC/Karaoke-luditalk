import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
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
  Snackbar
} from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';

export default function UserInterface() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [queue, setQueue] = useState([]);
  const [userName, setUserName] = useState('');
  const [lastAdded, setLastAdded] = useState(null);
  const navigate = useNavigate();

  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);


  const searchYouTube = async () => {
    // Primero validamos el tiempo
    if (lastAdded && Date.now() - lastAdded < 180000) {
      alert('Debes esperar 3 minutos entre canciones');
      return;
      }
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${searchTerm}&type=video&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    setResults(data.items);
  };

  const addToQueue = (video) => {
    if (!userName) return alert('Ingresa tu nombre');
    if (lastAdded && Date.now() - lastAdded < 180000) {
      return alert('Debes esperar 3 minutos entre canciones');
    }
    setQueue([...queue, { ...video, user: userName }]);
    setLastAdded(Date.now());
    setUserName('');
    setSearchTerm(''); /// Agregar el mensaje de confirmación
    setResults([]); // Agregar esta línea para limpiar los resultados
    setOpenSnackbar(true);

    // alert('Canción agregada a la cola');/ Añadir esta línea para resetear el campo de búsqueda

  };
// Agregar este useEffect para actualizar el temporizador
useEffect(() => {
  let timer;
  if (timeRemaining > 0) {
    timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
  }
  return () => clearInterval(timer);
}, [timeRemaining]);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
          Karaoke chingón
        </Typography>
          {timeRemaining > 0 && (
            <Typography variant="h6" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
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
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiInputBase-input': { color: 'white' }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Buscar canciones"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
onKeyDown={(e) => {
  if (e.key === 'Enter') {
    searchYouTube();
  }
}}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputBase-input': { color: 'white' }
                }}
              />
              <Button 
                variant="contained" 
                onClick={searchYouTube}
                sx={{ minWidth: '100px' }}
              >
                Buscar
              </Button>
            </Box>
          </Grid>
<Snackbar
  open={openSnackbar}
  autoHideDuration={3000}
  onClose={() => setOpenSnackbar(false)}
  message="Canción agregada a la cola"
/>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
              {results.map(video => (
                <Card key={video.id.videoId} sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
                  <CardContent>
                    <Typography sx={{ color: 'white' }}>{video.snippet.title}</Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => addToQueue(video)}
                      sx={{ mt: 1 }}
                    >
                      Agregar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>Cola actual:</Typography>
            <List sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
              {queue.map((item, index) => (
                <ListItem key={index} sx={{ color: 'white' }}>
                  {item.user} - {item.snippet.title}
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
          Agrega tu canción
        </Typography>
            <QRCodeCanvas value={window.location.href} />
          </Grid>
        </Grid>
        <Typography variant="h6" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
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