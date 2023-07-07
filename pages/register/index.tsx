import React, { ReactElement, ReactNode } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CssBaseline,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { NextPage } from "next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { client } from "utils/api";
import { showPermanantError, showPermanantSuccess } from "utils/toastify";

const Logo = styled("img")(() => ({
  display: "block",
  borderRadius: "5px 5px 0 0",
  height: "40px",
  objectFit: "cover",
}));

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactElement;
}) => {
  return (
    <Card sx={{ borderRadius: "10px", margin: "10px" }}>
      <CardHeader title={title} />
      <Divider />
      <CardContent>{children}</CardContent>
    </Card>
  );
};

const registerSchema = yup.object().shape({
  shopName: yup.string().required("Nom de la boutique obligatoire"),
  // address: yup.string().required(),

  firstName: yup.string().required("Prénom obligatoire"),
  lastName: yup.string().required("Nom obligatoire"),

  email: yup.string().email().required("Email obligatoire"),
  password: yup.string().min(4).required("Mot de passe obligatoire"),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "Les mots de passe doivent être identiques"
    )
    .required("Confirmation du mot de passe obligatoire"),
});

type RegisterPageWithLayout = NextPage & {
  getLayout: (page: ReactElement) => ReactNode;
};

const RegisterPage: RegisterPageWithLayout = () => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) });

  const [isLoading, setIsLoading] = React.useState(false);

  const fetchRegister = async (data: any) => {
    const body = {
      payload: {
        shopName: data.shopName,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
    };

    try {
      const result = await client.post("/shop/register", body);
      showPermanantSuccess("Votre compte a bien été créé");
      router.push("/login");
      return result.data;
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        showPermanantError("Cette adresse mail est déjà utilisée");
      } else {
        showPermanantError("Une erreur est survenue");
      }
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    await fetchRegister(data);
    setIsLoading(false);
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />

      <Grid
        item
        xs={false}
        sm={6}
        sx={{
          backgroundColor: "#F9F9FB",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box sx={{ background: "white", padding: 1 }}>
          <Logo src="/images/LIVyou_Q.png" alt="logo" />
        </Box>
        <Divider />

        <Box
          sx={{
            my: 4,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Création d&aposun compte vendeur
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1 }}
          >
            <Section title={"Informations de la boutique"}>
              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.shopName}
                    helperText={errors.shopName ? errors.shopName?.message : ""}
                    label="Nom de la boutique"
                    autoFocus
                    required
                    fullWidth
                    margin="normal"
                  />
                )}
                name="shopName"
                control={control}
              />
            </Section>
            <Section title={"Informations personnelles"}>
              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.lastName}
                    helperText={errors.lastName ? errors.lastName?.message : ""}
                    label="Votre nom"
                    autoFocus
                    required
                    fullWidth
                    margin="normal"
                  />
                )}
                name="lastName"
                control={control}
              />
              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.firstName}
                    helperText={
                      errors.firstName ? errors.firstName?.message : ""
                    }
                    label="Votre prénom"
                    autoFocus
                    required
                    fullWidth
                    margin="normal"
                  />
                )}
                name="firstName"
                control={control}
              />
            </Section>

            <Section title={"Authentification"}>
              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email?.message : ""}
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
                    helperText={errors.password ? errors.password?.message : ""}
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
              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.confirmPassword}
                    helperText={
                      errors.confirmPassword
                        ? errors.confirmPassword?.message
                        : ""
                    }
                    type="password"
                    label="Confirmation du mot de passe"
                    autoComplete="current-password"
                    required
                    fullWidth
                    margin="normal"
                  />
                )}
                name="confirmPassword"
                control={control}
              />
            </Section>

            <Divider />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 3,
                mb: 2,
              }}
            >
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="J'ai lu et j'accepte les termes et conditions"
              />

              <LoadingButton
                type="submit"
                variant="contained"
                color="info"
                loading={isLoading}
              >
                Valider mon inscription
              </LoadingButton>

              <Link href="/login" variant="body2" sx={{ mt: 2 }}>
                Vous avez déjà un compte ? Connectez-vous.
              </Link>
            </Box>
          </Box>
        </Box>

        <Box component="form" noValidate sx={{ mt: 1 }}></Box>
      </Grid>
      <Grid
        item
        xs={false}
        sm={6}
        sx={{
          background:
            "linear-gradient(to bottom left, #55a0b4 0%, #3d768a 100%)",
        }}
      ></Grid>
    </Grid>
  );
};

RegisterPage.getLayout = (page: ReactElement) => {
  return <Box sx={{ display: "flex" }}>{page}</Box>;
};

RegisterPage.title = "Connexion";

export default RegisterPage;
