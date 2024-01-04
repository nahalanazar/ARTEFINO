import { Box, Text } from '@chakra-ui/layout'
import { FormControl} from '@chakra-ui/form-control'
import { Spinner, IconButton, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Input } from "@chakra-ui/input";
import { ChatState } from '../context/ChatProvider'
import { getSender } from '../config/ChatLogics'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react'
import { useSendMessageMutation, useFetchMessagesMutation, useFetchNotificationsMutation } from '../../slices/userApiSlice'
import "../../styles/message.css";
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../../animations/typing.json'
import moment from 'moment'
const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [socketConnected, setSocketConnected] = useState(false)
    const [sendNewMessage] = useSendMessageMutation()
    const [fetchAllMessages] = useFetchMessagesMutation()
    const [fetchNotifications] = useFetchNotificationsMutation()

    const { selectedChat, setSelectedChat, notification, setNotification, setChats } = ChatState()
    const { userInfo } = useSelector((state) => state.userAuth);
    const userId = userInfo.id

    const toast = useToast()

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }
    useEffect(() => {
        // Create a new socket connection when userId changes
        socket = io(ENDPOINT, { query: { userId }});
        
        socket.emit("setup", userInfo)
        socket.on("userStatus", ({ userId, online, lastSeen }) => {
            console.log(`${userId} is ${online ? 'online' : 'offline'}`);
            console.log("selected  chat: ", selectedChat);
            if (selectedChat && selectedChat.users.some(user => user._id === userId )) {
                setSelectedChat(prevChat => ({
                    ...prevChat,
                    online: online,
                    lastSeen: online ? null : lastSeen,
                    userId: userId
                }));
            }
            // if (selectedChat && selectedChat.users.some(user => user._id === userId)) {
            //     console.log("selectedchat:", selectedChat)
            //     // Update the online status for the specific user in the selected chat
            //     setSelectedChat(prevChat => {
            //         const updatedUsers = prevChat.users.map(user => {
            //         if (user._id === userId) {
            //             return { ...user, online, lastSeen: online ? null : new Date(lastSeen) };
            //         }
            //         return user;
            //     });
            //         return {
            //             ...prevChat,
            //             users: updatedUsers,
            //             lastSeen: online ? null : new Date(lastSeen),
            //         };
            //     });
            // }
        });
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))


        // Cleanup the previous socket connection when the component unmounts
        return () => {
            if (socket) {
                socket.disconnect();
                socket.off("connected");
                socket.off("typing");
                socket.off("stop typing");
                socket.off("userStatus");
                socket.off("message received");
            }
        };
    }, []);


    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id)
            try {
                setNewMessage(""); 
                const { data } = await sendNewMessage({ content: newMessage, chatId: selectedChat._id });
                // Update the updatedAt property of the selectedChat to the current time
                setChats((prevChats) => {
                    const updatedChats = prevChats.map((chat) => {
                        if (chat._id === selectedChat._id) {
                            return { ...chat, updatedAt: new Date() };
                        }
                        return chat;
                    });

                    // Sort chats based on updatedAt (newest first)
                    const sortedChats = updatedChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                    return sortedChats;
                });
                socket.emit('new Message', data)
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error occurred",
                    description: "Failed to send message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                });
            }
        }
    };

    const fetchMessages = async () => {
        if (!selectedChat) return
        setLoading(true)
        try {
            const { data } = await fetchAllMessages(selectedChat._id);
            setMessages(data)
            setLoading(false)

            socket.emit("join chat", selectedChat._id)
        } catch (error) { 
            toast({
                title: "Error occurred",
                description: "Failed to Load messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    }


    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);


    useEffect(() => {
        const handleNewMessage = (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                const existingNotification = notification.find((n) => n.chat._id === newMessageReceived.chat._id);

                if (!existingNotification) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                } else {
                    setNotification([
                        ...notification.filter((n) => n.chat._id !== newMessageReceived.chat._id),
                        newMessageReceived,
                    ]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages((prevMessages) => {
                    if (prevMessages) {
                        return [...prevMessages, newMessageReceived];
                    } else {
                        return [newMessageReceived];
                    }
                });
            }
        };

        socket.on("message received", handleNewMessage);

        return () => {
            socket.off("message received", handleNewMessage);
        };
    }, [notification, selectedChat]);

    
    // useEffect(() => {
    //     socket.on("message received", (newMessageReceived) => {
    //         if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
    //             const existingNotification = notification.find((n) => n.chat._id === newMessageReceived.chat._id);

    //             if (!existingNotification) {
    //                 // Notify users about the new message
    //                 // const senderId = newMessageReceived.sender._id;
    //                 // const receiverId = userId; // Assume the current user is the receiver
    //                 // createNotification(senderId, receiverId, `New message from ${getSender(userId, newMessageReceived.chat.users)}`);
                    
    //                 setNotification([newMessageReceived, ...notification]);
    //                 setFetchAgain(!fetchAgain)
    //             } else {
    //                 // Update the existing notification
    //                 setNotification([
    //                 ...notification.filter((n) => n.chat._id !== newMessageReceived.chat._id),
    //                 newMessageReceived,
    //                 ]);
    //                 setFetchAgain(!fetchAgain);
    //             }
    //         } else {
    //             // setMessages([...messages, newMessageReceived]);
    //             // setMessages(prevMessages => [...prevMessages, newMessageReceived]);
    //             setMessages(prevMessages => {
    //                 if (prevMessages) {
    //                     return [...prevMessages, newMessageReceived];
    //                 } else {
    //                     return [newMessageReceived];
    //                 }
    //             });
    //         }
    //     });
    //     return () => {
    //         // Cleanup event listeners when the component unmounts
    //         socket.off("connected");
    //         socket.off("userStatus");
    //     };

    // },[notification, selectedChat]);

    useEffect(() => {
        const fetchNotificationsData = async () => {
            try {
                const { data } = await fetchNotifications();
                console.log("notifications: ", data);
                setNotification(data);
            } catch (error) {
                console.error('Error fetching notifications:', error.message);
            }
        };

        fetchNotificationsData();
    }, []);
    
    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        //typing indicator logic
        if (!socketConnected) return
        
        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id)
        }

        let lastTypingTime = new Date().getTime()
        let timerLength = 2000
        setTimeout(() => {
            let timeNow = new Date().getTime()
            let timeDiff = timeNow - lastTypingTime

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id)
                setTyping(false)
            }
        }, timerLength);
    }

  return (
    <>
        {selectedChat ? (
            <>
                <Text
                    fontSize={{ base: "28px", md: "30px" }}
                    px={2}
                    w="100%"
                    fontFamily="work sans"
                    display="flex"
                    justifyContent={{ base: "space-between" }}
                    alignItems="center"
                >
                    <IconButton 
                        display={{base: "flex", md: "none"}}
                        icon={<ArrowBackIcon />}
                        onClick={()=>setSelectedChat("")}
                    />
                    <Box>
                        <p style={{ margin: "0" }}>{getSender(userId, selectedChat.users)}</p>
                        {selectedChat.online ? (
                            <p style={{ fontSize: "14px", margin: "0" }}>online</p>
                            //<p style={{ fontSize: "14px", margin: "0" }}>{`${selectedChat.userId} online`}</p>
                        ) : (
                            <p style={{ fontSize: "14px", margin: "0" }}>
                                Last seen: {moment(selectedChat.lastSeen).format('MMMM D, YYYY h:mm A')}
                            </p>
                          )}
                    </Box>
                </Text>
                <Box
                    display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    p={3}
                    bg="#E8E8E8"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    overflow="hidden"
                > 
                      {loading ? (
                          <Spinner
                              size="xl"
                              w={20}
                              h={20}
                              alignSelf='center'
                              margin="auto"
                          />
                      ) : (
                          <div className='messages'>
                            <ScrollableChat messages={messages} />
                          </div>
                      )}

                      <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                          {isTyping ? <div>
                              <Lottie
                                  options={defaultOptions}
                                  width={70}
                                  style={{marginBottom: 15, marginLeft: 0}}
                              />
                          </div> : <></>}
                          <Input
                              value={newMessage}
                              variant="filled"
                              bg="#E0E0E0"
                              placeholder='Enter New Message'
                              onChange={typingHandler}
                          />
                      </FormControl>
                </Box>
            </>
        ) : (
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3} fontFamily="work sans">
                    Click on a user to start chatting
                </Text>
            </Box>
        )}
    </>
  )
}

export default SingleChat