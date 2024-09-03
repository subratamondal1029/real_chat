import { Link, useNavigate } from "react-router-dom";
import { Input, LoadingBtn } from "../components";
import "../Css/Login.css";
import { useEffect, useState } from "react";
import authService from "../appwrite/authConfig";
import { useDispatch, useSelector } from "react-redux";
import { loginData } from "../store/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() =>{
    if (isLogin) {
      navigate("/")
    }
    document.title = "Login | RealChat"
  },[])

  const validateConditaions = {
    email:{
      required: true,
      pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
      message: "Please enter a valid email address"
    },
    password:{
      minLength: 6,
      required: true,
      message: "Password must be at least 6 characters long"
    }
  }

  const validate = () =>{
    let isValid = true
    for (const key in validateConditaions) {
      const data = formData[key]
      const rule = validateConditaions[key];

      if (rule.required && !data) {
        setError(rule.message)
       isValid = false
      }

      if (rule.pattern && !rule.pattern.test(data)) {
        setError(rule.message)
       isValid = false
      }

      if (rule.minLength && data.length < rule.minLength) {
        setError(rule.message)
       isValid = false
      }
    }
    return isValid
  }

  const handleChange = (e) => {
    setFormData(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleLogin = async (e) => {
    setIsloading(true)
    e.preventDefault();
    if(validate()){
      setError("")

      try {
        const userData = await authService.loginWithEmail(formData)
        if (userData) {
          dispatch(loginData(userData))
          navigate("/");
        }else throw new Error("Something went wrong")
      } catch (error) {
        setError(error)
      }
    }
    setIsloading(false)
  };

  return (
    <div className="LoginContainer">
      <form className="login" onSubmit={handleLogin}>
        <h2>Login</h2>
        <span>
          Don't have an account <Link to="/signup">Sign up</Link>
        </span>
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <span className="error">{error}</span>
         {!isloading ? <button type="submit" className="formBtn">
          Login
        </button> :
        <LoadingBtn />}
      </form>
    </div>
  );
};

export default Login;
