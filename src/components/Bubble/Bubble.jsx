import "./Bubble.scss";
import { auth } from "../../config/firebase";

const Bubble = (props) => {

  const { fullName, photoURL, id, message, userId } = props.data;

  return (
    <div
      className={`bubble ${
        auth.currentUser.uid === userId ? "current-user" : ""
      }`}
    >
      <img src={photoURL} alt="img" />
      <div className="msg">
        <p>{fullName}</p>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Bubble;
