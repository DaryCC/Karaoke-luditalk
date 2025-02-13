import React, { useState, useEffect } from 'react'
import { List, ListItem, Button, Typography, TextField } from '@mui/material'

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
    <div>
      {/* <div className="content">Prueba en Host interface</div> */}
      <Typography variant="h4">Controles del Host</Typography>
      
      <div>
        <Button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'Pausar' : 'Reproducir'}
        </Button>
        <Button onClick={() => setCurrentSongIndex(prev => prev - 1)} disabled={currentSongIndex === 0}>
          Anterior
        </Button>
        <Button onClick={() => setCurrentSongIndex(prev => prev + 1)} disabled={currentSongIndex >= queue.length - 1}>
          Siguiente
        </Button>
      </div>

      <List>
        {queue.map((item, index) => (
          <ListItem key={index}>
            {item.snippet.title}
            <Button onClick={() => handleMoveSong(index, 'next')}>Mover siguiente</Button>
            <Button onClick={() => handleMoveSong(index, 'last')}>Mover al final</Button>
            <Button onClick={() => handleDelete(index)} color="error">Eliminar</Button>
          </ListItem>
        ))}
      </List>
     <div className="watermark">by @luditalk</div>
    </div>
    
  )
}