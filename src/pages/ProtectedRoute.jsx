import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ auth, children }) => {
  const { isLogin } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogin !== auth) navigate("/login");
  }, [isLogin, auth, navigate]);

  return children;
};

export default ProtectedRoute;
