import React, { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import {QRCodeCanvas} from 'qrcode.react'
import YouTube from 'react-youtube'

export default function ProjectorInterface() {
  const [currentSong, setCurrentSong] = useState(null)
  
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h2">Cola del Karaoke</Typography>
      
      {currentSong && (
        <YouTube videoId={currentSong.id.videoId} opts={opts} />
      )}

      <div>
        <Typography variant="h5">
          Escanea para agregar canciones:
        </Typography>
        <QRCodeCanvas value={`${window.location.origin}`} size={200} />
      </div>
      <div className="watermark">by @luditalk</div>
    </div>
  )
}