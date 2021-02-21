import axios from "axios";

export const getChatHistory = (token, userId) => {
  return axios
    .get(`/api/chat/history/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const getContactList = (token, userId) => {
  return axios
    .get(`/api/get/all/contacts/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};
export const searchForContact = (token, userId, email) => {
  return axios
    .post(
      `/api/search/user/${userId}`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const addToContact = (token, userId, contactId) => {
  return axios
    .post(
      `/api/contact/add/${userId}`,
      { contactId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const getAllMessages = (token, userId, reciverId) => {
  return axios
    .get(`/api/chat/all/${userId}/${reciverId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const trySendingMessage = (token, userId, data) => {
  return axios
    .post(`/api/message/send/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};
