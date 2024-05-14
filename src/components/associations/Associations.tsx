import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Card, CardContent, CardActions, Button, Typography, CardMedia } from "@mui/material";

interface Association {
  id: number;
  name: string;
  miniDescription: string;
  description: string;
  logo: string;
  banner: string;
}

const Associations: React.FC<{ name: string }> = ({ name }) => {
  const location = useLocation();
  const [associations, setAssociations] = useState<Association[]>([]);

  useEffect(() => {
    const fetchAssociations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/association");
        console.log("Associations data:", response.data);
        setAssociations(response.data);
      } catch (error) {
        console.error("Error fetching associations", error);
      }
    };

    fetchAssociations();
  }, []);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        {associations.map((association) => (
          <Card key={association.id} style={{ marginBottom: '20px', backgroundColor: '#1e1e1e', color: '#ffffff' }}>
            <CardMedia
              component="img"
              style={{ height: '100px', objectFit: 'contain', backgroundColor: '#e0e0e0' }} // Ajustado para ser más pequeño y mostrar toda la imagen
              image={association.logo}
              alt={`Logo of ${association.name}`}
            />
            <CardContent>
              <Typography variant="h5" component="div">
                {association.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {association.miniDescription}
              </Typography>
              <Typography style={{ color: '#e0e0e0' }}>
                {association.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" style={{ color: '#bb86fc' }}>Learn More</Button>
            </CardActions>
          </Card>
        ))}
      </IonContent>
    </>
  );
};

export default Associations;
