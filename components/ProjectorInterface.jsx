import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useKaraoke } from '../src/context/KaraokeContext';
import VideoPlayer from './VideoPlayer';
import QueueDisplay from './QueueDisplay';
import QRCodeDisplay from './QRCodeDisplay';
import YouTube from 'react-youtube'; // Agregar esta importación
export default function ProjectorInterface() {
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const { queue, setQueue } = useKaraoke();
  useEffect(() => {
    if (queue.length > 0 && queue[0]?.videoId !== currentVideoId) {
      setCurrentVideoId(queue[0].videoId);
    }
  }, [queue, currentVideoId]);
  const handleVideoEnd = async (event) => {
    if (event.data === YouTube.PlayerState.ENDED) {
      try {
        const finishedSong = queue[0];
        if (!finishedSong) return;
        const newQueue = queue.slice(1);
        setQueue(newQueue);
        if (newQueue.length > 0) {
          setTimeout(() => {
            setCurrentVideoId(newQueue[0].videoId);
          }, 0);
        }
        await fetch('http://localhost:3000/api/songs/played', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            songId: finishedSong._id,
            playedAt: new Date(),
          }),
        });
      } catch (error) {
        console.error('Error updating song status:', error);
      }
    }
  };
  return (
    <Box sx={{ position: 'relative', height: '100vh' }}>
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        <Typography
          sx={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 'bold',
            zIndex: 1000,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
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