import React, { createContext, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import socket from "./socket";
import { setMessageRed } from "../reducers/messageReducer";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Listening for messages...");
    socket.on("message", (data) => {
      console.log("Received message:", data);
      if (data && data.sender && data.text) {
        dispatch(setMessageRed(data));
      } else {
        console.error("Received malformed message:", data);
      }
    });
  
    return () => {
      console.log("Stopping message listener");
      socket.off("message");
    };
  }, [dispatch]);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  return useContext(SocketContext);
};
