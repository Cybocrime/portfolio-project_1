import React, { useState, useEffect,useRef  } from "react"; 
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from '../firebase.js';
import { formatDistanceToNow } from 'date-fns'; // Import date-fns for time formatting
import { debounce } from "lodash";
import DOMPurify from 'dompurify';
import {onAuthStateChanged, signOut  } from "firebase/auth";
import LogoutIcon from "@mui/icons-material/Logout";
import { Modal, Box, Button, Tabs, Tab, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Snackbar, Alert } from '@mui/material';
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReplyIcon from "@mui/icons-material/Reply";
import CommentIcon from '@mui/icons-material/Comment'; // Import the Comment icon
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';

import { signUpWithEmailAndPassword,auth,resetPassword, signInUser, addComment, fetchComments, updateCommentInFirestore, addReplyToComment } from '../firebase';
const ModalComponent = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [commentText, setCommentText] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [openReplyBox, setOpenReplyBox] = useState(null); // Holds the id of the open reply box or null
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [currentUser, setCurrentUser] = useState(null); // Stores logged-in user info
  const [loadingState, setLoadingState] = useState({
    comments: false,  // Loading for fetching comments
    addComment: false,  // Loading for adding comment
    addReply: false,    // Loading for adding reply
    auth: false,       // Loading for authentication (sign in/sign up)
  });  
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');  // 'success' or 'error'
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleTabChange = (_event, newValue) => {
    setActiveTab(newValue);
  };
 
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: DOMPurify.sanitize(value.trim()), // Ensure sanitization
    }));
  };

  const showMessage = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarType(type); // Pass either 'success' or 'error'
    setSnackbarOpen(true);
  };

 
  const timeoutRef = useRef(null); // Move this outside useEffect
  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(handleSignOut, 15 * 60 * 1000); // Logout after 15 minutes
    };
  
    const resetTimerAndBindEvents = () => {
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("click", resetTimer);
      resetTimer(); // Start timer immediately
    };
  
    resetTimerAndBindEvents();
  
    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, []);
  

  useEffect(() => {
    if (activeTab === 1) {
      setLoadingState((prevState) => ({ ...prevState, comments: true }));
      const loadComments = async () => {
        
        try {
          const { comments } = await fetchComments();
          setComments(comments);
        } catch (error) {
          console.error("Error fetching comments:", error);
        } finally {
          setLoadingState((prevState) => ({ ...prevState, comments: false }));

        }
      };
  
      loadComments(); // Fetch comments when activeTab is 1
    }
  }, [activeTab]);

  const handleSignOut = async () => {
    await signOut(auth);
    setCurrentUser(null);
  }; 
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? { userId: user.uid, email: user.email } : null);
    });
    return () => unsubscribe();
  }, []);
  
 const handleSignUpSubmit = async () => {
  setLoadingState((prevState) => ({ ...prevState, auth: true }));


  try {
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail(formState.email)) {
      showMessage("Invalid email format.", 'error'); // Error message
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      showMessage("Passwords do not match.", 'error'); // Error message
      return;
    }

    await signUpWithEmailAndPassword(formState.email, formState.password);
    setFormState({ email: "", password: "", confirmPassword: "" }); // Reset inputs after sign-up
    showMessage("Signup successful. Please verify your email.", 'success'); // Success message
    setIsSignUp(false);
    setIsLogin(true);
  } catch (error) {
    console.error("Signup Error:", error);
    showMessage(`Signup failed: ${error.code || "Unknown error"}`, 'error'); // Error message
  } finally {
    setLoadingState((prevState) => ({ ...prevState, auth: false }));

  }
};

// Helper function to verify captcha

  
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };
  
