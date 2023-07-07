import * as yup from "yup";

export const openingTimeSchema = yup.object().shape({
  openingTimes: yup.array().of(
    yup.object().shape({
      isClosed: yup.boolean().optional(),
      slots: yup
        .array()
        .of(
          yup.object().shape({
            opening: yup
              .string()
              .test(
                "is-valid",
                "L'heure d'ouverture n'est pas valide.",
                (value, context) => {
                  const [currentSlot, daySlots] = context.from;

                  const { isClosed } = daySlots.value;
                  if (isClosed) return true;

                  if (!value) return false;

                  return true;
                }
              )
              .test(
                "consecutive-opening-closing",
                "L'horaire d'ouverture doit être supérieur à l'horaire de fermeture précédente.",
                (opening, context) => {
                  if (!opening) return true;

                  const [currentSlot, daySlots] = context.from;

                  const { slots } = daySlots.value;

                  const index = slots.findIndex(
                    (slot) => slot === currentSlot.value
                  );

                  if (index === 0) return true;

                  const previousSlot = slots[index - 1];

                  if (opening <= previousSlot?.closing) return false;

                  return true;
                }
              ),
            closing: yup
              .string()
              .test(
                "is-greater-than-opening",
                "L'heure de fermeture n'est pas valide.",
                (value, context) => {
                  const [currentSlot, daySlots] = context.from;

                  const { opening } = currentSlot.value;
                  const { isClosed } = daySlots.value;
                  if (isClosed) return true;

                  if (!value) return false;

                  if (opening && value <= opening) return false;

                  return true;
                }
              ),
          })
        )
        .test(
          "at-least-one-opening-time",
          "Au moins une horaire d'ouverture et de fermeture doit être ajoutée.",
          (value, context) => {
            const { isClosed } = context.parent;
            if (isClosed) {
              return true;
            }
            return value.some((time) => time.opening && time.closing);
          }
        ),
    })
  ),
});
