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
  IonImg,
  IonList
} from '@ionic/react';
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  IconButton,
  Grid
} from '@mui/material';
import { chatboxOutline, thumbsUp, thumbsDown } from 'ionicons/icons';
import axiosInstance from '../../axiosconfig';
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

const Comments: React.FC<{ blogId: string; initialComments: Comment[] }> = ({
  blogId,
  initialComments
}) => {
  const [commentList, setCommentList] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState<string>('');
  const [replyToComment, setReplyToComment] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const defaultImageUrl =
    'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg';

  const handleError = (event: any) => {
    event.target.src = defaultImageUrl;
  };

  const getMemberIdForBlog = async (blogId: string) => {
    const memberId = localStorage.getItem('memberId');
    const associationDetailsId = localStorage.getItem('association-details-id');
    if (!memberId || !associationDetailsId) {
      console.error('No valid memberId or associationDetailsId found in localStorage');
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

  const handleReply = async () => {
    if (!replyContent || !replyToComment) return;
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
        parentComment: { id: replyToComment.id },
        content: replyContent,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      };
      const response = await axiosInstance.post('/blog-comment', replyData);

      const updateComments = (comments: Comment[]): Comment[] =>
        comments.map((comment) => {
          if (comment.id === replyToComment.id) {
            return {
              ...comment,
              blogComments: [...comment.blogComments, response.data]
            };
          }
          return { ...comment, blogComments: updateComments(comment.blogComments) };
        });

      setCommentList((prevComments) => updateComments(prevComments));
      setReplyToComment(null);
      setReplyContent('');
      setShowDialog(false);
    } catch (error) {
      console.error('Error replying to comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderComments = (commentList: Comment[], level: number = 0) => {
    return commentList.map((comment) => {
      const likes = comment.valoration.filter((v) => v.valoration).length;
      const dislikes = comment.valoration.length - likes;

      return (
        <IonCard
          key={comment.id}
          className={`comment-level-${level}`}
          style={{ border: '2px solid #347ec7 ', borderRadius: '10px', marginLeft: '10px' }}
        >
          <IonCardHeader>
            <IonChip className='comment-chip'>
              <IonAvatar>
                <IonImg
                  alt='User Avatar'
                  src={comment.member.user.avatar || defaultImageUrl}
                  onError={handleError}
                />
              </IonAvatar>
              <IonLabel>{comment.member.user.name}</IonLabel>
            </IonChip>
          </IonCardHeader>
          <IonCardContent>
            <Typography variant='body1'>{comment.content}</Typography>
            <Grid container direction='row' alignItems='center'>
              <IconButton onClick={() => handleValoration(comment.id, true)}>
                <IonIcon
                  icon={thumbsUp}
                  style={{ color: likes > 0 ? 'green' : 'inherit' }}
                />
                <Typography>{likes}</Typography>
              </IconButton>
              <IconButton onClick={() => handleValoration(comment.id, false)}>
                <IonIcon
                  icon={thumbsDown}
                  style={{ color: dislikes > 0 ? 'red' : 'inherit' }}
                />
                <Typography>{dislikes}</Typography>
              </IconButton>
              <IonButton
                fill='clear'
                size='small'
                onClick={() => {
                  setReplyToComment(comment);
                  setShowDialog(true);
                }}
              >
                <IonIcon icon={chatboxOutline} slot='start' />
                Responder
              </IonButton>
            </Grid>
            {renderComments(comment.blogComments, level + 1)}
          </IonCardContent>
        </IonCard>
      );
    });
  };

  return (
    <>
      <IonList>{renderComments(commentList)}</IonList>
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        fullWidth
        maxWidth='sm'
        PaperProps={{
          style: {
            backgroundColor: '#ffffff',
            color: 'white'
          }
        }}>
        <DialogTitle style={{ color: 'white' }}>
          {replyToComment ? 'Responder a Comentario' : 'Añadir Comentario'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Comentario'
            type='text'
            fullWidth
            multiline
            rows={4}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            InputProps={{
              style: {
                color: 'white'
              }
            }}
            InputLabelProps={{
              style: {
                color: 'white'
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowDialog(false)}
            color='primary'>
            Cancelar
          </Button>
          <Button onClick={handleReply} color='primary'>
            Responder
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Comments;
