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
import {Home} from "./pages";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

const router = createBrowserRouter(
  createRoutesFromElements(<Route path="/" element={<App />}>
    <Route path="" element={<Home />} />
  </Route>)
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
   <RouterProvider router={router} />
   </Provider>
  </StrictMode>
);

