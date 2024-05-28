import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonLoading,
  IonAlert,
} from '@ionic/react';
import { arrowUndoOutline } from 'ionicons/icons';
import Comments from './../comments/Comments';
import { Typography } from '@mui/material';

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

interface Blog {
  id: number;
  name: string;
  description: string;
  blogComments: Array<Comment>;
}

const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/blog/${id}`);
        setBlog(response.data);
      } catch (error) {
        setAlertMessage(
          "Error al obtener datos del blog. Por favor, inténtelo de nuevo más tarde."
        );
        setShowAlert(true);
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleBackClick = () => {
    history.goBack();
  };

  if (loading) {
    return <IonLoading isOpen={loading} message="Por favor espera..." />;
  }

  if (showAlert) {
    return (
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Error"
        message={alertMessage}
        buttons={["OK"]}
      />
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {blog ? blog.name : "Detalles del Blog"}
          </IonTitle>
          <IonButton slot="end" onClick={handleBackClick}>
            <IonIcon icon={arrowUndoOutline} />
            Volver
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="blog-details-content">
        {blog && (
          <>
            <Typography variant="h4">{blog.name}</Typography>
            <Typography variant="body1">{blog.description}</Typography>
            <Comments comments={blog.blogComments} />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BlogDetails;
