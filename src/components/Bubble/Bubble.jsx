import "./Bubble.scss";
import { auth } from "../../config/firebase";

const Bubble = (props) => {
  const { fullName, photoURL, id, message, userId, type, imageURL } =
    props.data;

  return (
    <div
      className={`bubble ${
        auth.currentUser.uid === userId ? "current-user" : ""
      }`}
    >
      <img src={photoURL} alt="img"  />
      <div className="msg">
        <p>{fullName}</p>
        {type === "text" ? <p>{message}</p> : <img src={imageURL} alt="img" className="chat-img" />}
      </div>
    </div>
  );
};

export default Bubble;
