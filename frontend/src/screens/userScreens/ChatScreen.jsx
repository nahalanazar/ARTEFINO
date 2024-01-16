import { ChakraProvider } from "@chakra-ui/react"
import { Box } from "@chakra-ui/layout"
import ChatList from "../../components/userComponents/ChatList"
import ChatBox from "../../components/userComponents/ChatBox"
import { useState } from "react"

const ChatScreen = () => {
    const [fetchAgain, setFetchAgain] = useState(false);
    return (
        <ChakraProvider>
            <div style={{width: "100%"}}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    height="91.5vh"
                    padding="10px"
                >
                    <ChatList fetchAgain={fetchAgain} />
                    <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                </Box>
            </div>
        </ChakraProvider>
    )
}

export default ChatScreen