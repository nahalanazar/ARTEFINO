import ScrollableFeed from 'react-scrollable-feed'
import { useSelector } from 'react-redux';
import { isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useState } from 'react';
import { Image, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Flex, Button } from '@chakra-ui/react';

const ChatImageModal = ({ imageUrl, isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="full">
    <ModalOverlay />
    <ModalContent >
      <ModalCloseButton />
      <ModalBody
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
      >
        <Flex align="center" justify="center" h="100%">
          <Image src={imageUrl} alt="Chat image" width="600px" height="auto"/>
        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal>
);


const ScrollableChat = ({ messages }) => {
  const { userInfo } = useSelector((state) => state.userAuth);
  const [imageModalsOpen, setImageModalsOpen] = useState(new Array(messages.length).fill(false));

  const handleImageClick = (index) => {
    const newImageModalsOpen = [...imageModalsOpen];
    newImageModalsOpen[index] = true;
    setImageModalsOpen(newImageModalsOpen);
  };

  const handleCloseModal = (index) => {
    const newImageModalsOpen = [...imageModalsOpen];
    newImageModalsOpen[index] = false;
    setImageModalsOpen(newImageModalsOpen);
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {m.images && m.images.length > 0 ? (
              <>
                <Image
                  src={m.images[0].url}
                  alt="chat-image"
                  borderRadius="md"
                  maxWidth="200px"
                  style={{
                    marginLeft: isSameSenderMargin(messages, m, i, userInfo.id),
                    marginTop: isSameUser(messages, m, i) ? 3 : 10,
                    cursor: "pointer"
                  }}
                  onClick={() => handleImageClick(i)}
                />
                {imageModalsOpen[i] && (
                  <ChatImageModal
                    imageUrl={m.images[0].url}
                    isOpen={imageModalsOpen[i]}
                    onClose={() => handleCloseModal(i)} 
                  />
                )}
              </>
            ) : (
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === userInfo.id ? "#B9F5D0" : "#BEE3F8"
                  }`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, m, i, userInfo.id),
                  marginTop: isSameUser(messages, m, i) ? 3 : 10
                }}
              >
                {m.content}
                <br />
                <small style={{ color: "gray" }}>
                  {format(new Date(m.createdAt), "h:mm a")}
                </small>
              </span>
            )}
          </div>
        ))}
    </ScrollableFeed>
  );
}

ScrollableChat.propTypes = {
  messages: PropTypes.array.isRequired,
};

export default ScrollableChat;
