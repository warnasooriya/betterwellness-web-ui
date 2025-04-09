import React, { useState, useRef, useEffect } from "react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import { FaCircle, FaComments, FaMinus, FaPaperPlane, FaSearch } from "react-icons/fa";
import "./Chat.css";
import createSocket from './socket';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import config from "../api/config";
import socket from "./socket";
import {  setMessages,setMessageRed } from '../reducers/messageReducer'
import { useDispatch, useSelector } from 'react-redux'
const Chat = () => {

 
  const axios = useAxiosPrivate();

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const chatEndRef = useRef(null);
  const [userSelectionAreaShown, setUserSelectionAreaShown] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

    const messageCount = useSelector(state => state.messageReducer.unreadCount)
    const dispatch = useDispatch()

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${config.userServiceBaseUrl}/user/users`);
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    socket.on("message", (data) => {
      console.log("Message received:", data);
       dispatch(setMessageRed(data));
      setMessages((prevMessages) => ({
        ...prevMessages,
        [data.sender]: [...(prevMessages[data.sender] || []), data],
      }));
      // setMessage(data);
    });

    return () => {
      socket.off("message");
    };
    
  }, []);
 
  
  const sendMessage = () => {
    if (input.trim() !== "" && selectedUser) {
      const message = { text: input, sender: localStorage.getItem('userId'), receiver: selectedUser };
      socket.emit("message", message);

      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedUser._id]: [...(prevMessages[selectedUser._id] || []), message],
      }));
      setInput("");
    }
  };

  useEffect(() => {
    setFilteredUsers(users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery, users]);

  useEffect(() => {
    if (isOpen && selectedUser) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, selectedUser]);

  const getAvatar = (name) => name.charAt(0).toUpperCase();

  const handleUserSelection = (user) => {
    console.log("Selected user:", user);
    setSelectedUser(user);
    setUserSelectionAreaShown(false);
  };

  return (
    <div className="chat-container">
      {!isOpen ? (
        <div className="chat-minimized" onClick={() => setIsOpen(true)}>
          <FaComments size={24} /> {messageCount}
        </div>
      ) : (
        <Card className="chat-card">
          {userSelectionAreaShown && (
            <div className="user-selection-area">
              <div className="chat-search-container">
                <InputGroup className="chat-search">
                  <InputGroup.Text><FaSearch /></InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
              </div>

              <div className="chat-user-selection">
                <div className="user-scroll-container">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        className={`user-icon ${selectedUser?._id === user._id ? "selected" : ""}`}
                        onClick={() => handleUserSelection(user)}
                      >
                        <div className="chat-avatar">{getAvatar(user.name)}</div>
                        <div className="user-name">{user.name}</div>
                        <FaCircle className="user-status" />
                        <div className="user-type">
                          {user.type}
                          {user.type === "Counsellor" && user.specialization && (
                            <span className="user-specialization">{user.specialization}</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-users-found">No users found</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="chat-main">
            <Card.Header className="chat-header">
              {selectedUser ? `Chat with ${selectedUser.name}` : "Select a user"}
              <div className="chat-icons-container">
                <FaSearch onClick={() => setUserSelectionAreaShown(!userSelectionAreaShown)} className="chat-icon" />
                <FaMinus onClick={() => setIsOpen(false)} className="chat-icon" />
              </div>
            </Card.Header>

            <Card.Body className="chat-body">
              {selectedUser ? (
                (messages[selectedUser._id] || []).map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.sender === localStorage.getItem('userId') ? "user" : "bot"}`}>
                    <span className="chat-text">{msg.text}</span>
                  </div>
                ))
              ) : (
                <p className="text-center">Select a user to start chatting</p>
              )}
              <div ref={chatEndRef} />
            </Card.Body>

            {selectedUser && (
              <Card.Footer className="chat-footer">
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button className="chat-send-button" onClick={sendMessage}>
                  <FaPaperPlane />
                </Button>
              </Card.Footer>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Chat;
