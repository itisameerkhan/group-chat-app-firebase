import Chat from "../../components/Chat/Chat";
import Message from "../../components/Message/Message";
import Profile from "../../components/Profile/Profile";
import "./Home.scss";

const Home = () => {
  return (
    <div className="home-main">
      <div className="home">
        <Profile />
        <Chat />
        <Message />
      </div>
    </div>
  );
};

export default Home;
