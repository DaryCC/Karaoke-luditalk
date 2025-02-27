import React from 'react';
import { Box, Typography, List, ListItem, Grid } from '@mui/material';
const QueueDisplay = ({ queue }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        bgcolor: 'rgba(0,0,0,0.8)',
        p: 2,
        height: 'auto',
        maxHeight: '20vh',
        overflowX: 'auto',
        overflowY: 'auto',
      }}
    >
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
          Next:
        </Typography>
        <List sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1, p: 2 }}>
          {queue
            .filter((item) => !item.played)
            .slice(1)
            .map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  mb: 1,
                  borderRadius: 1,
                  position: 'relative',
                  padding: 2,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: -10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    bgcolor: (() => {
                      if (index === 0) return '#4CAF50';
                      if (index === 1) return '#8BC34A';
                      if (index === 2) return '#FFEB3B';
                      if (index === 3) return '#FF9800';
                      return '#F44336';
                    })(),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {index + 1}
                </Box>
                <Box sx={{ ml: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {item.user}
                  </Typography>
                  <Typography variant="body1">{item.snippet.title}</Typography>
                </Box>
              </ListItem>
            ))}
        </List>
      </Grid>
    </Box>
  );
};
export default QueueDisplay;