import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Avatar,
  Typography,
  IconButton,
  Grid,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  created: string;
  updated: string;
  member: {
    id: number;
    user: User;
  };
  parentComment: Comment | null;
  blogComments: Comment[];
  valoration: Array<{
    id: number;
    valoration: boolean;
  }>;
}

const Comments: React.FC<{ blogId: string; initialComments: Comment[] }> = ({ blogId, initialComments }) => {
  const [commentList, setCommentList] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState<string>('');
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const getMemberIdForBlog = async (blogId: string) => {
    const memberId = localStorage.getItem('memberId');
    const associationDetailsId = localStorage.getItem('association-details-id');
    if (!memberId) {
      console.error('No memberId found in localStorage');
      return null;
    }
    if (!associationDetailsId) {
      console.error('No association-details-id found in localStorage');
      return null;
    }
    try {
      const response = await axios.get(`http://localhost:3000/user-association/user/${memberId}`);
      console.log('User associations:', response.data);
      const userAssociations = response.data;
      const userAssociation = userAssociations.find((ua: any) => ua.association.id === parseInt(associationDetailsId, 10));
      console.log('memberId encontrado:', userAssociation ? userAssociation.id : null);
      return userAssociation ? userAssociation.id : null;
    } catch (error) {
      console.error('Error fetching user associations:', error);
      return null;
    }
  };

  const handleNewComment = async () => {
    if (!newComment) return;
    try {
      setLoading(true);
      const memberId = await getMemberIdForBlog(blogId);
      console.log('memberId:', memberId);
      if (!memberId) {
        console.error('No valid memberId found');
        setLoading(false);
        return;
      }
      const newCommentData = {
        blog: { id: parseInt(blogId, 10) },
        member: { id: memberId },
        parentComment: null,
        content: newComment,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      };
      const response = await axios.post('http://localhost:3000/blog-comment', newCommentData);
      console.log(response.data);
      setCommentList((prevComments) => [...prevComments, response.data]);
      setNewComment('');
      setShowDialog(false);
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyContent) return;
    try {
      setLoading(true);
      const memberId = await getMemberIdForBlog(blogId);
      if (!memberId) {
        console.error('No valid memberId found');
        setLoading(false);
        return;
      }
      const replyData = {
        blog: { id: parseInt(blogId, 10) },
        member: { id: memberId },
        parentComment: { id: commentId },
        content: replyContent,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      };
      const response = await axios.post('http://localhost:3000/blog-comment', replyData);
      setCommentList((prevComments) =>
        prevComments.map((c) =>
          c.id === commentId ? { ...c, blogComments: [...c.blogComments, response.data] } : c
        )
      );
      setReplyCommentId(null);
      setReplyContent('');
    } catch (error) {
      console.error('Error replying to comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValoration = async (commentId: string, valoration: boolean) => {
    try {
      const memberId = await getMemberIdForBlog(blogId);
      if (!memberId) {
        console.error('No valid memberId found');
        return;
      }

      const valorationData = {
        valoration: valoration,
        userAssociation: memberId,
        blogComment: commentId,
      };

      await axios.post('http://localhost:3000/valoration', valorationData);

      setCommentList((prevComments) =>
        prevComments.map((c) =>
          c.id === commentId
            ? {
                ...c,
                valoration: [
                  ...c.valoration.filter((v) => v.userAssociation !== memberId),
                  { id: new Date().getTime(), valoration: valoration },
                ],
              }
            : c
        )
      );
    } catch (error) {
      console.error('Error submitting valoration:', error);
    }
  };

  const renderComments = (commentList: Comment[], parentId?: string) => {
    return commentList
      .filter((comment) => (parentId ? comment.parentComment && comment.parentComment.id === parentId : !comment.parentComment))
      .map((comment) => {
        const likes = comment.valoration.filter((v) => v.valoration).length;
        const dislikes = comment.valoration.length - likes;

        return (
          <Paper key={comment.id} style={{ padding: '10px', marginTop: '10px' }}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid item>
                <Avatar src={comment.member.user.avatar || 'default-avatar.png'} />
              </Grid>
              <Grid justifyContent="left" item xs zeroMinWidth>
                <Typography variant="h6" style={{ margin: 0, textAlign: 'left' }}>
                  {comment.member.user.name}
                </Typography>
                <Typography variant="body2" style={{ textAlign: 'left' }}>
                  {comment.content}
                </Typography>
                <Grid container direction="row" alignItems="center">
                  <IconButton onClick={() => handleValoration(comment.id, true)}>
                    <ThumbUp /> <Typography>{likes}</Typography>
                  </IconButton>
                  <IconButton onClick={() => handleValoration(comment.id, false)}>
                    <ThumbDown /> <Typography>{dislikes}</Typography>
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
                {renderComments(comment.blogComments, comment.id)}
              </Grid>
            </Grid>
          </Paper>
        );
      });
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
