import React, { ReactElement, ReactNode, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  TextField,
  Grid,
  CssBaseline,
  Paper,
  Avatar,
  Typography,
  Button,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useAuth } from "contexts/AuthUserContext";
import { showError, showSuccess } from "utils/toastify";

const loginSchema = yup.object().shape({
  email: yup.string().email(),
  password: yup.string().min(4).required(),
});

type LoginPageWithLayout = NextPage & {
  getLayout: (page: ReactElement) => ReactNode;
};

const LoginPage: LoginPageWithLayout = () => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const { authUser, loading, signInWithEmailAndPassword } = useAuth();

  useEffect(() => {
    if (!loading && authUser) {
      router.push("/dashboard");
    }
  }, [loading, authUser]);

  const onSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    signInWithEmailAndPassword(email, password)
      .then(() => {
        router.push("/dashboard");
        showSuccess("Connexion réussie");
      })
      .catch(() => {
        showError("Identifiants incorrects");
      });
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          background:
            "linear-gradient(to bottom right, #55a0b4 0%, #3d768a 100%)",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Connexion
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1 }}
          >
            <Controller
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.email}
                  helperText={
                    errors.email ? errors.email?.message?.toString() : ""
                  }
                  label="Email"
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  margin="normal"
                />
              )}
              name="email"
              control={control}
            />

            <Controller
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.password}
                  helperText={
                    errors.password ? errors.password?.message?.toString() : ""
                  }
                  type="password"
                  label="Mot de passe"
                  autoComplete="current-password"
                  required
                  fullWidth
                  margin="normal"
                />
              )}
              name="password"
              control={control}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Se connecter
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Mot de passe oublié
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Vous n'avez pas encore de compte ? Rejoignez nous !"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

LoginPage.getLayout = (page: ReactElement) => {
  return <Box sx={{ display: "flex" }}>{page}</Box>;
};

export default LoginPage;
