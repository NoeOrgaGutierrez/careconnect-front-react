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
  IonAlert,
  IonButton,
  IonIcon,
  IonButtons,
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { useParams, useHistory } from "react-router-dom";
import axiosInstance from "../../axiosconfig";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AxiosError } from "axios";
import LoadingSpinner from "../LoadingSpinner";

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
        const response = await axiosInstance.get(`/association/findOne/${id}`);
        setAssociation(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          setAlertMessage(
            "Error al obtener datos de la asociación. Por favor, inténtelo de nuevo más tarde."
          );
          setShowAlert(true);
          console.error("Error fetching association data:", error);
        } else {
          setAlertMessage(
            "An unexpected error occurred. Please try again later."
          );
          setShowAlert(true);
          console.error("Unexpected error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssociation();
  }, [id]);

  const handleSegmentChange = async (value: string) => {
    setCurrentSegment(value);
    if (value === "blogs") {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/blog/association/${id}`);
        setAssociation((prev) => ({
          ...prev!,
          blogs: response.data,
        }));
      } catch (error) {
        // error handling code
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewBlog = (blogId: number) => {
    history.push(`/blog-details/${blogId}`);
  };

  const handleBackClick = () => {
    history.push("/associations");
    window.location.reload();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {association ? association.name : "Perfil de la Asociación"}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleBackClick}>
              <IonIcon icon={arrowBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="association-profile-content">
        <LoadingSpinner isOpen={loading} imageUrl="resources/Icono.png" />
        {showAlert && (
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header="Error"
            message={alertMessage}
            buttons={["OK"]}
          />
        )}
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
                    {association.blogs.length} blogs | {association.faq.length}{" "}
                    FAQs
                  </IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonSegment
                    value={currentSegment}
                    onIonChange={(e) =>
                      handleSegmentChange(
                        e.detail.value?.toString() ?? "defaultValue"
                      )
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
                    <Grid container spacing={3}>
                      {association.blogs.map((blog) => (
                        <Grid item xs={12} sm={6} md={4} key={blog.id} >
                          <Card style={{ border: '2px solid #265c91 ', borderRadius: '10px' }}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              height: "100%",
                              backgroundColor: "#a8ddec",
                              color: "#fff",
                              borderRadius: "15px",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{ color: "#bb86fc" }}
                              >
                                {blog.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ color: "#e0e0e0" }}
                              >
                                {blog.description}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Button
                                size="small"
                                color="primary"
                                onClick={() => handleViewBlog(blog.id)}
                              >
                                Ver Blog
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                  {currentSegment === "faq" && (
                    <div>
                      {association.faq.map((faq) => (
                        <Accordion key={faq.id} sx={{ backgroundColor: "#a8ddec", color: "#ffffff" }}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: "#bb86fc" }} />}
                            aria-controls={`panel${faq.id}-content`}
                            id={`panel${faq.id}-header`}
                          >
                            <Typography>{faq.question}</Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ backgroundColor: "#d1f5ff", color: "#e0e0e0" }}>
                            <Typography>{faq.response}</Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </div>
                  )}
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
