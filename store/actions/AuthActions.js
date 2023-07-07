// import { createAsyncThunk } from '@reduxjs/toolkit';

// import { logInWithEmailAndPassword, formatError } from '../../services/AuthService';

// export function loginAction(email, password) {
//   return dispatch => {
//     logInWithEmailAndPassword(email, password)
//       .then(response => {
//         // dispatch(loginConfirmedAction(response.data));
//       })
//       .catch(error => {
//         const errorMessage = formatError(error.response.data);
//         dispatch(loginFailedAction(errorMessage));
//       });
//   };
// }

// export function loginFailedAction(data) {
//   return {
//     type: LOGIN_FAILED_ACTION,
//     payload: data,
//   };
// }
