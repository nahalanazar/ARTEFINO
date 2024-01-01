import { useState } from 'react';
import '../../styles/productDetails.css';
import PropTypes from 'prop-types';
import { ChatState } from "../../components/context/ChatProvider"
import { useAccessChatMutation } from '../../slices/userApiSlice'
import { useToast } from "@chakra-ui/react"
import { Spinner } from '@chakra-ui/spinner';
import { useNavigate } from 'react-router-dom'


const ChatButton = ({ userId }) => {

    const {setSelectedChat, chats, setChats} = ChatState()
    const [loadingChat, setLoadingChat] = useState("")
    const [getChat] = useAccessChatMutation()
    const navigate = useNavigate()

    const toast = useToast()

    const accessChat = async (userId) => {
      try {
        setLoadingChat(true)
        const response = await getChat(userId)
        console.log("response from access chat: ", response);
        if (response.data.error) {
          toast({
            title: "Follow each other to access the chat",
            description: response?.data?.error || "An error occurred",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right"
          })
          setLoadingChat(false)
        } else if (response.error.data) {
          toast({
            title: "Follow each other to access the chat",
            description: response?.error.data.error|| "An error occurred",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right"
          })
          setLoadingChat(false)
        } else {
          const {data} = response
          if (!chats.find((c) => c._id === data._id)) {
            setChats([data, ...chats])
            setSelectedChat(data)
          }
          setSelectedChat(data)
          setLoadingChat(false)
          navigate('/chat')
        }
      } catch (error) {
        console.log("error:", error);
        toast({
          title: "Follow each other to access the chat",
          description: error.response?.data?.message || "An error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right"
        })
        console.log("hi", error.message)
        setLoadingChat(false)
      }
    }
    //  toast.error(error?.message || error?.error);

    return (
      <>
        <button
          className="followButton"
          style={{
              color: 'white',  
              backgroundColor: '#007BFF',  
              fontSize: 16,
              fontFamily: 'Roboto',
              fontWeight: '700',
              padding: '8px 16px',  
              border: 'none',  
              borderRadius: '4px',  
              cursor: 'pointer',
          }}
          onClick={() => accessChat(userId)}
        >
          {loadingChat ? <Spinner size="sm" borderWidth="6px" ml="auto" display="flex" />:  <>Message</> }       
        </button>
        
      </>

    )
}

ChatButton.propTypes = {
    userId: PropTypes.string.isRequired
};

export default ChatButton