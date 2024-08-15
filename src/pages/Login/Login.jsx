import "./Login.scss";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  Box,
} from "@mui/material";
import { useState } from "react";
import { auth, googleAuth, storage } from "../../config/firebase.js";
import {
  createUserWithEmailAndPassword,
  AuthErrorCodes,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Login = () => {
  const [loginState, setLoginState] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [passStatus, setPassStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [formError, setFormError] = useState({
    fullName: {
      error: false,
      errorMessage: "",
    },
    email: {
      error: false,
      errorMessage: "",
    },
    password: {
      error: false,
      errorMessage: "",
    },
  });

  const handleChange = (e) => {
    setFormError({
      fullName: {
        error: false,
        errorMessage: "",
      },
      email: {
        error: false,
        errorMessage: "",
      },
      password: {
        error: false,
        errorMessage: "",
      },
    });

    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateUser = async () => {
    const imgRef = ref(storage, uuidv4());
    await uploadBytes(imgRef, imgFile);
    const downloadURL = await getDownloadURL(imgRef);

    await updateProfile(auth.currentUser, {
      displayName: userData.fullName,
      photoURL: downloadURL,
    });
    navigate("/home");
  };

  const handleSubmit = async () => {
    setLoadingStatus(true);
    console.log(userData);
    if (userData.fullName === "" && !loginState) {
      setFormError({
        ...formError,
        fullName: {
          error: true,
          errorMessage: "This field required",
        },
      });
      setLoadingStatus(false);
      return;
    }
    if (userData.email === "") {
      setFormError({
        ...formError,
        email: {
          error: true,
          errorMessage: "This field required",
        },
      });
      setLoadingStatus(false);

      return;
    }
    if (userData.password === "") {
      setFormError({
        ...formError,
        password: {
          error: true,
          errorMessage: "This field required",
        },
      });
      setLoadingStatus(false);

      return;
    }

    try {
      if (loginState) {
        console.log("login function");
        await signInWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        navigate("/home");
      } else {
        await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        console.log("current user: ", auth.currentUser);
        handleUpdateUser();
      }
    } catch (error) {
      setLoadingStatus(false);

      console.log(error);
      if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
        setFormError({
          ...formError,
          email: {
            error: true,
            errorMessage: "Email Already Exists",
          },
        });
        return;
      }
      if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
        setFormError({
          ...formError,
          password: {
            error: true,
            errorMessage: "Password should atleast 6 character long",
          },
        });
        return;
      }
      if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
        setFormError({
          ...formError,
          password: {
            error: true,
            errorMessage: "Invalid password",
          },
        });
        return;
      }
    }
  };

  const handleGoogleSubmit = async () => {
    console.log("google sign in function");
    try {
      await signInWithPopup(auth, googleAuth);
      navigate("/home");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="login-main">
      {loadingStatus && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <div className="login">
        <h1>{loginState === true ? "Login" : "Sign up"}</h1>
        {!loginState && (
          <TextField
            id="outlined-basic"
            name="fullName"
            label="Full Name"
            variant="outlined"
            onChange={handleChange}
            error={formError.fullName.error}
            helperText={formError.fullName.errorMessage}
          />
        )}
        <TextField
          id="outlined-basic"
          label="Email Address"
          variant="outlined"
          name="email"
          onChange={handleChange}
          type="email"
          error={formError.email.error}
          helperText={formError.email.errorMessage}
        />
        <TextField
          id="outlined-basic"
          name="password"
          label="Password"
          onChange={handleChange}
          variant="outlined"
          type={passStatus ? "text" : "password"}
          error={formError.password.error}
          helperText={formError.password.errorMessage}
        />
        <FormControlLabel
          className="form-control"
          control={
            <Checkbox
              checked={passStatus}
              onClick={() => setPassStatus(!passStatus)}
            />
          }
          label={passStatus ? "Hide Password" : "Show password"}
        />
        <label htmlFor="displayImage" className="img-label">
          {imgFile ? (
            imgFile.name
          ) : (
            <p className="label-img">
              <span className="material-symbols-outlined">cloud_upload</span>
              UPLOAD IMAGE
            </p>
          )}
        </label>
        <input
          type="file"
          id="displayImage"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => setImgFile(e.target.files[0])}
        />
        <p className="already-btn" onClick={() => setLoginState(!loginState)}>
          {loginState === false
            ? "Already having an account? login"
            : "Don't have account? signup"}
        </p>
        <Button variant="contained" onClick={handleSubmit}>
          SUBMIT
        </Button>
        <button id="google-btn" onClick={handleGoogleSubmit}>
          <img
            src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-pks9lbdv.png"
            alt="google-icon"
          />
          sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
