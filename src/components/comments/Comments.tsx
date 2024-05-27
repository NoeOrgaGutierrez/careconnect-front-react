import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Button, Avatar, Typography, IconButton, Card, CardContent, Grid, Paper
} from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';

import './Comments.css';

interface Comment {
  id: string;
  content: string;
  user: { id: string; name: string; avatar: string };
  likes: number;
  dislikes: number;
  parentId?: string;
  replies: Comment[];
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/comments');
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewComment = async () => {
    if (!newComment) return;
    try {
      const response = await axios.post('http://localhost:3000/comments', {
        content: newComment,
        user: { id: '1', name: 'John Doe', avatar: 'path/to/avatar.png' },
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const response = await axios.patch(`http://localhost:3000/comments/${commentId}/like`);
      setComments(comments.map(c => (c.id === commentId ? response.data : c)));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDislike = async (commentId: string) => {
    try {
      const response = await axios.patch(`http://localhost:3000/comments/${commentId}/dislike`);
      setComments(comments.map(c => (c.id === commentId ? response.data : c)));
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
  };

  const handleReply = async (commentId: string, content: string) => {
    if (!content) return;
    try {
      const response = await axios.patch(`http://localhost:3000/comments/${commentId}`, {
        content,
        user: { id: '1', name: 'John Doe', avatar: 'path/to/avatar.png' },
      });
      setComments(comments.map(c => (c.id === commentId ? response.data : c)));
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const renderComments = (commentList: Comment[], parentId?: string) => {
    return commentList
      .filter(comment => comment.parentId === parentId)
      .map(comment => (
        <Paper key={comment.id} style={{ padding: '10px', marginTop: '10px' }}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Avatar src={comment.user.avatar} />
            </Grid>
            <Grid justifyContent="left" item xs zeroMinWidth>
              <Typography variant="h6" style={{ margin: 0, textAlign: "left" }}>{comment.user.name}</Typography>
              <Typography variant="body2" style={{ textAlign: "left" }}>{comment.content}</Typography>
              <Grid container direction="row" alignItems="center">
                <IconButton onClick={() => handleLike(comment.id)}>
                  <ThumbUp /> <Typography>{comment.likes}</Typography>
                </IconButton>
                <IconButton onClick={() => handleDislike(comment.id)}>
                  <ThumbDown /> <Typography>{comment.dislikes}</Typography>
                </IconButton>
              </Grid>
              {renderComments(comment.replies, comment.id)}
              <div>
                <TextField
                  label="Reply"
                  variant="outlined"
                  fullWidth
                  onBlur={(e) => handleReply(comment.id, e.target.value)}
                />
              </div>
            </Grid>
          </Grid>
        </Paper>
      ));
  };

  return (
    <div>
      <Typography variant="h6">Comments</Typography>
      <div>
        <TextField
          label="Add a comment"
          variant="outlined"
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleNewComment}>Comment</Button>
      </div>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        renderComments(comments)
      )}
    </div>
  );
};

export default Comments;
