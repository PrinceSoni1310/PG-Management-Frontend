import { useState } from "react";
import AppRouter from "./router/AppRoutes";
import { ToastContainer , Bounce } from "react-toastify";
import axios from "axios";
// import './App.css'

function App() {
  const [count, setCount] = useState(0);
  axios.defaults.baseURL = "http://localhost:3000"

  return (
    <>
      <AppRouter />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  );
}

export default App;
