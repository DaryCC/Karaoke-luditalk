import React, { useState, useEffect } from 'react'
import { List, ListItem, Button, Typography, TextField } from '@mui/material'
import { Container, Box, Paper, Grid } from '@mui/material';

export default function HostInterface() {
  const [queue, setQueue] = useState([])
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleMoveSong = (index, position) => {
    const newQueue = [...queue]
    const song = newQueue.splice(index, 1)[0]
    if (position === 'next') {
      newQueue.splice(currentSongIndex + 1, 0, song)
    } else {
      newQueue.push(song)
    }
    setQueue(newQueue)
  }

  const handleDelete = (index) => {
    setQueue(queue.filter((_, i) => i !== index))
  }

return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
          Controles Luditalk
        </Typography>
        
        <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* Botones de control */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button variant="contained" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? 'Pausar' : 'Reproducir'}
                </Button>
                {/* ... otros botones ... */}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <List sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
                {/* ... lista de canciones ... */}
              </List>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}