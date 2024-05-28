import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "~/store/ThemeProvider";
import Navigation from "~/components/shared/Navigation";

export default function App({ Component, pageProps }: AppProps) {
  return (<>
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <Navigation />
  <Component {...pageProps} />
  </ThemeProvider>
  </>);
}