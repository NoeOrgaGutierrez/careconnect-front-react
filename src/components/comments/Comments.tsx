import React, { useState } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonChip,
  IonAvatar,
  IonLabel,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, IconButton, Grid } from '@mui/material';
import { chatboxOutline, thumbsUp, thumbsDown } from 'ionicons/icons';
import axiosInstance from '../../axiosconfig';
import { AxiosError } from 'axios';
import './Comments.css';

interface User {
  id: string;
  name: string;
  avatar: string | null;
}

interface Valoration {
  id: number;
  valoration: boolean;
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
  valoration: Valoration[];
}

const Comments: React.FC<{ blogId: string; initialComments: Comment[] }> = ({ blogId, initialComments }) => {
  const [commentList, setCommentList] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState<string>('');
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showReplyDialog, setShowReplyDialog] = useState<boolean>(false);

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
      const response = await axiosInstance.get(`/user-association/user/${memberId}`);
      const userAssociations = response.data;
      const userAssociation = userAssociations.find(
        (ua: any) => ua.association.id === parseInt(associationDetailsId, 10)
      );
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
      const response = await axiosInstance.post('/blog-comment', newCommentData);
      setCommentList((prevComments) => [...prevComments, response.data]);
      setNewComment('');
      setShowDialog(false);
      window.location.reload();
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
      const response = await axiosInstance.post('/blog-comment', replyData);

      const updateComments = (comments: Comment[]): Comment[] =>
        comments.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, blogComments: [...comment.blogComments, response.data] };
          }
          return { ...comment, blogComments: updateComments(comment.blogComments) };
        });

      setCommentList((prevComments) => updateComments(prevComments));
      setReplyCommentId(null);
      setReplyContent('');
      setShowReplyDialog(false);
      window.location.reload();
    } catch (error) {
      console.error('Error replying to comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValoration = async (commentId: string, valoration: boolean) => {
    const memberId = await getMemberIdForBlog(blogId);
    if (!memberId) {
      console.error('No valid memberId found');
      return;
    }

    // Update UI optimistically
    const updateValoration = (comments: Comment[]): Comment[] =>
      comments.map((comment) => {
        if (comment.id === commentId) {
          const newValoration = [
            ...comment.valoration.filter((v) => v.id !== memberId),
            { id: new Date().getTime(), valoration },
          ];
          return { ...comment, valoration: newValoration };
        }
        return { ...comment, blogComments: updateValoration(comment.blogComments) };
      });

    setCommentList((prevComments) => updateValoration(prevComments));

    try {
      const valorationData = {
        valoration: valoration,
        userAssociation: { id: memberId },
        blogComment: { id: commentId },
      };

      await axiosInstance.post('/valoration', valorationData);
      window.location.reload();
    } catch (error) {
      console.error('Error submitting valoration:', error);
      // Revert UI update if there's an error
      setCommentList((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId) {
            const revertedValoration = comment.valoration.filter((v) => v.id !== memberId);
            return { ...comment, valoration: revertedValoration };
          }
          return { ...comment, blogComments: updateValoration(comment.blogComments) };
        })
      );
    }
  };

  const renderComments = (commentList: Comment[], level: number = 0) => {
    return commentList.map((comment) => {
      const likes = comment.valoration.filter((v) => v.valoration).length;
      const dislikes = comment.valoration.length - likes;

      return (
        <IonCard key={comment.id} className={`comment-level-${level}`} style={{ border: '2px solid #347ec7 ', borderRadius: '10px' }}>
          <IonCardHeader>
            <IonChip className='comment-chip'>
              <IonAvatar>
                <img alt='User Avatar' src={comment.member.user.avatar || 'default-avatar.png'} />
              </IonAvatar>
              <IonLabel>{comment.member.user.name}</IonLabel>
            </IonChip>
          </IonCardHeader>
          <IonCardContent>
            <Typography variant="body1">{comment.content}</Typography>
            <Grid container direction="row" alignItems="center">
              <IconButton onClick={() => handleValoration(comment.id, true)}>
                <IonIcon icon={thumbsUp} style={{ color: likes > 0 ? 'green' : 'inherit' }} />
                <Typography>{likes}</Typography>
              </IconButton>
              <IconButton onClick={() => handleValoration(comment.id, false)}>
                <IonIcon icon={thumbsDown} style={{ color: dislikes > 0 ? 'red' : 'inherit' }} />
                <Typography>{dislikes}</Typography>
              </IconButton>
              <IonButton fill="clear" size="small" onClick={() => {
                setReplyCommentId(comment.id);
                setShowReplyDialog(true);
              }}>
                <IonIcon icon={chatboxOutline} slot="start" />
                Responder
              </IonButton>
            </Grid>
            {renderComments(comment.blogComments, level + 1)}
          </IonCardContent>
        </IonCard>
      );
    });
  };

  const CommonDialog: React.FC<{
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
  }> = ({ open, onClose, onSubmit, title, value, setValue }) => (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="dialog-title">{title}</DialogTitle>
      <DialogContent className="dialog-content">
        <TextField
          autoFocus
          margin="dense"
          label={title}
          type="text"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="text-field"
        />
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onSubmit} color="primary">
          {title}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <div>
      <Typography variant="h6">Comentarios</Typography>
      {loading ? (
        <Typography>Cargando...</Typography>
      ) : (
        renderComments(commentList)
      )}
      <CommonDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={handleNewComment}
        title="Añadir un nuevo comentario"
        value={newComment}
        setValue={setNewComment}
      />
      <CommonDialog
        open={showReplyDialog}
        onClose={() => setShowReplyDialog(false)}
        onSubmit={() => replyCommentId && handleReply(replyCommentId)}
        title="Responder comentario"
        value={replyContent}
        setValue={setReplyContent}
      />
      <div style={{ height: '50px' }}></div>
    </div>
  );
};

export default Comments;