const handleLoginSubmit = async () => {
  setLoadingState((prevState) => ({ ...prevState, auth: true }));

  try {
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(formState.email)) {
      showMessage("Invalid email format.", 'error'); // Error message
      return;
    }

    const user = await signInUser(formState.email, formState.password);
    setFormState({ email: "", password: "", confirmPassword: "" }); // Reset inputs after sign-up
  

    setCurrentUser({
      userId: user.uid,
      email: user.email,
      isAuthenticated: true,
    });

    setIsLogin(false);
    showMessage("Login successful.", 'success'); // Success message
  } catch (error) {
    showMessage(error.message || "An unexpected error occurred.", 'error'); // Error message
  } finally {
    setLoadingState((prevState) => ({ ...prevState, auth: false }));
  }
};
  
  
  
  const handleAddComment = async () => {
    if (!canPerformAction()) return;
    if (!commentText.trim()) return  showMessage('Please enter a valid comment.', 'error'); 
    
    setLoadingState((prevState) => ({ ...prevState, addComment: true }));
    const sanitizedComment = DOMPurify.sanitize(commentText);
    try {
      const newComment = await addComment(sanitizedComment, currentUser);
      setComments((prevComments) => [newComment, ...prevComments]); // Append locally
      setCommentText('');
      showMessage('Comment added successfully.', 'success'); // Success message
      
    } catch (error) {
      console.error("Error adding comment: ", error);
      showMessage("Error adding comment. Please try again.", "error"); // Error message
    } finally {
      setLoadingState((prevState) => ({ ...prevState, addComment: false }));
    }
  };
  
  
  const lastActionTimestamp = useRef(0);
  const RATE_LIMIT_MS = 5000; // 5 seconds
  
  // Utility function to handle rate-limiting check
  const canPerformAction = () => {
    const now = Date.now();
    if (now - lastActionTimestamp.current < RATE_LIMIT_MS) {
      showMessage("Slow down! Please wait before taking another action.");
      return false;
    }
    lastActionTimestamp.current = now;
    return true;
  };
  
   
  
  const handleAddReply = async (commentId) => {
    if (!canPerformAction()) return; // Add rate-limiting check
    if (!replyText.trim()) {
      showMessage('Please enter a valid reply.', 'error'); // Error message
      return;
    }
    
    setLoadingState((prevState) => ({ ...prevState, addReply: true }));
    const sanitizedReply = DOMPurify.sanitize(replyText);
  
    const newReply = {
      userId: currentUser.userId,
      userEmail: currentUser.email,
      content: sanitizedReply,
      timestamp: new Date(),
    };
  
    try {
      await addReplyToComment(commentId, newReply);
      setReplyText('');
      console.log("Reply added successfully:", newReply);
      showMessage('Reply added successfully.', 'success'); // Success message
    } catch (error) {
      console.error("Error adding reply: ", error);
      showMessage("Error adding reply. Please try again.", 'error'); // Error message
    } finally {
      setLoadingState((prevState) => ({ ...prevState, addReply: false }));
    }
  };
  
  const handleClose = () => {
    setSnackbarOpen(false);
    
  };

  const handleModalClose = () => {
  setOpen(false);
  setFormState({ email: "", password: "", confirmPassword: "" });
  setCommentText(""); // Reset comment input
};
const lastLikeTimestamp = useRef(0);

const debouncedLikeDislike = debounce(async (id, action, currentUser, comments, setComments, showMessage, updateCommentInFirestore) => {
  const now = Date.now();
  if (now - lastLikeTimestamp.current < 3000) {
    showMessage("Please wait before liking/disliking again.", "error");
    return;
  }
  lastLikeTimestamp.current = now;

  if (!currentUser) {
    showMessage("Please log in to like or dislike comments.", "error");
    return;
  }

  const userId = currentUser.userId;

  // Find target comment
  const targetComment = comments.find((comment) => comment.id === id);
  if (!targetComment) {
    console.error(`Comment with ID ${id} not found.`);
    return;
  }

  const originalComments = [...comments]; // Backup state

  // Create a new updated list without mutating state directly
  const updatedComments = comments.map((comment) => {
    if (comment.id !== id) return comment;

    let updatedLikes = comment.likes || 0;
    let updatedDislikes = comment.dislikes || 0;
    let updatedLikesUser = [...comment.likesUser];
    let updatedDislikesUser = [...comment.dislikesUser];

    if (action === "like") {
      if (updatedLikesUser.includes(userId)) {
        updatedLikes = Math.max(updatedLikes - 1, 0);
        updatedLikesUser = updatedLikesUser.filter((uid) => uid !== userId);
      } else {
        if (updatedDislikesUser.includes(userId)) {
          updatedDislikes = Math.max(updatedDislikes - 1, 0);
          updatedDislikesUser = updatedDislikesUser.filter((uid) => uid !== userId);
        }
        updatedLikes += 1;
        updatedLikesUser.push(userId);
      }
    } else if (action === "dislike") {
      if (updatedDislikesUser.includes(userId)) {
        updatedDislikes = Math.max(updatedDislikes - 1, 0);
        updatedDislikesUser = updatedDislikesUser.filter((uid) => uid !== userId);
      } else {
        if (updatedLikesUser.includes(userId)) {
          updatedLikes = Math.max(updatedLikes - 1, 0);
          updatedLikesUser = updatedLikesUser.filter((uid) => uid !== userId);
        }
        updatedDislikes += 1;
        updatedDislikesUser.push(userId);
      }
    }

    return {
      ...comment,
      likes: updatedLikes,
      dislikes: updatedDislikes,
      likesUser: updatedLikesUser,
      dislikesUser: updatedDislikesUser,
    };
  });

  setComments(updatedComments);

  try {
    const updatedComment = updatedComments.find((c) => c.id === id);
    if (!updatedComment) throw new Error("Updated comment not found.");
    await updateCommentInFirestore(id, updatedComment);
  } catch (error) {
    console.error("Error updating like/dislike:", error);
    setComments(originalComments); // Revert state on failure
    showMessage("Unable to update like/dislike. Please try again.", "error");
  }
}, 1000); // 1-second debounce delay

