import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Card,
  Text,
  Image,
  VStack,
  HStack,
  Spacer
} from '@chakra-ui/react'
import { toast } from 'react-toastify'
import React, { useEffect, useRef, useState } from 'react'
import { useCommentPostMutation, useCommentDeleteMutation } from '../../slices/userApiSlice';
import { DeleteIcon } from '@chakra-ui/icons'
import { useSelector } from 'react-redux';

const CommentsModal = ({ post, isOpen, onClose, onCommentPost, formatTimeDifference, setPosts, posts }) => {
  const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;
  const btnRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [hoveredCommentIndex, setHoveredCommentIndex] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [commentToDeleteIndex, setCommentToDeleteIndex] = useState(null);

  const { userInfo } = useSelector((state) => state.userAuth);

  const [commentPost] = useCommentPostMutation();
  const [commentDelete] = useCommentDeleteMutation();

  const isPostButtonDisabled = !newComment.trim();

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

      onCommentPost(post._id, addedComment);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error adding Comment', error);
    }
  };

  const handleOpenConfirmDelete = (index) => {
    setCommentToDeleteIndex(index);
    setIsConfirmDeleteOpen(true);
  };

  const handleCloseConfirmDelete = () => {
    setCommentToDeleteIndex(null);
    setIsConfirmDeleteOpen(false);
  };

  const handleConfirmDelete = async () => {
     // Check if hoveredCommentIndex is a valid index
    if (commentToDeleteIndex === null || commentToDeleteIndex < 0 || commentToDeleteIndex >= comments.length) {
      console.error('Invalid commentToDeleteIndex');
      toast.error('Error deleting comment');
      return;
    }
    try {
      const response = await commentDelete({ postId: post._id, commentId: comments[commentToDeleteIndex]._id }).unwrap()
      console.log("response:", response);
      // Update local state (remove the deleted comment)
      const updatedComments = [...comments];
      updatedComments.splice(commentToDeleteIndex, 1);
      setComments(updatedComments);

      // Update local state (remove the deleted comment from the post)
      const updatedPosts = posts.map((post) =>
          post._id === post._id ? { ...post, comments: updatedComments } : post
      );
      setPosts(updatedPosts);
      toast.warning("Comment Deleted");
      handleCloseConfirmDelete();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error deleting comment', error);
    }
  };

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
                  <Card
                    p={2}
                    variant="outline"
                    overflow="hidden"
                    onMouseEnter={() => {
                      setHoveredCommentIndex(index);
                    }}
                    onMouseLeave={() => {
                      setHoveredCommentIndex(null);
                    }}
                  >
                    <HStack spacing={2} align="center" justifyContent="space-between">
                      <HStack spacing={2} align="center">
                        <Image
                          boxSize="40px"
                          borderRadius="full"
                          src={comment.user.profileImageName ? comment.user.profileImageName : VITE_PROFILE_IMAGE_DIR_PATH + 'defaultImage.jpeg'}
                          alt={comment.user.name}
                        />
                        <b>{comment.user.name}</b>
                        <p style={{ marginBottom: '0' }}>{comment.text}</p>
                      </HStack>
                      <HStack spacing={2} align="center">
                        <Spacer />
                        {userInfo && userInfo.id === comment.user._id && hoveredCommentIndex === index && (
                          <DeleteIcon
                            onClick={() => handleOpenConfirmDelete(index)}
                            style={{ cursor: 'pointer' }}
                          />
                        )}
                      </HStack>
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
      {/* Confirmation modal */}
      <Modal
        isOpen={isConfirmDeleteOpen}
        onClose={handleCloseConfirmDelete}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this comment?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleConfirmDelete}>Yes</Button>
            <Button variant="ghost" onClick={handleCloseConfirmDelete}>No</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommentsModal;


