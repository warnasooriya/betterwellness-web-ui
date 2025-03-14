import React, { useState, useRef, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CImage,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from "@coreui/react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import {
  FaCircle,
  FaComments,
  FaMinus,
  FaPaperPlane,
  FaSearch,
} from "react-icons/fa";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import config from "../api/config";
import socket from "./socket";
import { setLocalMsgs, setMessagesRed } from "../reducers/messageReducer";
import { useDispatch, useSelector } from "react-redux";
import "./Message.css";
const Messages = () => {
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

  const messagereducer = useSelector((state) => state.messageReducer);
  const dispatch = useDispatch();

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${config.userServiceBaseUrl}/api/users`
      );
      setUsers(data);
      setFilteredUsers(data);
      handleUserSelection(data[0]);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
 
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "" && selectedUser) {
      const message = {
        text: input,
        sender: localStorage.getItem("userId"),
        receiver: selectedUser,
      };
      socket.emit("message", message);
      dispatch(setLocalMsgs(message));
      console.log("Sent message:", messages);

      setInput("");
    }
  };

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, users]);

  useEffect(() => {
    if (isOpen && selectedUser) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, selectedUser]);

  const getAvatar = (name) => name.charAt(0).toUpperCase();

  const loadMesageHistory = async (userId) => {
    try {
      const { data } = await axios.get(
        `${config.messagingServiceBaseUrl}/api/messages/${localStorage.getItem("userId")}/${userId}`
      );
      console.log("Message history:", data);
      dispatch(setMessagesRed(data));
 

    } catch (error) {
      console.error("Error fetching message history", error);
    }
  };

  const handleUserSelection = (user) => {
    console.log("Selected user:", user);
    setSelectedUser(user);
    setUserSelectionAreaShown(false);
    loadMesageHistory(user.cognito_id);
  };

  return (
    <CRow>
      <CCard>
        <CCardHeader>Messages</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={4}>
             
                    <CCard>
                      <CCardBody>
                        <CRow>
                          <div className="chat-search-container">
                            <InputGroup className="chat-search">
                              <InputGroup.Text>
                                <FaSearch />
                              </InputGroup.Text>
                              <Form.Control
                                type="text"
                                name="search"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </InputGroup>
                          </div>
                        </CRow>
                        <p></p>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <>
                              <CRow
                                key={user.cognito_id}
                                className={`user-icon ${
                                  selectedUser?.cognito_id === user.cognito_id
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() => handleUserSelection(user)}
                              >
                                <div>
                                <table>
                                  <tbody>
                                  <tr>
                                    <td width={60}>
                                      <div className="chat-avatar">
                                        {getAvatar(user.name)}
                                      </div>
                                      <FaCircle className="user-status" />
                                    </td>
                                    <td>
                                      <div>
                                      <table>
                                        <tbody>
                                        <tr>
                                          <td>
                                            {" "}
                                            <div className="user-name">
                                              {user.name}
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            {" "}
                                            <div className="user-name">
                                              {user.type}
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            {user.type === "Counsellor" &&
                                              user.specialization && (
                                                <span className="user-name">
                                                  {user.specialization}
                                                </span>
                                              )}
                                          </td>
                                        </tr>
                                        </tbody>
                                      </table>
                                      </div>
                                    </td>
                                  </tr>

                                  </tbody>
                                </table>
                                </div>
                            
                              </CRow>
                            </>
                          ))
                        ) : (
                          <p className="no-users-found">No users found</p>
                        )}
                      </CCardBody>
                    </CCard>
                  
            </CCol>
            <CCol md={8}>
              <CCard style={{height: "100%"}}>
                <CCardBody className="chat-body">
                  {selectedUser ? (
                    messagereducer?.messages?.map((msg, index) => (
                      
                      <div
                        key={index}
                        className={`chat-message ${
                          msg.sender === localStorage.getItem("userId")
                            ? "user"
                            : "bot"
                        }`}
                      >
                        <span className="chat-text">{msg.text}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center">
                      Select a user to start chatting
                    </p>
                  )}
                  <div ref={chatEndRef} />
                </CCardBody>
                <CCardFooter>
                  <InputGroup className="chat-input">
                    <Form.Control
                      type="text"
                      placeholder="Type a message..."
                      value={input}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <Button className="btn-send-message" onClick={sendMessage}>
                      <FaPaperPlane />
                    </Button>
                  </InputGroup>
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CRow>
  );
};
export default Messages;
