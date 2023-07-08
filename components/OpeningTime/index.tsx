import React, { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Grid } from "@mui/material";
import {
  ContentCopy as ContentCopyIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { yupResolver } from "@hookform/resolvers/yup";

import { OpeningTime } from "utils/types/openingTime";
import { useDispatch, useSelector } from "store";
import OpeningTimeTab from "components/OpeningTime/OpeningTimeTab";
import { openingTimeSchema } from "utils/validation/openingTimeSchema";
import { updateOpeningTime, getOpeningTimes } from "store/reducers/shopSlice";

import DuplicateHoursModal from "./DuplicateHoursModal";
import OpeningTimeTabs from "./OpeningTimeTabs";

const OpeningTime = () => {
  const dispatch = useDispatch();
  const openingTimes = useSelector(getOpeningTimes);
  const methods = useForm<{ openingTimes: OpeningTime[] }>({
    resolver: yupResolver(openingTimeSchema),
    defaultValues: { openingTimes },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const days = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  const duplicateHoursModalRef = useRef(null);

  const onSubmit = (data: OpeningTime[]) => {
    dispatch(updateOpeningTime(data));
  };

  const openDuplicateHoursModal = () => {
    duplicateHoursModalRef?.current?.openModal();
  };

  return (
    <Grid container spacing={2}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DuplicateHoursModal ref={duplicateHoursModalRef} />
          <Grid item xs={12}>
            <OpeningTimeTabs errors={errors}>
              {days.map((day, dayIndex) => {
                const dayErrors = errors?.openingTimes
                  ? errors?.openingTimes[dayIndex]
                  : null;
                return (
                  <OpeningTimeTab
                    {...{ control, day, dayIndex, errors: dayErrors }}
                    key={dayIndex}
                  />
                );
              })}
            </OpeningTimeTabs>
          </Grid>

          <br />
          <Button
            variant="contained"
            endIcon={<ContentCopyIcon />}
            color="secondary"
            onClick={openDuplicateHoursModal}
          >
            Dupliquer
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ m: 2 }}
            endIcon={<SaveIcon />}
            color="secondary"
          >
            Sauvegarder
          </Button>
        </form>
      </FormProvider>
    </Grid>
  );
};

export default OpeningTime;
