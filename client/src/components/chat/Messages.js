import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper/apicalls";
import { getAllMessages } from "./helper/apicalls";

const Messages = ({ reciverId, reload }) => {
  const { token, user } = isAuthenticated();
  const [messagesData, setMessagesData] = useState([]);
  const [indicators, setIndicators] = useState({
    loading: "",
    error: "",
    success: "",
  });

  const { loading, error, success } = indicators;

  useEffect(() => {
    setIndicators({ ...indicators, loading: true, error: "", success: "" });
    getAllMessages(token, user._id, reciverId).then((data) => {
      if (data.error) {
        setIndicators({
          ...indicators,
          loading: false,
          error: data.error,
          success: false,
        });
      } else {
        setIndicators({
          ...indicators,
          loading: false,
          error: false,
          success: true,
        });
        setMessagesData(data);
      }
    });
  }, [reciverId]);

  useEffect(() => {
    if (reload !== 0) {
      getAllMessages(token, user._id, reciverId).then((data) => {
        if (data.error) {
          setIndicators({
            ...indicators,
            error: data.error,
            success: false,
          });
        } else {
          setIndicators({
            ...indicators,
            error: false,
            success: true,
          });
          setMessagesData(data);
        }
      });
    }
  }, [reload]);

  useEffect(() => {
    const intervel = setInterval(() => {
      getAllMessages(token, user._id, reciverId).then((data) => {
        if (data.error) {
        } else {
          console.log();
          setMessagesData(data);
        }
      });
    }, 5000);

    return () => {
      clearInterval(intervel);
    };
  }, [reciverId]);

  return (
    <div className="messagesSection">
      {loading ? (
        <div className="chatLoading">
          <i class="fas fa-yin-yang animate-spin"></i>
        </div>
      ) : messagesData.length !== 0 ? (
        messagesData.map((chat, index) => {
          return chat.sender === user._id ? (
            <div className="messageWrapper sender" key={chat}>
              <h3 className="message">{chat.message}</h3>
            </div>
          ) : (
            <div className="messageWrapper reciver" key={chat}>
              <h3 className="message">{chat.message}</h3>
            </div>
          );
        })
      ) : (
        <div className="messageWrapper">
          <h3 className="noMessages">No messages available</h3>
        </div>
      )}
    </div>
  );
};

export default React.memo(Messages);
