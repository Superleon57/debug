import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import {
  Button,
  Grid,
  IconButton,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import {
  Save as SaveIcon,
  VolumeDown,
  VolumeUp,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
} from "@mui/icons-material";

import { showSuccess } from "utils/toastify";

type SoundSettings = {
  volume: number;
  playSound: boolean;
};

const SoundSettings = () => {
  const [volume, setVolume] = React.useState<number>(75);
  const [play, setPlay] = useState<boolean>(false);

  useEffect(() => {
    const volume = Number(localStorage.getItem("order-alert-volume")) || 75;
    setVolume(volume);
  }, []);

  const [playSound, sound] = useSound("/sounds/new_order.mp3", {
    volume: volume / 100,
    interrupt: true,
    onPlay: () => {
      setPlay(true);
    },
    onend: () => {
      setPlay(false);
    },
    onPause: () => {
      setPlay(false);
    },
  });

  const handleChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  const handleSubmit = () => {
    localStorage.setItem("order-alert-volume", volume.toString());
    showSuccess("Volume sauvegardé");
  };

  const handlePlaySound = () => {
    setPlay(true);

    playSound();
  };

  const handleStopSound = () => {
    setPlay(false);

    sound.stop();
  };

  return (
    <Grid item xs={12} md={4}>
      <Typography variant="h5" color="initial" sx={{ mb: 2 }}>
        Alertes sonores
      </Typography>
      Volume : {volume}%
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <VolumeDown />
        <Slider value={volume} onChange={handleChange} color="secondary" />
        <VolumeUp />

        {!play ? (
          <IconButton color="secondary" onClick={handlePlaySound}>
            <PlayArrowIcon />
          </IconButton>
        ) : (
          <IconButton color="secondary" onClick={handleStopSound}>
            <StopIcon />
          </IconButton>
        )}
      </Stack>
      <Button
        variant="contained"
        endIcon={<SaveIcon />}
        sx={{ m: 2 }}
        onClick={handleSubmit}
        color="secondary"
      >
        Sauvegarder
      </Button>
    </Grid>
  );
};

export default SoundSettings;
