import "../styles/globals.css";
import type { AppProps } from "next/app";
import AppStateProvider from "../provider/AppStateProvider";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  console.log("MYApp")
  return (
    <AppStateProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppStateProvider>
  );
}

export default MyApp;
