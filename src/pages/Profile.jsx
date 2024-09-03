import { useEffect, useRef, useState } from "react";
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
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(userData?.imageUrl || avaterImage);
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [updating, setUpdating] = useState({
    isUpdating: false,
    updateValue: "",
    updateField: "",
    type: "text",
  });
  const [sending, setSending] = useState(false);
  const [passwordVal, setPasswordVal] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if(userData.imageId && !userData.imageUrl) {
      getProfileImage(userData.imageId);
    }
  },[])

  function getProfileImage(imageId) {
    console.log("Get profile image");
    const profileImage = authService.getImage(imageId, {w: 300, h: 300})
    setImageUrl(profileImage)
    dispatch(loginData({ ...userData, imageUrl: profileImage }));
  }

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
    setUpdating(() => ({
      updateField: name,
      updateValue: userData[name],
      isUpdating: true,
      type: name === "email" ? "email" : "text",
    }));

    window.addEventListener("keyup", closePopup);
  };

  const closePopup = (e) => {
    if (e.target.className.includes("popupOverlay") || e.key === "Escape") {
      setError("");
      setUpdating({
        updateField: "",
        updateValue: "",
        type: "text",
        isUpdating: false,
      });
      setPasswordVal("");
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
        } else
          throw new Error("Password must be at least 8 characters").message;
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
        setUpdating({
          updateField: "",
          updateValue: "",
          type: "text",
          isUpdating: false,
        });
        dispatch(loginData(updated));
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }
    setSending(false);
  };

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) {
        throw new Error("Please select an image").message;
      }
      const extaintion = file.name.split(".")[1];
      if (
        extaintion !== "jpg" &&
        extaintion !== "jpeg" &&
        extaintion !== "png"
      ) {
        throw new Error("Please select only jpg, jpeg and png image").message;
      }

      const size = file.size / 1024 / 1024;
      if (size > 5) {
        throw new Error("Please select image less than 5MB").message;
      }

      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);
    } catch (error) {
      console.error(error); // TODO: Display error message
    }
  };

  const uploadImage = async () => {
    setIsUploading(true);
    try {
      const file = inputRef.current.files[0];
      const updateData = await authService.updateImage(
        userData.imageId,
        userData.$id,
        file,
        "create"
      );
      dispatch(loginData(updateData));
      getProfileImage(updateData.imageId);
      setImagePreview(null);
      inputRef.current.value = "";
    } catch (error) {
      console.error(error);
    }
    setIsUploading(false);
  };

  return (
    <div className="profileContainer" ref={resizerConRef}>
      <div className="profileImage">
        <img src={imageUrl} alt="Profile Picture" />
        <label htmlFor="profilePhoto">
          <ImageUp size={20} className="editBtn" />
        </label>
        <input
          type="file"
          id="profilePhoto"
          accept="image/*"
          ref={inputRef}
          onChange={handleImageChange}
          style={{
            position: "absolute",
            zIndex: -1,
            opacity: 0,
          }}
        />
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

      {updating.isUpdating && (
        <div className="popupOverlay" onClick={closePopup}>
          <form className="popup" onSubmit={handleChange}>
            <Input
              label={`New ${
                updating?.updateField === "fullName"
                  ? "Name"
                  : updating?.updateField
              }`}
              value={updating?.updateValue}
              onChange={(e) => {
                setUpdating((prev) => ({
                  ...prev,
                  updateValue: e.target.value,
                }));
              }}
              type={updating.type}
            />
            {updating?.updateField === "email" && (
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

      {imagePreview && (
        <div
          className="popupOverlay"
          id="imagePreview"
          onClick={(e) => {
            if (e.target.id === "imagePreview") {
              setImagePreview(null);
              inputRef.current.value = "";
            }
          }}
        >
          <img src={imagePreview} alt="Preview" />
          <div>
            <button
              onClick={() => {
                setImagePreview(null);
                inputRef.current.value = "";
              }}
            >
              Cancel
            </button>
            {isUploading ? (
              <LoadingBtn />
            ) : (
              <button onClick={uploadImage}>upload</button>
            )}
          </div>
        </div>
      )}

      {/* Profile Con Reziser */}
      <div id="profileConReziser" onMouseDown={resize}></div>
    </div>
  );
};

export default Profile;
