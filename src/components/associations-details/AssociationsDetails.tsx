import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonText,
  IonLoading,
  IonAlert,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { arrowUndoOutline } from "ionicons/icons";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import Comments from "./../comments/Comments";

import "./AssociationsDetails.css";
import { Typography } from "@mui/material";

interface Association {
  id: number;
  name: string;
  miniDescription: string;
  description: string;
  logo: string;
  banner: string;
  faq: Array<{ id: number; question: string; response: string }>;
  members: Array<{ id: number; user: { name: string; email: string } }>;
  blogs: Array<Blog>;
}
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

const AssociationsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [association, setAssociation] = useState<Association | null>(null);
  const [currentSegment, setCurrentSegment] = useState("inicio");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchAssociation = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/association/findOne/${id}`
        );
        setAssociation(response.data);
      } catch (error) {
        setAlertMessage(
          "Error al obtener datos de la asociación. Por favor, inténtelo de nuevo más tarde."
        );
        setShowAlert(true);
        console.error("Error fetching association data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssociation();
  }, [id]);

  const deleteAssociation = () => {
    localStorage.removeItem("associationId");
    history.push("/");
  };

  const handleSegmentChange = async (value: string) => {
    setCurrentSegment(value);
    if (value === "blogs") {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/blog/association/${id}`);
        setAssociation(prev => ({
          ...prev!,
          blogs: response.data,
        }));
      } catch (error) {
        setAlertMessage("Error al obtener blogs. Por favor, inténtelo de nuevo más tarde.");
        setShowAlert(true);
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    }
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

  const handleAssociationClick = () => {
    history.replace("/associations");
    window.location.reload();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {association ? association.name : "Perfil de la Asociación"}
          </IonTitle>
          <IonButton slot="end" onClick={handleAssociationClick}>
            <IonIcon icon={arrowUndoOutline} />
            Asociaciones
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="association-profile-content">
        {association && (
          <>
            <div className="banner-container">
              <IonImg src={association.banner} className="association-banner" />
            </div>
            <IonGrid>
              <IonRow>
                <IonCol size="12" className="ion-text-center">
                  <div className="association-avatar-container">
                    <IonImg
                      src={association.logo}
                      className="association-avatar"
                    />
                  </div>
                  <IonText className="association-name">
                    {association.name}
                  </IonText>
                  <IonText className="association-meta">
                    {association.members.length} miembros |{" "}
                    {association.faq.length} FAQ
                  </IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonSegment
                    value={currentSegment}
                    onIonChange={(e) =>
                      handleSegmentChange(e.detail.value?.toString() ?? "defaultValue")
                    }
                  >
                    <IonSegmentButton value="inicio">
                      <IonLabel>Inicio</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="blogs">
                      <IonLabel>Blogs</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="faq">
                      <IonLabel>FAQ</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  {currentSegment === "inicio" && (
                    <IonText className="association-description">
                      {association.description}
                    </IonText>
                  )}
                  {currentSegment === "blogs" && (
                    // Renderizar los blogs y comentarios
                    association.blogs.map(blog => (
                      <div key={blog.id}>
                        <Typography variant="h6">{blog.name}</Typography>
                        <Typography variant="body1">{blog.description}</Typography>
                        <Comments comments={blog.blogComments} />
                      </div>
                    ))
                  )}
                  {currentSegment === "faq" &&
                    // Renderizar preguntas frecuentes
                    association.faq.map((faq) => (
                      <div key={faq.id}>
                        <p>
                          <strong>P:</strong> {faq.question}
                        </p>
                        <p>
                          <strong>R:</strong> {faq.response}
                        </p>
                      </div>
                    ))}
                </IonCol>
              </IonRow>
            </IonGrid>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AssociationsDetails;
