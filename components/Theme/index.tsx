import { createTheme, PaletteOptions } from "@mui/material/styles";
import { pink, orange, grey } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
    palette: {
      danger: {
        main: string;
      };
      primary: {
        main: string;
      };
      secondary: {
        main: string;
      };
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
    palette?: PaletteOptions;
  }
}

const theme = createTheme({
  status: {
    danger: orange[500],
  },
  palette: {
    primary: {
      main: grey[500],
    },
    secondary: {
      main: pink[500],
    },
    text: {
      primary: grey[800],
      secondary: pink[800],
    },
  },
});

// type Props = {
//   children: JSX.Element;
// };

// const Theme = ({ children }: Props) => {
//   const theme = useSelector(state => getTheme(state));

//   return <ThemeProvider theme={themes[theme]}>{children}</ThemeProvider>;
// };

export default theme;