const handleLikeDislike = (id, action) => {
  debouncedLikeDislike(id, action, currentUser, comments, setComments, showMessage, updateCommentInFirestore);
};





const handlePasswordResetSubmit = async () => { 
  setLoadingState((prevState) => ({ ...prevState, auth: true }));

  try {
    const userQuery = query(collection(db, "users"), where("email", "==", formState.email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      showMessage("No account found with this email.", "error");
      return;
    }

    const result = await resetPassword(formState.email);
    showMessage(result.message, "success"); // Success message
  } catch (error) {
    showMessage(error.message || "An unexpected error occurred.", "error"); // Error message
  } finally {
    setLoadingState((prevState) => ({ ...prevState, auth: false }));
  }
};


const toggleReplyBox = (id) => {
  setOpenReplyBox((prev) => (prev === id ? null : id));
};


  return (
    <>
<Button
  variant="contained"
  onClick={() => setOpen(true)}
  sx={{
    backgroundColor: "#1976d2", // Default MUI primary color
    "&:hover": { backgroundColor: "#1565c0" }, // Darker shade on hover
    boxShadow: 3, // Adds some elevation
    borderRadius: "50%", // Perfect circle
    width: '50px', // Set width to 30px
    height: '50px', // Set height to 30px
    display: 'flex', // Flex to align icon inside
    justifyContent: 'center', // Horizontally center the icon
    alignItems: 'center', // Vertically center the icon
    padding: 0, // Remove padding to keep it small
  }}
>
  <CommentIcon sx={{ color: 'white', fontSize: '20px' }} /> {/* Smaller icon size */}
</Button>

      <Modal open={open} onClose={handleModalClose}sx={{
    zIndex: 10 // Set a lower zIndex to ensure the snackbar stays above
  }}>
   
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: { xs: "87%", sm: 610 },
      bgcolor: "background.paper",
      boxShadow: 24,
      borderRadius: 2,
      p: 3,
    }}
    
  >
    {currentUser && (
  <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
    <IconButton onClick={handleSignOut} color="error">
      <LogoutIcon />
    </IconButton>
  </Box>
)}

    <Tabs value={activeTab} onChange={handleTabChange} centered>
      <Tab label="Add Comment" />
      <Tab label="Comments" />
    </Tabs>

    <Box mt={2}>
    {activeTab === 0 && (
  <>
    {!currentUser? (
      <>
        {/* Message Box */}
        {!isSignUp && !isLogin && !isPasswordReset && (
          <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <Typography variant="body2" color="textSecondary">
              Your feedback is important to us! We value transparency and ensure your comments are securely stored and reviewed to improve our aluminum and glazing services. Please sign up or log in to share your thoughts with us, knowing your information is kept safe.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => setIsSignUp(true)} // Open sign-up form
            >
              Sign Up to Share Feedback
            </Button>
            <Button
              fullWidth
              variant="text"
              color="secondary"
              sx={{ mt: 1 }}
              onClick={() => setIsLogin(true)} // Open login form
            >
              Already have an account? Sign In
            </Button>
          </Box>
        )}
        {/* Password Reset Form */}
{isPasswordReset && (
  <>
    <Typography variant="h6" color="textPrimary" sx={{ mb: 2 }}>
      Reset Your Password
    </Typography>
    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
      Enter your email address below, and we&apos;ll send you a link to reset your password.
    </Typography>
    <TextField
      fullWidth
      name="email"
      label="Email"
      variant="outlined"
      margin="normal"
      value={formState.email}
      onChange={handleChange}
      sx={{ mb: 2 }}
    />
    <Button
      fullWidth
      variant="contained"
      color="primary"
      sx={{ mt: 2 }}
      onClick={handlePasswordResetSubmit} // This will trigger the password reset logic
      disabled={!formState.email|| loadingState.auth}
    >
   {loadingState.auth ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Reset Link'}

    </Button>
    <Button
      fullWidth
      variant="text"
      color="secondary"
      sx={{ mt: 1 }}
      onClick={() => {
        setIsPasswordReset(false); // Close password reset form
        setIsLogin(true); // Optionally, return to the login form
      }}
    >
      Back to Login
    </Button>
  </>
)}

        {/* Sign-Up Form */}
        {isSignUp && (
          <>
            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              margin="normal"
              value={formState.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={passwordVisible ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              autoComplete="new-password" // Prevents autofill issues
              value={formState.password}
              onChange={handleChange}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {passwordVisible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={confirmPasswordVisible ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
               autoComplete="new-password" // Prevents autofill issues
               value={formState.confirmPassword}
               onChange={handleChange}
               slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleConfirmPasswordVisibility}>
                        {confirmPasswordVisible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleSignUpSubmit}
              disabled={!formState.email || !formState.password || !formState.confirmPassword|| loadingState.auth}
            >
    {loadingState.auth ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up'}
 </Button>
            <Button
              fullWidth
              variant="text"
              color="secondary"
              sx={{ mt: 1 }}
              onClick={() => {
                setIsSignUp(false);
                setIsLogin(false);
              }}
            >
              Cancel
            </Button>
          </>
        )}

        {/* Sign-In Form */}
        {isLogin ? (
  <>
    <TextField
      fullWidth
      label="Email"
      name="email"
      variant="outlined"
      margin="normal"
      value={formState.email}
     onChange={handleChange}
    />
    <TextField
      fullWidth
      label="Password"
      name="password"
      type={passwordVisible ? 'text' : 'password'}
      variant="outlined"
      margin="normal"
      
      autoComplete="new-password" // Prevents autofill issues
      value={formState.password}
  onChange={handleChange}
  slotProps={{
    input: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={togglePasswordVisibility}>
            {passwordVisible ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    },
  }}
    />
    {/* Reset Password Link */}
    <Typography
      variant="body2"
      color="primary"
      sx={{ mt: 1, cursor: 'pointer', textAlign: 'center' }}
      onClick={() => {
        setIsLogin(false);
        setIsPasswordReset(true); // Switch to reset password
      }}
    >
      Forgot Password? Reset it here.
    </Typography>
    <Button
      fullWidth
      variant="contained"
      color="primary"
      sx={{ mt: 2 }}
      onClick={handleLoginSubmit}
      disabled={!formState.email || !formState.password|| loadingState.auth}
    >
    {loadingState.auth ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
    </Button>
    <Button
      fullWidth
      variant="text"
      color="secondary"
      sx={{ mt: 1 }}
      onClick={() => {
        setIsLogin(false);
        setIsSignUp(false);
      }}
    >
      Cancel
    </Button>
  </>
):null}

      </>
    ) : (
      <>
        {/* Only show comment input once authenticated and verified */}
        {currentUser && (
  <Box mt={3}>
    <TextField
      fullWidth
      label="Add a Comment"
      variant="outlined"
      margin="normal"
      multiline
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
    />
    <Button
      fullWidth
      variant="contained"
      color="primary"
      sx={{ mt: 2 }}
      onClick={handleAddComment}
    >
    {loadingState.addComment ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Add Comment'}

    </Button>
  </Box>
)}
      </>
    )}
  </>
)}





{activeTab === 1 && (
  <Box
    sx={{
      maxHeight: "400px", // Adjust the height as needed
      overflowY: "auto",
      padding: 0,
      borderRadius: "8px",
      width: "100%",
    }}
  >
    {comments.length === 0 ? (
      <Typography variant="body1">No comments yet.</Typography>
    ): loadingState.comments? ( // Show loading spinner while comments are loading
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>

    ) : (
      comments.map((comment) => (
        <Box
          key={comment.id}
          sx={{
            marginBottom: 2,
            padding: 0,
            borderRadius: "8px",
            backgroundColor: "white",
          }}
        >
          {/* Comment Content */}
          <Box mt={1} sx={{ borderBottom: "1px solid #ccc", pb: 2 }}>
            <Box display="flex" alignItems="center">
              <AccountCircle /> {/* Avatar for the comment */}
              <Box ml={2}>
                <Typography variant="body2">{comment.content}</Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center">
            <IconButton
  onClick={() =>
    handleLikeDislike(comment.id, "like") // Use comment.id here as it refers to doc.id
  }
  sx={{
    fontSize: "1rem",
    mr: 1,
    gap: "0.3rem",
    color: comment.likesUser.includes(currentUser?.userId) ? "blue" : "gray",
  }}
>
  <ThumbUpIcon />
  {comment.likes}
</IconButton>

<IconButton
  onClick={() =>
    handleLikeDislike(comment.id, "dislike") // Use comment.id here as it refers to doc.id
  }
  sx={{
    fontSize: "1rem",
    mr: 1,
    gap: "0.3rem",
    color: comment.dislikesUser.includes(currentUser?.userId) ? "red" : "gray",
  }}
> 

  <ThumbDownIcon />
  {comment.dislikes}
</IconButton>
<Box ml={2}>
            {/* Display the formatted timestamp */}
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
              {formatDistanceToNow(comment.timestamp) + " ago"}
            </Typography>
          </Box>
<IconButton
  onClick={() => toggleReplyBox(comment.id)} // Use id in toggleReplyBox
  sx={{
    fontSize: "1rem",
    color: openReplyBox === comment.id ? "green" : "gray", // Use id in state check
  }}
>
  <ReplyIcon />
  {comment.replies.length}
</IconButton>
          
            </Box>

            {openReplyBox === comment.id && ( // Only show reply box for the specific comment's id
  <Box mt={2}>
    <TextField
      fullWidth
      label="Reply to this comment"
      variant="outlined"
      margin="normal"
      multiline
      value={replyText}
      onChange={(e) => setReplyText(e.target.value)}
    />
    <Button
      fullWidth
      variant="contained"
      color="primary"
      sx={{ mt: 2 }}
      onClick={() => handleAddReply(comment.id)} // Pass id to handleAddReply
    >
        {loadingState.addReply ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Add Reply'}

    </Button>
    {comment.replies.length > 0 && (
      <Box mt={2}>
        {comment.replies.map((reply) => (
          <Box
            key={reply.id} // Use reply's id
            sx={{
              ml: 7,
              mb: 1,
              p: 1,
              border: "1px solid #C0C0C0",
              borderRadius: 2,
              backgroundColor: "#E8E9E8",
              display:"flex",
               alignItems:"center"
            }}
          >
              <AccountCircle /> {/* Avatar for the comment */}
              <Box ml={2}>
                <Typography variant="body2">{reply.content}</Typography>
              </Box>          
          </Box>
        ))}
      </Box>
    )}
  </Box>
)}
          </Box>
        </Box>
      ))
    )}
  </Box>
)}
    </Box>
  </Box>
</Modal>
<Snackbar
    open={snackbarOpen}
    autoHideDuration={6000}
    onClose={handleClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    sx={{ zIndex:  20}}  // Ensure the Snackbar is above modals
  >
    <Alert
      onClose={handleClose}
      severity={snackbarType}  // Dynamically set the severity
      sx={{ width: '100%' }}
    >
      {snackbarMessage}
    </Alert>
  </Snackbar>
    </>
    
  );
};

export default ModalComponent;
