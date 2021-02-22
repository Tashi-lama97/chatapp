import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../auth/helper/apicalls";
import SimpleBar from "simplebar-react";
import USERPIC from "./images/account.png";
import { getChatHistory } from "./helper/apicalls";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const ChatHistory = ({ setMessgeInfo, reload }) => {
  const { token, user } = isAuthenticated();
  const [chatHistory, setChatHistory] = useState([]);

  const [historyIndicators, setHistoryIndicators] = useState({
    historyLoading: "",
    historySuccess: "",
    historyError: "",
  });

  const { historyLoading, historySuccess, historyError } = historyIndicators;

  useEffect(() => {
    setHistoryIndicators({
      ...historyIndicators,
      historyLoading: true,
      historySuccess: "",
      historyError: "",
    });
    getChatHistory(token, user._id).then((data) => {
      if (data.error) {
        setHistoryIndicators({
          ...historyIndicators,
          historyLoading: false,
          historySuccess: false,
          historyError: data.error,
        });
        NotificationManager.error(data.error, "Error", 10000);
      } else {
        setHistoryIndicators({
          ...historyIndicators,
          historyLoading: false,
          historySuccess: true,
          historyError: false,
        });
        setChatHistory(data);
      }
    });
  }, []);

  useEffect(() => {
    if (reload !== 0) {
      getChatHistory(token, user._id).then((data) => {
        if (data.error) {
          setHistoryIndicators({
            ...historyIndicators,
            historySuccess: false,
            historyError: data.error,
          });
          NotificationManager.error(data.error, "Error", 10000);
        } else {
          setChatHistory(data);
        }
      });
    }
  }, [reload]);

  useEffect(() => {
    const intervel = setInterval(() => {
      getChatHistory(token, user._id).then((data) => {
        if (data.error) {
          NotificationManager.error(data.error, "Error", 10000);
        } else {
          setChatHistory(data);
        }
      });
    }, 5000);
    return () => {
      clearInterval(intervel);
    };
  }, []);

  return (
    <>
      <div className="title flex bg-gray-100 flex-col">
        <h3 className="titleText">Recent</h3>
        <h3 className="titleText">Chats</h3>
      </div>
      <div className="chatHistoryWrapper ">
        <SimpleBar style={{ maxHeight: 420 }}>
          {historyLoading ? (
            <div className="chatHistoryMessageWrapper animate-pulse">
              <div className="userIcon">
                <div class="rounded-full bg-blue-400 h-12 w-12"></div>
              </div>
              <div className="userData space-y-2">
                <div class="h-4 bg-blue-400 rounded"></div>
                <div class="h-4 bg-blue-400 rounded w-5/6"></div>
              </div>
            </div>
          ) : chatHistory.length !== 0 && typeof chatHistory == "object" ? (
            chatHistory.map((chat, index) => {
              return (
                <div
                  onClick={() => {
                    const reciverId =
                      chat.reciver == user._id ? chat.sender : chat.reciver;
                    const reciverName =
                      chat.reciver == user._id
                        ? chat.senderInfo[0].name
                        : chat.reciverInfo[0].name;

                    setMessgeInfo(reciverId, reciverName, chat._id.chatId);
                  }}
                  className="chatHistoryMessageWrapper"
                  key={chat}
                >
                  <div className="userIcon">
                    <img src={USERPIC} alt="demoPic" className="userPic" />
                  </div>
                  <div className="userData">
                    <h3 className="chatName">
                      {chat.reciver == user._id
                        ? chat.senderInfo[0].name
                        : chat.reciverInfo[0].name}
                    </h3>
                    <h6 className="chatLastMessage">{chat.message}</h6>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="chatHistoryMessageWrapper">
              <h3>No chats</h3>
            </div>
          )}
        </SimpleBar>
      </div>
      <NotificationContainer />
    </>
  );
};

export default React.memo(ChatHistory);
