import { ArrowLeft, Link, Search, Send, X } from "lucide-react";
import avterLogo from "../assets/images/userAvter.png";
import "../Css/home.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import authService from "../appwrite/authConfig";
import messageService from "../appwrite/messageConfig";
import { ContactCard } from "../components";
import { setNewConversation, updateMessage } from "../store/messageSlice";

const Home = () => {
  const { messages: allMessages } = useSelector((state) => state.message);
  const { userData: currentUser } = useSelector((state) => state.auth);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [searchUser, setSearchUser] = useState(null);
  const [message, setMessage] = useState("");
  const [searchUsername, setSearchUsername] = useState("");

  const dispath = useDispatch();

  const searchContact = async () => {
    if (searchUsername === "" || searchUsername === currentUser.username) {
      setSearchUsername("");
      console.log("Enter a valid username");
      return;
    }

    try {
      const userDetails = await authService.getUserData(searchUsername);
      if (userDetails) {
        setSearchUser(userDetails);
      }
    } catch (error) {
      if (error.code === 404) {
        alert("User not found");
      }
    }
  };

  const addContact = (searchUser) => {
    const messageObj = {
      username: searchUser.username,
      fullName: searchUser.fullName,
      messages: [],
    };
    setCurrentMessage(messageObj); 
    setSearchUser(null);
    setSearchUsername("");
  };

  const sendMessage = async () => {
    if (message === "") {
      alert("Enter a message");
      return;
    }

    const newMessage = {
      ...currentMessage,
      messages: [
        ...currentMessage.messages,
        {
          text: message.trim(),
          senderId: currentUser.username,
          recieverId: currentMessage.username,
        },
      ],
    };

    try {
      if (!currentMessage.lastMessagetime) {
        const response = await messageService.sendMessage(
          {message: newMessage.messages},
          "create",
          currentUser.username,
          newMessage.username
        );
        if (response) {
          newMessage.messageId = response.$id;
          newMessage.lastMessagetime = new Date(
            response.$updatedAt
          ).toLocaleDateString();
          setCurrentMessage(newMessage); 
          dispath(setNewConversation(newMessage));
          setMessage("");
        }

        return;
      }

      const response = await messageService.sendMessage({message: newMessage.messages, messageId: newMessage.messageId}, "update", currentUser.username, newMessage.username);
      if (response) {
        newMessage.lastMessagetime = new Date(
          response.$updatedAt
        ).toLocaleDateString();
        setCurrentMessage(newMessage);
        dispath(
          updateMessage({
            messageId: newMessage.messageId,
            messages: newMessage.messages,
            lastMessagetime: newMessage.lastMessagetime,
          })
        );
        setMessage("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setCurrentMessage((prev) => {
      return allMessages.find((message) => message.messageId === prev?.messageId) || prev
    })
  },[allMessages, currentMessage])

  return (
    <div id="mainContainer">
      <div id="contactSection">
        <form
          id="searchField"
          onSubmit={(e) => {
            e.preventDefault();
            searchUser
              ? (setSearchUser(null), setSearchUsername(""))
              : searchContact();
          }}
        >
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchUsername(e.target.value)}
            value={searchUsername}
          />
          <button type="submit">
            {searchUser ? <X size={20} /> : <Search size={20} />}
          </button>
        </form>
        <div className="contactList">
          {searchUser ? (
            <ContactCard
              data={searchUser}
              avterLogo={searchUser && avterLogo}
              onClick={() => addContact(searchUser)}
            />
          ) : (
            allMessages.map((message, i) => (
              <ContactCard
                avterLogo={avterLogo}
                data={message}
                onClick={() => setCurrentMessage(message)}
                key={message.username}
              />
            ))
          )}
        </div>
      </div>
      {currentMessage && (
        <div id="messageCon">
          <div className="messageHeader">
            <ArrowLeft
              size={20}
              className="headerBackBtn"
              onClick={() => setCurrentMessage(null)}
            />
            <div className="recieverName">
              {currentMessage.fullName} <br /> @{currentMessage.username}
            </div>
            <div className="lastMessageTime">
              Last Message: {currentMessage?.lastMessagetime}
            </div>
          </div>
          <div className="conversetionCon">
            {currentMessage.messages.map((message) => (
              <div
                className={`messageHold ${
                  message.senderId === currentUser.username
                    ? "ownMes"
                    : "othersMes"
                }`}
                key={crypto.randomUUID()}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="messageField">
            <textarea
              placeholder="Enter Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength="999"
            ></textarea>
            <button onClick={sendMessage}>
              <Send size={20} />
            </button>

            <div className="wordCount">{message.length}/999</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
