import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "./components";
import "./App.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authService from "./appwrite/authConfig";
import { loginData } from "./store/authSlice";

function App() {
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const path = location.pathname;

    if (path === "/login" || path === "/signup") {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(loginData(userData));
          navigate("/");
        }
      })
      .catch((error) => console.warn(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return "Loading..."; 

  return (
    <>
      {showHeader && <Header />}
      <Outlet />
    </>
  );
}

export default App;
