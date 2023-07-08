import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  ListItem,
  Checkbox,
  ListItemText,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SaveIcon from "@mui/icons-material/Save";
import DeselectIcon from "@mui/icons-material/Deselect";
import { useFormContext } from "react-hook-form";

import Modal from "components/Modal";

const DuplicationModal = forwardRef((params, ref) => {
  const { setValue, getValues } = useFormContext();

  const [open, setOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const days = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  const handleCheckboxChange = (day: string) => {
    const isChecked = selectedDays?.includes(day);
    const updatedDays = isChecked
      ? selectedDays?.filter((id: string) => id !== day)
      : [...selectedDays, day];

    setSelectedDays(updatedDays);
  };

  const handleSelectAll = () => {
    setSelectedDays(days);
  };
  const handleDeselectAll = () => {
    setSelectedDays([]);
  };

  useImperativeHandle(ref, () => ({
    openModal() {
      setOpen(true);
    },
  }));

  const duplicateOnSelected = () => {
    const monday = getValues("openingTimes[0]");
    selectedDays?.forEach((day) => {
      if (day === "Lundi") return;

      const index = days.indexOf(day);

      setValue(`openingTimes[${index}]`, monday);
    });

    setSelectedDays([]);
    setOpen(false);
  };

  return (
    <Modal {...{ open, setOpen }} style={{ width: 400 }}>
      <h2>Dupliquer les horaires</h2>
      <p>
        Sélectionnez les jours sur lesquels vous souhaitez dupliquer les
        horaires du lundi
      </p>

      <IconButton
        color="secondary"
        onClick={handleSelectAll}
        sx={{ width: "40px", height: "40px", borderRadius: 2 }}
      >
        <DoneAllIcon />
      </IconButton>
      <IconButton
        color="secondary"
        onClick={handleDeselectAll}
        sx={{ width: "40px", height: "40px", borderRadius: 2 }}
      >
        <DeselectIcon />
      </IconButton>

      {days.map((day, index) => {
        if (day === "Lundi") return null;
        const labelId = `checkbox-list-label-${day}`;

        return (
          <ListItem key={index} disablePadding>
            <Checkbox
              checked={selectedDays?.includes(day)}
              onChange={() => handleCheckboxChange(day)}
              name={`days.${day}`}
              value={day}
            />
            <ListItemText id={labelId} primary={day} />
          </ListItem>
        );
      })}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="contained"
          endIcon={<SaveIcon />}
          color="secondary"
          onClick={duplicateOnSelected}
        >
          Valider
        </Button>
      </Box>
    </Modal>
  );
});

DuplicationModal.displayName = "DuplicationModal";

export default DuplicationModal;
