import { Link, useNavigate } from "react-router-dom";
import { Input, LoadingBtn } from "../components";
import "../Css/Login.css";
import { useEffect, useState } from "react";
import authService from "../appwrite/authConfig";
import { useDispatch, useSelector } from "react-redux";
import { loginData } from "../store/authSlice";

const initialValues = {
  fullName: "",
  username: "",
  email: "",
  password: "",
};
const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const isLogin = useSelector((state) => state.auth.isLogin);
  const [formData, setFormData] = useState(initialValues);

  useEffect(() =>{
    if (isLogin) {
      navigate("/")
    }
  },[])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateConditaions = {
    email: {
      required: true,
      pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
      message: "Please enter a valid email address",
    },
    password: {
      minLength: 6,
      required: true,
      message: "Password must be at least 6 characters long",
    },
    fullName: {
      required: true,
      message: "Please enter a name",
    },
    username: {
      required: true,
      message: "Please enter an username",
    },
  };

  const validate = () => {
    let isValid = true;
    for (const key in validateConditaions) {
      const data = formData[key];
      const rule = validateConditaions[key];

      if (rule.required && !data) {
        setError(rule.message);
        isValid = false;
      }

      if (rule.pattern && !rule.pattern.test(data)) {
        setError(rule.message);
        isValid = false;
      }

      if (rule.minLength && data.length < rule.minLength) {
        setError(rule.message);
        isValid = false;
      }
    }
    return isValid;
  };

  const handleSignUp = async (e) => {
    setIsloading(true);
    e.preventDefault();
    if (validate()) {
      setError("");

      try {
        const userData = await authService.signupWithEmail(formData);
        if (userData) {
          setFormData(initialValues);
          console.log(userData);
          
          dispatch(loginData(userData));
          navigate("/");
        }
      } catch (error) {
        setError(error);
      }
    }
    setIsloading(false);
  };

  return (
    <div className="LoginContainer">
      <form className="login" onSubmit={handleSignUp}>
        <h2>Sign Up</h2>
        <span>
          Already have an account <Link to="/login">Sign in</Link>
        </span>
        <Input
          label="Full Name"
          name="fullName"
          onChange={handleChange}
          value={formData.fullName}
        />
        <Input
          label="username"
          name="username"
          onChange={handleChange}
          value={formData.username}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          onChange={handleChange}
          value={formData.email}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          onChange={handleChange}
          value={formData.password}
        />
        <span className="error">{error}</span>
        {!isloading ? (
          <button type="submit" className="formBtn">
            Sign Up
          </button>
        ) : (
          <LoadingBtn />
        )}
      </form>
    </div>
  );
};

export default SignUp;
