import App from "@/App";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/luckiest-guy";
import "@fontsource/noto-sans-kr";
import "@fontsource/roboto";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as ReactDOM from "react-dom/client";
import { AuthContextProvider } from "./context/AuthContext";
import theme from "./theme";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root") as HTMLElement;
ReactDOM.createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <ChakraProvider theme={theme} cssVarsRoot="body">
        <App />
      </ChakraProvider>
    </AuthContextProvider>
  </QueryClientProvider>
);
