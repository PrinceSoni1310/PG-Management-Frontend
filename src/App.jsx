import { useState } from "react";
import AppRouter from "./router/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer , Bounce } from "react-toastify";
import axios from "axios";

// import './App.css'

function App() {
  const [count, setCount] = useState(0);


  return (
    <>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
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
