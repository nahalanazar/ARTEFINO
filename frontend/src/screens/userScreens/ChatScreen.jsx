import { ChatState } from "../../components/context/ChatProvider"
import { ChakraProvider } from "@chakra-ui/react"
import { Box } from "@chakra-ui/layout"
// import ChatSideDrawer from "../../components/userComponents/ChatSideDrawer"
import ChatList from "../../components/userComponents/ChatList"
import ChatBox from "../../components/userComponents/ChatBox"

const ChatScreen = () => {

    return (
        <ChakraProvider>
            <div style={{width: "100%"}}>
                {/* <ChatSideDrawer /> */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    height="91.5vh"
                    padding="10px"
                >
                    <ChatList />
                    <ChatBox />
                </Box>
            </div>
        </ChakraProvider>
    )
}

export default ChatScreen