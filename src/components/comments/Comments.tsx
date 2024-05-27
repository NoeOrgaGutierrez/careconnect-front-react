import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField, Button, Avatar, Typography, IconButton, Grid, Paper, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';

import './Comments.css';

interface User {
  id: string;
  name: string;
  avatar: string | null;
}

interface Comment {
  id: string;
  content: string;
  user: User;
  likes: number;
  dislikes: number;
  parentId?: string;
  replies: Comment[];
}

const Comments: React.FC<{ comments: Comment[] }> = ({ comments }) => {
  const [commentList, setCommentList] = useState<Comment[]>(comments);
  const [newComment, setNewComment] = useState<string>('');
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const handleNewComment = async () => {
    if (!newComment) return;
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/comments", {
        content: newComment,
        user: { id: "1", name: "John Doe", avatar: "path/to/avatar.png" },
      });
      setCommentList([...commentList, response.data]);
      setNewComment("");
      setShowDialog(false);
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyContent) return;
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:3000/comments/${commentId}/replies`, {
        content: replyContent,
        user: { id: "1", name: "John Doe", avatar: "path/to/avatar.png" },
      });
      setCommentList(commentList.map((c) => (c.id === commentId ? response.data : c)));
      setReplyCommentId(null);
      setReplyContent('');
    } catch (error) {
      console.error("Error replying to comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const response = await axios.patch(`http://localhost:3000/comments/${commentId}/like`);
      setCommentList(commentList.map((c) => (c.id === commentId ? response.data : c)));
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislike = async (commentId: string) => {
    try {
      const response = await axios.patch(`http://localhost:3000/comments/${commentId}/dislike`);
      setCommentList(commentList.map((c) => (c.id === commentId ? response.data : c)));
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  const renderComments = (commentList: Comment[], parentId?: string) => {
    return commentList
      .filter((comment) => comment.parentId === parentId)
      .map((comment) => (
        <Paper key={comment.id} style={{ padding: "10px", marginTop: "10px" }}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Avatar src={comment.user.avatar ?? "default-avatar.png"} />
            </Grid>
            <Grid justifyContent="left" item xs zeroMinWidth>
              <Typography variant="h6" style={{ margin: 0, textAlign: "left" }}>
                {comment.user.name}
              </Typography>
              <Typography variant="body2" style={{ textAlign: "left" }}>
                {comment.content}
              </Typography>
              <Grid container direction="row" alignItems="center">
                <IconButton onClick={() => handleLike(comment.id)}>
                  <ThumbUp /> <Typography>{comment.likes}</Typography>
                </IconButton>
                <IconButton onClick={() => handleDislike(comment.id)}>
                  <ThumbDown /> <Typography>{comment.dislikes}</Typography>
                </IconButton>
                <Button onClick={() => setReplyCommentId(comment.id)}>Responder</Button>
              </Grid>
              {replyCommentId === comment.id && (
                <TextField
                  label="Responder"
                  variant="outlined"
                  fullWidth
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onBlur={() => handleReply(comment.id)}
                />
              )}
              {renderComments(comment.replies, comment.id)}
            </Grid>
          </Grid>
        </Paper>
      ));
  };

  return (
    <div>
      <Typography variant="h6">Comentarios</Typography>
      <Button variant="contained" color="primary" onClick={() => setShowDialog(true)}>
        Añadir un comentario
      </Button>
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Añadir un nuevo comentario</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comentario"
            type="text"
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleNewComment} color="primary">
            Añadir
          </Button>
        </DialogActions>
      </Dialog>
      {loading ? (
        <Typography>Cargando...</Typography>
      ) : (
        renderComments(commentList)
      )}
    </div>
  );
};

export default Comments;
