import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import {Home, Login, Profile, ProtectedRoute, Signup} from "./pages";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

const router = createBrowserRouter(
  createRoutesFromElements(<Route path="/" element={<App />}>
    <Route path="" element={<ProtectedRoute auth={true}><Home /></ProtectedRoute>} />
    <Route path="profile" element={<ProtectedRoute auth={true}><Profile /></ProtectedRoute>} />
    <Route path="login" element={<Login />} />
    <Route path="signup" element={<Signup />} />
  </Route>)
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
   <RouterProvider router={router} />
   </Provider>
  </StrictMode>
);

