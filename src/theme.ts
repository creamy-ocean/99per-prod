import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "Noto Sans KR",
    body: "Noto Sans KR",
  },
  colors: {
    brand: {
      50: "#5096F2",
      100: "#7EB0F2",
      500: "#008BE8",
    },
  },
  components: {
    Heading: {
      variants: {
        typewriter: {
          color: "white",
          fontWeight: "bold",
        },
        logo: {
          fontFamily: "Luckiest Guy",
          color: "white",
          textShadow: "3px 3px #008BE8",
        },
      },
    },
    Text: {
      variants: {
        desc: {
          color: "white",
          letterSpacing: "-1px",
          fontWeight: "bold",
        },
        impact: {
          position: "fixed",
          top: "18rem",
          left: "37.5rem",
        },
        "google-login": {
          fontFamily: "Roboto",
          fontSize: "0.9rem",
        },
        "select-box": {
          fontSize: "0.9rem",
        },
      },
    },
    Button: {
      sizes: {
        sm: {
          padding: "1rem",
        },
        md: {
          padding: "1rem",
          borderRadius: "lg",
        },
      },
      variants: {
        "with-round-border": {
          borderRadius: "full",
        },
      },
      defaultProps: {
        colorScheme: "brand",
      },
    },
  },
});

export default theme;
