import React from "react";
import { Box, Typography } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import { useKaraoke } from "../src/context/KaraokeContext";
const QRCodeDisplay = () => {
  const { queue } = useKaraoke();

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "10px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
        zIndex: 1000,
      }}
    >
      <Typography variant="h6" sx={{ color: "white", textAlign: "center" }}>
        Agrega tu canción
      </Typography>
      <QRCodeCanvas
        value={window.location.href}
        size={100}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"}
        includeMargin={false}
      />
    </Box>
  );
};
export default QRCodeDisplay;
