import { toast } from "react-toastify";

const permanantToast = {
  position: "bottom-right",
  autoClose: false,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const normalToast = {
  ...permanantToast,
  autoClose: 5000,
  hideProgressBar: false,
};

export const showAuthError = () => {
  toast.error(
    "Une erreur est survenu lors de l'authentification",
    permanantToast
  );
};

export const showOrderNextStepError = () => {
  toast.error("Impossible de valider cette commande.", permanantToast);
};

export const showOrderNextStepSuccess = () => {
  toast.success("Commande validée avec succès.");
};

export const showPermanantError = (message) => {
  toast.error(message, permanantToast);
};

export const showPermanantSuccess = (message) => {
  toast.success(message, permanantToast);
};

export const showError = (message: string) => {
  toast.error(message, normalToast);
};

export const showSuccess = (message: string) => {
  toast.success(message, normalToast);
};

export const showInfo = (message: string) => {
  toast.info(message, normalToast);
};
