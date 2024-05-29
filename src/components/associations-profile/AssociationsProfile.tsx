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
import { arrowUndoOutline, trashOutline } from "ionicons/icons";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import { Button, Typography, Card, CardContent, CardActions, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";

import "./AssociationsProfile.css";

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

const AssociationProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [association, setAssociation] = useState<Association | null>(null);
  const [currentSegment, setCurrentSegment] = useState("inicio");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBlogName, setNewBlogName] = useState("");
  const [newBlogDescription, setNewBlogDescription] = useState("");

  useEffect(() => {
    const fetchAssociation = async () => {
      const associationId = localStorage.getItem("associationId");
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/association/findOne/${associationId}`);
        setAssociation(response.data);
      } catch (error) {
        setAlertMessage("Error fetching association data. Please try again later.");
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
    history.push("/login");
    window.location.reload();
  };

  const handleSegmentChange = (value: string) => {
    setCurrentSegment(value);
  };

  const handleViewBlog = (blogId: number) => {
    history.push(`/blog-details/${blogId}`);
  };

  const handleCreateBlog = async () => {
    if (!newBlogName || !newBlogDescription || !association) return;

    const newBlog = {
      name: newBlogName,
      description: newBlogDescription,
      association: { id: association.id },
      blogComments: [],
      pins: []
    };

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/blog", newBlog);
      setAssociation((prev) => ({
        ...prev!,
        blogs: [...prev!.blogs, response.data]
      }));
      setNewBlogName("");
      setNewBlogDescription("");
      setDialogOpen(false);
    } catch (error) {
      setAlertMessage("Error creating new blog. Please try again later.");
      setShowAlert(true);
      console.error("Error creating new blog:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <IonLoading isOpen={loading} message="Please wait..." />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {association ? association.name : "Perfil de la Asociación"}
          </IonTitle>
          <IonButton slot="end" onClick={deleteAssociation}>
            <IonIcon icon={arrowUndoOutline} />
            Home
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
                    <IonImg src={association.logo} className="association-avatar" />
                  </div>
                  <IonText className="association-name">
                    {association.name}
                  </IonText>
                  <IonText className="association-meta">
                    {association.members.length} miembros |{" "}
                    {association.faq.length} FAQs
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
                    <IonSegmentButton value="miembros">
                      <IonLabel>Miembros</IonLabel>
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
                    <>
                      <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
                        Crear Nuevo Blog
                      </Button>
                      <Grid container spacing={3} style={{ marginTop: '20px' }}>
                        {association.blogs && association.blogs.length > 0 ? (
                          association.blogs.map(blog => (
                            <Grid item xs={12} sm={6} md={4} key={blog.id}>
                              <Card style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff', color: '#000', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                <CardContent style={{ flexGrow: 1 }}>
                                  <Typography gutterBottom variant="h5" component="div" style={{ color: '#000' }}>
                                    {blog.name}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary" style={{ color: '#555' }}>
                                    {blog.description}
                                  </Typography>
                                </CardContent>
                                <CardActions>
                                  <Button size="small" color="primary" onClick={() => handleViewBlog(blog.id)}>
                                    Ver Blog
                                  </Button>
                                </CardActions>
                              </Card>
                            </Grid>
                          ))
                        ) : (
                          <Typography>No hay blogs disponibles</Typography>
                        )}
                      </Grid>
                    </>
                  )}
                  {currentSegment === "faq" &&
                    association.faq.map((faq) => (
                      <div key={faq.id} className="faq-item">
                        <p>
                          <strong>P:</strong> {faq.question}
                        </p>
                        <p>
                          <strong>R:</strong> {faq.response}
                        </p>
                      </div>
                    ))}
                  {currentSegment === "miembros" &&
                    association.members.map((member) => (
                      <div key={member.id} className="member-item">
                        <p>
                          {member.user.name} ({member.user.email})
                        </p>
                      </div>
                    ))}
                </IonCol>
              </IonRow>
            </IonGrid>
          </>
        )}
      </IonContent>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Error"
        message={alertMessage}
        buttons={["OK"]}
      />
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Crear Nuevo Blog</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del Blog"
            type="text"
            fullWidth
            value={newBlogName}
            onChange={(e) => setNewBlogName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Descripción"
            type="text"
            fullWidth
            value={newBlogDescription}
            onChange={(e) => setNewBlogDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateBlog} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </IonPage>
  );
};

export default AssociationProfile;
