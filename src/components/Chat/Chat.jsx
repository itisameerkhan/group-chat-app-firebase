import { useEffect, useState } from "react";
import "./Chat.scss";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import Bubble from "../Bubble/Bubble";
import { Box, CircularProgress } from "@mui/material";

const Chat = () => {
  const [messages, setMessages] = useState([]);

  const getData = async () => {
    const collectionRef = collection(db, "messages");
    const response = await getDocs(collectionRef);
    const filteredData = response.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setMessages(filteredData);
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "messages"), (doc) => {
      const filtereData = doc.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(filtereData);
    });

    return () => {
      unsub();
    };
  }, []);

  if (messages.length === 0)
    return (
      <div className="chat-main">
        <Box sx={{ display: "flex" }}>
          <CircularProgress size={80} />
        </Box>
        <p>Loading...</p>
      </div>
    );
  return (
    <div className="chat">
      <div className="chat-inner">
        {messages.map((data) => (
          <Bubble key={data.id} data={data} />
        ))}
      </div>
    </div>
  );
};

export default Chat;
