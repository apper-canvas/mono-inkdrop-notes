import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router/index.jsx";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        style={{ zIndex: 9999 }}
      />
    </>
  );
};

export default App;