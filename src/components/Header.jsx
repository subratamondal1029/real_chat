import { LogOut, Moon, Send, Sun, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../store/themeSlice";
import "../Css/Header.css";
import authService from "../appwrite/authConfig";
import { logoutData } from "../store/authSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Header = () => {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleTheme = () => {
    dispatch(setTheme(theme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.documentElement.className = theme;
  },[theme])

  const Logout = () => {
    authService.logout().then(() => {
      dispatch(logoutData());
      navigate("/login");
    });
  };

  return (
    <header>
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
      <button className="headerBtn">
          <Send size={20} />
      </button>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
      <button className="headerBtn">
          <User size={20} />
      </button>
        </NavLink>
      <button className="headerBtn" onClick={toggleTheme}>
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      <button className="headerBtn" onClick={Logout}>
        <LogOut size={20} />
      </button>
    </header>
  );
};

export default Header;
