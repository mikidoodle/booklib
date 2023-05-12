import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "15px",
    },
  };
  const customStyles2 = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "15px",
      padding: "20px 150px",
    },
  };
  useEffect(() => {
    window.addEventListener("online", () => {
      setIsOpen(false);
      setIsConnected(true);
    });
    window.addEventListener("offline", () => {
      setIsOpen(true);
      setIsConnected(false);
    });
  }, []);
  return (
    <div id="appElement">
      <Modal isOpen={isOpen} style={customStyles}>
        <h1 style={{ fontSize: "48px", textAlign: "center" }}>:/</h1>
        <h3>Your device isn't connected to the Internet.</h3>
        <p style={{ textAlign: "center" }}>
          Check your connection and try again.
        </p>
      </Modal>
      <Modal
        isOpen={isConnected}
        onRequestClose={() => setIsConnected(false)}
        style={customStyles2}
      >
        <h1 style={{ fontSize: "48px", textAlign: "center" }}>:)</h1>
        <h3>Back online!</h3>
        <button onClick={() => setIsConnected(false)}>Dismiss</button>
      </Modal>
      <Head>
        <meta name="theme-color" content="#ede9d5">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
     {isOpen ? null : <Component {...pageProps} />}
    </div>
  );
}
export default MyApp;
