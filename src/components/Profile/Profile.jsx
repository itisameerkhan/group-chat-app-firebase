import "./Profile.scss";
import { auth } from "../../config/firebase";
import { Button } from "@mui/material";
import { signOut } from "firebase/auth";

const Profile = () => {
  const handleSignOut = async () => {
    await signOut(auth);
  };

  console.log("auth from profile", auth.currentUser);

  return (
    <div className="profile">
      <div className="profile-left">
        <img src={auth.currentUser.photoURL} alt="img" />
        <p>{auth.currentUser.displayName}</p>
      </div>
      <div className="profile-right">
        <Button variant="contained" color="error" onClick={handleSignOut}>
          log out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
