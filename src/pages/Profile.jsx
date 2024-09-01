import { useRef, useState } from "react";
import "../Css/Profile.css";
import { useDispatch, useSelector } from "react-redux";
import avaterImage from "../assets/images/userAvter.png";
import { AtSign, ImageUp, Mail, SquareUserRound } from "lucide-react";
import authService from "../appwrite/authConfig";
import { Input, LoadingBtn, ProfileDetail } from "../components";
import { loginData } from "../store/authSlice";

const Profile = () => {
  const userData = useSelector((state) => state.auth.userData);
  const resizerConRef = useRef(null);
  const [updating, setUpdating] = useState({
    isUpdating: false,
    updateValue: "",
    updateField: "",
  });
  const [sending, setSending] = useState(false);
  const [passwordVal, setPasswordVal] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const resize = (e) => {
    const startX = e.clientX;
    const startWidth = resizerConRef.current.clientWidth;

    window.addEventListener("mousemove", resizer);
    function resizer(e) {
      const currentX = e.clientX;
      const totalX = currentX - startX;
      resizerConRef.current.style.width = `${startWidth + totalX}px`;
    }

    window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", resizer);
    });
  };

  const openPopup = (name) => {
    setUpdating((prev) => ({
      updateField: name,
      updateValue: userData[name],
      isUpdating: true,
    }));
    window.addEventListener("keyup", closePopup);
  };

  const closePopup = (e) => {
    if (e.target.className.includes("popupOverlay") || e.key === "Escape") {
      setError("");
      setUpdating({ updateField: "", updateValue: "", isUpdating: false });
      window.removeEventListener("keyup", closePopup);
    }
  };

  const validate = async (updateField, updateValue) => {
    updateField = updateField.trim();
    updateValue = updateValue.trim();

    if (!passwordVal && updateField === "email") {
      throw new Error("Please enter password").message;
    }

    if (updateValue === "" || updateValue === userData[updateField]) {
      throw new Error("Nothing to update").message;
    }

    if (updateField === "email") {
      const emailValPattern =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailValPattern.test(updateValue)) {
        throw new Error("Invalid Email").message;
      } else {
        if (passwordVal.trim().length >= 8) {
          setError("");
          return await authService.updateEmail(updateValue, passwordVal.trim());
        } else throw new Error("Password must be at least 8 characters").message;
      }
    }

    if (updateField === "fullName") {
      setError("");
      return await authService.updateName(updateValue);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    const { updateField, updateValue } = updating;
    setSending(true);
    try {
      const updated = await validate(updateField, updateValue);
      if (updated) {
        console.log(updated);
        setUpdating({ updateField: "", updateValue: "", isUpdating: false });
        dispatch(loginData(updated));
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }
    setSending(false);
  };

  return (
    <div className="profileContainer" ref={resizerConRef}>
      <div className="profileImage">
        <img src={avaterImage} alt="Profile Picture" />
        <ImageUp size={20} className="editBtn" />
      </div>
      <ProfileDetail
        editValue={userData.fullName}
        classname="name"
        Icon={SquareUserRound}
        name="fullName"
        startEdit={openPopup}
      />
      <div className="profileDetail">
        <span className="detail">
          <AtSign size={20} />
          {userData.username}
        </span>
      </div>
      <ProfileDetail
        editValue={userData.email}
        classname="email"
        Icon={Mail}
        name="email"
        startEdit={openPopup}
      />

      {/* Profile Con Reziser */}
      {updating.isUpdating && (
        <div className="popupOverlay" onClick={closePopup}>
          <form className="popup" onSubmit={handleChange}>
            <Input
              label={`New ${
                updating.updateField === "fullName"
                  ? "Name"
                  : updating.updateField
              }`}
              value={updating.updateValue}
              onChange={(e) =>
                setUpdating((prev) => ({
                  ...prev,
                  updateValue: e.target.value,
                }))
              }
              type={updating.updateField === "email" ? "email" : "text"}
            />
            {updating.updateField === "email" && (
              <Input
                label={"Password"}
                type="password"
                value={passwordVal}
                onChange={(e) => setPasswordVal(e.target.value)}
                required
              />
            )}
            {error && <p className="error">{error}</p>}
            {sending ? (
              <LoadingBtn />
            ) : (
              <button type="submit" className="formBtn">
                Save
              </button>
            )}
          </form>
        </div>
      )}
      <div id="profileConReziser" onMouseDown={resize}></div>
    </div>
  );
};

export default Profile;
