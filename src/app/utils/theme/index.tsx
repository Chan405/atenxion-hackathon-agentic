"use client";

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      yellow: string;
      black: string;
      white: string;
      darkGrey: string;
      grey: string;
      lightGrey: string;
      disabledGrey: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      yellow: string;
      black: string;
      white: string;
      darkGrey: string;
      grey: string;
      greyText: string;
      lightGrey: string;
      disabledGrey: string;
    };
  }
}
const theme = createTheme({
  typography: {
    fontFamily: ["Inter", "Figtree"].join(","),
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: "#00bfa1",
      light: "#e8f0ff",
    },
    secondary: {
      main: "#F1EEEF",
      light: "#f2f2f2",
    },
    success: {
      main: "#6AC874",
    },
    error: {
      main: "#ef476f",
    },
    // warning: {
    //   main: "#F8BB4D",
    // },
    custom: {
      yellow: "#F8BB4D",
      black: "#252524",
      white: "#ffffff",
      darkGrey: "#636464",
      grey: "#dddedf",
      greyText: "#343A40",
      lightGrey: "#f4f4f4",
      disabledGrey: "#A1A2A2",
    },
  },
});

export default theme;
