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
  Spacer,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogOverlay,
  Divider,
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
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [hoveredCommentIndex, setHoveredCommentIndex] = useState(null);
  const deleteAlertDialogRef = useRef();
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

  // const handleOpenDeleteAlert = () => {
  //   setIsDeleteAlertOpen(true);
  // };

  // const handleCloseDeleteAlert = () => {
  //   setIsDeleteAlertOpen(false);
  // };

  const handleConfirmDelete = async () => {
     // Check if hoveredCommentIndex is a valid index
    if (hoveredCommentIndex === null || hoveredCommentIndex < 0 || hoveredCommentIndex >= comments.length) {
      console.error('Invalid hoveredCommentIndex');
      toast.error('Error deleting comment');
      return;
    }
    try {
      const response = await commentDelete({ postId: post._id, commentId: comments[hoveredCommentIndex]._id }).unwrap()
      console.log("response:", response);
      // Update local state (remove the deleted comment)
      const updatedComments = [...comments];
      updatedComments.splice(hoveredCommentIndex, 1);
      setComments(updatedComments);

      // Update local state (remove the deleted comment from the post)
      const updatedPosts = posts.map((post) =>
          post._id === post._id ? { ...post, comments: updatedComments } : post
      );
      setPosts(updatedPosts);
      if (response && response.statusCode === 200) {
          toast.warning("Comment Deleted");
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error deleting comment', error);
    }
  };

//   const handleConfirmDelete = async () => {
//   try {
//     console.log("deleting");
//     // Check if hoveredCommentIndex is a valid index
//     if (hoveredCommentIndex !== null && hoveredCommentIndex >= 0 && hoveredCommentIndex < comments.length) {
//       // Get the comment from the comments array
//       const commentToDelete = comments[hoveredCommentIndex];

//       // Check if the comment is defined and has a valid _id
//       if (commentToDelete && commentToDelete._id) {
//         // Delete the comment
//         const response = await commentDelete(post._id, commentToDelete._id);
//         console.log("response from comment delete: ", response);

//         // Update local state (remove the deleted comment)
//         const updatedComments = [...comments];
//         updatedComments.splice(hoveredCommentIndex, 1);
//         setComments(updatedComments);

//         // Update post
//         onCommentPost(post._id, updatedComments);
//         setIsDeleteAlertOpen(false);
//       } else {
//         console.error('Comment not found or missing _id property');
//         toast.error('Error deleting comment');
//       }
//       console.error('Invalid hoveredCommentIndex');
//       toast.error('Error deleting comment');
//     }
//   } catch (error) {
//     console.error('Error deleting comment:', error);
//     toast.error('Error deleting comment', error);
//   }
// };


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
                      console.log('Mouse enter:', index);
                      setHoveredCommentIndex(index);
                    }}
                    onMouseLeave={() => {
                      console.log('Mouse leave:', index);
                      setHoveredCommentIndex(null);
                    }}
                  >
                    <HStack spacing={2} align="center" justifyContent="space-between">
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
                      <HStack spacing={2} align="center">
                        <Spacer />
                        {userInfo.id === comment.user._id && hoveredCommentIndex === index && (
                          <DeleteIcon onClick={handleConfirmDelete} />
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
        {/* Delete Alert Dialog */}
        <AlertDialog
          isOpen={isDeleteAlertOpen}
          leastDestructiveRef={deleteAlertDialogRef}
          // onClose={handleCloseDeleteAlert}
        >
          <AlertDialogOverlay>
            <AlertDialogContent mx="auto" my="auto" width="20%">
              <AlertDialogBody>
                <VStack spacing={2} align="stretch">
                  <Button colorScheme="red" onClick={handleConfirmDelete}>Delete</Button>
                  <Divider />
                  {/* <Button onClick={handleCloseDeleteAlert}>Cancel</Button> */}
                </VStack>
              </AlertDialogBody>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Modal>
    </>
  );
};

export default CommentsModal;


