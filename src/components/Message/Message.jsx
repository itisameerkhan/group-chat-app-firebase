import { useState } from "react";
import "./Message.scss";
import { db, auth } from "../../config/firebase";
import {
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

const Message = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const docRef = doc(db, "messages", Date.now().toString());
    await setDoc(docRef, {
      fullName: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
      userId: auth.currentUser.uid,
      message: message,
      timestamp: serverTimestamp(),
    });
    setMessage("");
  };

  return (
    <div className="message">
      <div className="message-main">
        <input
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button onClick={handleSubmit}>send</button>
      </div>
    </div>
  );
};

export default Message;
