import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Card, CardContent, CardActions, Button, Typography, CardMedia, Grid } from "@mui/material";

interface Association {
  id: number;
  name: string;
  miniDescription: string;
  description: string;
  logo: string;
  banner: string;
}

interface UserAssociation {
  id: number;
  association: Association;
}

const Associations: React.FC<{ name: string }> = ({ name }) => {
  const location = useLocation();
  const [associations, setAssociations] = useState<Association[]>([]);
  const [userAssociations, setUserAssociations] = useState<UserAssociation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAssociations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/association");
        console.log("Associations data:", response.data);
        setAssociations(response.data);
        setLoading(false); // Set loading to false once data is received
      } catch (error) {
        console.error("Error fetching associations", error);
        setLoading(false); // Ensure loading is false in case of error too
      }
    };

    const fetchUserAssociations = async () => {
      try {
        const memberId = localStorage.getItem('memberId');
        if (memberId) {
          const response = await axios.get(`http://localhost:3000/user-association/user/${memberId}`);
          console.log("User Associations data:", response.data);
          setUserAssociations(response.data);
        }
      } catch (error) {
        console.error("Error fetching user associations", error);
      }
    };

    fetchAssociations();
    fetchUserAssociations();
  }, []);

  const isUserInAssociation = (associationId: number) => {
    return userAssociations.some(userAssociation => userAssociation.association.id === associationId);
  };

  const handleAssociationToggle = async (associationId: number) => {
    const memberId = localStorage.getItem('memberId');
    if (memberId) {
      if (isUserInAssociation(associationId)) {
        try {
          // Implement the logic to leave the association
          await axios.delete(`http://localhost:3000/user-association/user/${memberId}/association/${associationId}`);
          setUserAssociations(userAssociations.filter(userAssociation => userAssociation.association.id !== associationId));
        } catch (error) {
          console.error("Error leaving association", error);
        }
      } else {
        try {
          // Implement the logic to join the association
          await axios.post(`http://localhost:3000/user-association/user/${memberId}/association/${associationId}`);
          const newAssociation = associations.find(association => association.id === associationId);
          if (newAssociation) {
            setUserAssociations([...userAssociations, { id: Date.now(), association: newAssociation }]);
          }
        } catch (error) {
          console.error("Error joining association", error);
        }
      }
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ overflowY: "auto" }}>
        {loading ? (
          <IonLabel>Loading...</IonLabel>
        ) : associations.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {associations.map((association) => (
                <Grid item xs={12} sm={6} md={4} key={association.id}>
                  <Card 
                    style={{ 
                      marginBottom: '20px', 
                      backgroundColor: '#1e1e1e', 
                      color: '#ffffff', 
                      borderRadius: '15px', 
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%'
                    }}
                  >
                    <CardMedia
                      component="img"
                      style={{ height: '150px', objectFit: 'cover', backgroundColor: '#ffffff' }}
                      image={association.logo}
                      alt={`Logo of ${association.name}`}
                    />
                    <CardContent>
                      <Typography variant="h5" component="div" style={{ color: '#bb86fc' }}>
                        {association.name}
                      </Typography>
                      <Typography variant="body2" style={{ color: '#ffffff', marginBottom: '10px' }}>
                        {association.miniDescription}
                      </Typography>
                      <Typography variant="body2" style={{ color: '#e0e0e0' }}>
                        {association.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        style={{ color: '#bb86fc' }} 
                        onClick={() => handleAssociationToggle(association.id)}
                      >
                        {isUserInAssociation(association.id) ? "Leave" : "Join"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {/* Elemento vacío para el margen inferior */}
            <div style={{ height: '50px' }}></div>
          </>
        ) : (
          <IonLabel>No associations found.</IonLabel>
        )}
      </IonContent>
    </>
  );
};

export default Associations;