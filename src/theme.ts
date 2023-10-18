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
    Button: {
      sizes: {
        sm: {
          padding: "1rem",
        },
        md: {
          padding: "1.5rem",
          borderRadius: "2rem",
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
      },
    },
    Heading: {
      variants: {
        typewriter: {
          color: "white",
          fontWeight: "bold",
        },
        logo: {
          fontFamily: "Luckiest Guy",
          color: "white",
          textShadow: "3px 3px #5096F2",
        },
      },
    },
  },
});

export default theme;
