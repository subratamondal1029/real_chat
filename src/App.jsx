import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "./components";
import "./App.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authService from "./appwrite/authConfig";
import { loginData } from "./store/authSlice";
import messageService from "./appwrite/messageConfig";
import { setAllMessages, setNewConversation, updateMessage } from "./store/messageSlice";

function App() {
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const {messages: allMessages} = useSelector((state) => state.message);

  useEffect(() => {
    const path = location.pathname;

    if (path === "/login" || path === "/signup") {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, [location.pathname]);

  const handleRealtime = async (message) => {
    const messageObj = {
      messages: message.message.map((msg) => JSON.parse(msg)),
      messageId: message.$id,
      lastMessagetime: new Date(message.$updatedAt).toLocaleDateString(),
    };

    const isAvailable = allMessages.some((msg) => msg.messageId === message.$id);
    if (!isAvailable) {
      dispatch(updateMessage(messageObj));
    }else{
      const {userId: username, fullName} = await getUser(message.contact1, message.contact2, userData.$id);
      dispatch(setNewConversation({username, fullName, ...messageObj}));
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

        if (currentUserData) {
          dispatch(loginData(currentUserData));
          navigate("/");

          const messageResponse = await messageService.getAllConversations(
            currentUserData.$id
          );
          if (messageResponse) {
            const allConversationPromise = messageResponse.map(
              async (conversation) => {
                const { userId: username, fullName } = await getUser(
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

                return messageObj;
              }
            );

            const data = await Promise.all(allConversationPromise);
            dispatch(setAllMessages(data));

            messageService.subscribeToRealtimeEvents(handleRealtime, currentUserData.$id);
          } else throw new Error("Something went wrong with message response");
        } else throw new Error("Something went wrong with current user data");
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }
  }, [userData]);

  async function getUser(contact1, contact2, currentUserId) {
    let userId;
    if (contact1 !== currentUserId) {
      userId = contact1;
    } else if (contact2 !== currentUserId) {
      userId = contact2;
    }

    try {
      const otherUserData = await authService.getUserData(userId);
      return { userId, fullName: otherUserData.fullName };
    } catch (error) {
      throw error;
    }
  }

  if (loading) return "Loading...";

  return (
    <>
      {showHeader && <Header />}
      <Outlet />
    </>
  );
}

export default App;
