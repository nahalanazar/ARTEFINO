import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Heading,
  Stack,
  Image,
  VStack,
  Box,
  HStack
} from '@chakra-ui/react'
import { toast } from 'react-toastify'
import React, { useEffect, useRef, useState } from 'react'
import { useCommentPostMutation } from '../../slices/userApiSlice';


const CommentsModal = ({ post, isOpen, onClose, onCommentPost, formatTimeDifference }) => {
  const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;
  const btnRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const [commentPost] = useCommentPostMutation();

  useEffect(() => {
    if (isOpen) {
      setComments(post ? post.comments || [] : []);
    }
  }, [isOpen, post]);

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      return toast.error("Please add a comment");
    }
    try {
      const response = await commentPost({
        postId: post._id,
        text: newComment,
      });
      const addedComment = response.data.comment;
      setComments([...comments, addedComment]);
      setNewComment('');
console.log("newComment after reset:", newComment);

      onCommentPost(post._id, addedComment);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error adding Comment', error);
    }
  };

const isPostButtonDisabled = !newComment.trim();
console.log("newComment:", newComment);
console.log("isPostButtonDisabled:", isPostButtonDisabled);

  return (
    <>
      <Modal
        onClose={onClose}
        finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Comments</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={3}>
              {comments.map((comment, index) => (
                <React.Fragment key={index}>
                  <Card p={2} variant="outline" overflow="hidden">
                    <HStack spacing={2} align="center">
                      <Image
                        boxSize="40px"
                        borderRadius="full"
                        src={`${VITE_PROFILE_IMAGE_DIR_PATH}${comment.user.profileImageName}`}
                        alt={comment.user.name}
                      />
                      <b>{comment.user.name}</b>
                      <p style={{ marginBottom: '0' }}>{comment.text}</p>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      {formatTimeDifference(comment.date)}
                    </Text>
                  </Card>
                </React.Fragment>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Input
              value={newComment}
              variant="filled"
              bg="#E0E0E0"
              placeholder="Add a comment..."
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              onClick={handlePostComment}
              disabled={isPostButtonDisabled}
              style={{ cursor: isPostButtonDisabled ? 'not-allowed' : 'pointer' }}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommentsModal;


