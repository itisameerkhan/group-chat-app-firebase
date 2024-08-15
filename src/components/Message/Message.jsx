import { useState } from "react";
import "./Message.scss";
import { db, auth, storage } from "../../config/firebase";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Message = () => {
  const [message, setMessage] = useState("");
  const [imgFile, setImgFile] = useState(null);

  const handleSubmit = async () => {
    if (imgFile) {
      const imgRef = ref(storage, uuidv4().toString());
      await uploadBytes(imgRef, imgFile);
      const imgURL = await getDownloadURL(imgRef);

      setImgFile(null);

      const docRef = doc(db, "messages", Date.now().toString());
      await setDoc(docRef, {
        fullName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        userId: auth.currentUser.uid,
        message: null,
        timestamp: serverTimestamp(),
        type: "image",
        imageURL: imgURL,
      });
    }
    if (message === "") return;

    const docRef = doc(db, "messages", Date.now().toString());
    await setDoc(docRef, {
      fullName: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
      userId: auth.currentUser.uid,
      message: message,
      timestamp: serverTimestamp(),
      type: "text",
      imgURL: null,
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
          accept="image/png, image/jpg, image/jpeg"
        />
        <label
          htmlFor="attachment"
          className={`attach-file ${imgFile ? "active" : "inactive"}`}
        >
          <span className="material-symbols-outlined">attachment</span>
        </label>
        <input
          type="file"
          id="attachment"
          onChange={(e) => setImgFile(e.target.files[0])}
        />
        <button onClick={handleSubmit}>send</button>
      </div>
    </div>
  );
};

export default Message;
