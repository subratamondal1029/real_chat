import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "./components";
import "./App.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authService from "./appwrite/authConfig";
import { loginData } from "./store/authSlice";
import messageService from "./appwrite/messageConfig";
import {
  setAllMessages,
  setNewConversation,
  updateMessage,
} from "./store/messageSlice";

function App() {
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);
  const [loading, setLoading] = useState(true);
  const [messageStored, setMessageStored] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const allMessages = useSelector((state) => state.message.messages);

  useEffect(() => {
    const path = location.pathname;

    if (path === "/login" || path === "/signup") {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if(messageStored){
      messageService.subscribeToRealtimeEvents(handleRealtime, userData.$id);
      setMessageStored(false)
      console.log("subscribed To Realtime Events");
    }
  },[messageStored])

  async function handleRealtime (message) {
      const messageObj = {
        messages: message.message.map((msg) => JSON.parse(msg)),
        messageId: message.$id,
        lastMessagetime: new Date(message.$updatedAt).toLocaleDateString(),
      };
 
      const isAvailable = allMessages.some((msg) => msg.messageId === messageObj.messageId);

      if(isAvailable){
        dispatch(updateMessage(messageObj));
      }else{
        const { username, fullName, imageId } = await authService.getUser(
          message.contact1,
          message.contact2,
          userData.$id
        );
        dispatch(setNewConversation({ username, fullName, ...messageObj, imageUrl: authService.getImage(imageId) }));
      }
  };

  useEffect(() => {
    initilizeAllData();

    async function initilizeAllData() {
      setLoading(true);
      try {
        let currentUserData = userData;
        if (!userData) {
          currentUserData = await authService.getCurrentUser();
        }

        if (currentUserData && allMessages.length === 0) {
          const messageResponse = await messageService.getAllConversations(
            currentUserData.$id
          );
          if (messageResponse) {
            const allConversationPromise = messageResponse.map(
              async (conversation) => {
                const {
                  username,
                  fullName,
                  imageId,
                } = await authService.getUser(
                  conversation.contact1,
                  conversation.contact2,
                  currentUserData.$id
                );

                const messageObj = {
                  username,
                  fullName,
                  messageId: conversation.$id,
                  messages: conversation.message.map((msg) => JSON.parse(msg)),
                  lastMessagetime: new Date(
                    conversation.$updatedAt
                  ).toLocaleDateString(),
                };

                if (imageId) {
                  messageObj.imageUrl = authService.getImage(imageId);
                }

                return messageObj;
              }
            );

            const data = await Promise.all(allConversationPromise);
            dispatch(loginData(currentUserData));
            dispatch(setAllMessages(data));
           setMessageStored(true)
          }
        } else if (!userData) {
          dispatch(loginData(currentUserData));
        }
        if (showHeader && location.pathname !== "/") {
          navigate(location.pathname);
        } else navigate("/");
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }
  }, [userData]);

  

  if (loading) return "Loading...";

  return (
    <>
      {showHeader && <Header />}
      <Outlet />
    </>
  );
}

export default App;
