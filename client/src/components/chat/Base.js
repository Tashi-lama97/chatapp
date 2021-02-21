import React, { useEffect, useState } from "react";
import { isAuthenticated, tryLogOut } from "../auth/helper/apicalls";
import SimpleBar from "simplebar-react";
import USERPIC from "./images/account.png";
import { getChatHistory, trySendingMessage } from "./helper/apicalls";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import ChatHistory from "./ChatHistory";
import Contacts from "./Contacts";
import AddContact from "./AddContact";
import SelectSection from "./SelectSection";
import TopBar from "./TopBar";
import Messages from "./Messages";

const Base = ({ history }) => {
  const { token, user } = isAuthenticated();

  const [chatView, setChatView] = useState(false);

  const [section, setSection] = useState("recent");

  const [messageData, setMessageData] = useState({
    reciverName: "",
    reciver: "",
    chatId: "",
    message: "",
  });

  const [dataReloader, setDataReloader] = useState(0);

  const logout = () => {
    if (window.confirm("Are you Sure You want to logout.")) {
      tryLogOut(() => {
        history.push("/");
      });
    }
  };

  const setMessgeInfo = (reciverId, reciverName, chatId = false) => {
    setMessageData({
      ...messageData,
      reciver: reciverId,
      chatId: chatId,
      reciverName: reciverName,
    });
    setChatView(true);
  };

  const changeMessage = (e) => {
    setMessageData({ ...messageData, message: e.target.value });
  };

  const changeSection = (sectionName) => {
    setSection(sectionName);
  };

  const sendingMessage = (e) => {
    e.preventDefault();
    trySendingMessage(token, user._id, messageData).then((data) => {
      if (data.error) {
        console.log(data.error);
        NotificationManager.error("Unable to send message", "Error", 5000);
      } else {
        setDataReloader(dataReloader + 1);
        if (messageData.chatId) {
          setMessageData({ ...messageData, message: "" });
        } else {
          setMessageData({ ...messageData, message: "", chatId: data.chatId });
        }
      }
    });
  };

  useEffect(() => {
    console.log(messageData);
  }, [messageData]);

  const getLeftSideView = () => {
    switch (section) {
      case "recent":
        return (
          <ChatHistory setMessgeInfo={setMessgeInfo} reload={dataReloader} />
        );
      case "contact":
        return <Contacts setMessgeInfo={setMessgeInfo} />;
      case "addContact":
        return <AddContact />;
      default:
        return (
          <ChatHistory setMessgeInfo={setMessgeInfo} reload={dataReloader} />
        );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center chatPage">
      <div className="headerSection flex justify-center items-center">
        <div className="flex-1 flex justify-center pb-4 items-center text-2xl">
          <i className="fas fa-comment-alt iconMain"></i>
          <h3 className="pl-3 headingMain">WeMessage</h3>
        </div>
        <div className="flex-1 flex justify-center pb-4 items-center">
          <button className="logoutButton shadow-xl" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <div className="chatWrapper rounded">
        <div className="chathistory shadow-xl">
          <SelectSection
            changeSection={changeSection}
            section={section}
            reload={dataReloader}
          />
          {getLeftSideView()}
        </div>

        <div className="chats">
          {chatView ? (
            <>
              <div className="chatTopBar">
                <TopBar name={messageData.reciverName} />
              </div>
              <div className="chatMessages">
                <Messages
                  reciverId={messageData.reciver}
                  reload={dataReloader}
                />
              </div>
              <div className="messageInputSection">
                <div className="messageInputWrapper">
                  <textarea
                    placeholder="Type Message"
                    className="messageInput"
                    value={messageData.message}
                    onChange={changeMessage}
                  ></textarea>
                </div>
                <div className="messageSendButtonWrapper">
                  <button
                    className="messageSendButton shadow-xl"
                    onClick={sendingMessage}
                  >
                    <i className="far fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="noChatSelected">
              <div className="iconAndTitleContainer">
                <div className="emptyBoxIcon">
                  <i className="fas fa-inbox"></i>
                </div>
                <div className="noChatSelectedText">No chat Selected</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default Base;
