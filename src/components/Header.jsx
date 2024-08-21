import { LogOut, Moon, Send, Sun, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../store/themeSlice";
import "../Css/Header.css";

const Header = () => {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const toggleTheme = () => {
    dispatch(setTheme(theme === "light" ? "dark" : "light"));
    document.documentElement.classList.toggle("light");
  };

  return (
    <header>
      <button className="headerBtn">{<Send size={20} />}</button>
      <button className="headerBtn">
        <User size={20} />
      </button>
      <button
        className="headerBtn"
        onClick={toggleTheme}
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      <button className="headerBtn">
        <LogOut size={20} />
      </button>
    </header>
  );
};

export default Header;
