import "./Profile.scss";
import { auth } from "../../config/firebase";
import { Button } from "@mui/material";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Profile = () => {
  const handleSignOut = async () => {
    await signOut(auth);
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  if (!user)
    return (
      <div className="profile">
        <p>loading...</p>
      </div>
    );

  return (
    <div className="profile">
      <div className="profile-left">
        <img src={user?.photoURL} alt="img" />
        <p>{user?.displayName}</p>
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
