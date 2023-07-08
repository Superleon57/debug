import React, { useEffect } from "react";
import { useFormContext, Control, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import { TabPanel } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import {
  Grid,
  Box,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";

import OpeningTimeInput from "./OpeningTimeInput";

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <Typography variant="body1" color="error" sx={{ mt: 2 }}>
      {message}
    </Typography>
  );
};

const IsClosedCheckbox = ({
  slotsIndex,
  control,
}: {
  slotsIndex: string;
  control: any;
}) => {
  return (
    <FormControlLabel
      control={
        <Controller
          name={`${slotsIndex}.isClosed`}
          control={control}
          render={({ field: props }) => (
            <Checkbox
              {...props}
              checked={props.value}
              onChange={(e) => props.onChange(e.target.checked)}
            />
          )}
        />
      }
      label="Fermé"
    />
  );
};

IsClosedCheckbox.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
};

type TimeSlotProps = {
  control: Control<any>;
  index: number;
  name: string;
  remove: (index: number) => void;
  errors: any;
};

function TimeSlot({ control, index, remove, name, errors }: TimeSlotProps) {
  const openingError = errors?.slots[index]?.opening;
  const closingError = errors?.slots[index]?.closing;
  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        sx={{ mt: 1 }}
        justifyContent="center"
      >
        <OpeningTimeInput
          label="Heure d'ouverture"
          control={control}
          name={`${name}.opening`}
        />
        <OpeningTimeInput
          label="Heure de fermeture"
          control={control}
          name={`${name}.closing`}
        />
        <IconButton onClick={() => remove(index)}>
          <CloseIcon />
        </IconButton>
      </Box>

      {openingError && <ErrorMessage message={openingError?.message} />}
      {closingError && <ErrorMessage message={closingError?.message} />}
    </Box>
  );
}

type OpeningTimeTabProps = {
  day: string;
  dayIndex: number;
  errors: any;
};

const OpeningTimeTab = ({ day, dayIndex, errors }: OpeningTimeTabProps) => {
  const slotsIndex = `openingTimes[${dayIndex}]`;
  const { control, getValues, register, watch, setValue } = useFormContext();

  const fields = watch(slotsIndex);

  useEffect(() => {
    register(`${slotsIndex}.slots`, { value: [] });
    register(`${slotsIndex}.isClosed`, { value: false });
  }, []);

  const appendSlot = () => {
    const slots = getValues(`${slotsIndex}.slots`);
    slots.push({ id: uuidv4(), opening: "", closing: "" });
    setValue(`${slotsIndex}.slots`, slots);
  };

  const removeSlot = (index: number) => {
    const { slots } = fields;
    const newSlots = slots.filter((_slot: any, i: number) => i !== index);

    setValue(`${slotsIndex}.slots`, newSlots);
  };

  const { isClosed } = fields || {};

  return (
    <TabPanel key={day} value={day}>
      <Grid item xs={12}>
        <IsClosedCheckbox {...{ slotsIndex, control }} />
      </Grid>
      {errors && <span>{errors?.slots?.message}</span>}

      {!isClosed && (
        <>
          <Grid container spacing={1} component={Box} sx={{ width: 500 }}>
            {fields?.slots?.map((slot: any, index: number) => {
              const name = `${slotsIndex}.slots[${index}]`;
              return (
                <TimeSlot
                  remove={removeSlot}
                  key={slot.id}
                  {...{ control, index, name, errors }}
                />
              );
            })}
          </Grid>

          <Button
            color="primary"
            variant="outlined"
            sx={{ m: 2 }}
            onClick={() => appendSlot()}
          >
            Ajouter une plage horaire
          </Button>
        </>
      )}
    </TabPanel>
  );
};

export default OpeningTimeTab;
