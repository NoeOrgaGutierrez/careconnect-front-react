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
        console.log("Associations data:", response.data);  // Ver qué datos llegan exactamente
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
          <Card key={association.id} style={{ marginBottom: '20px' }}>
            <CardMedia
              component="img"
              style={{ height: '140px', objectFit: 'contain' }} // Establecer altura y ajuste de objeto
              image={association.logo}
              alt={`Logo of ${association.logo}`}
            />
            <CardContent>
              <Typography variant="h5" component="div">
                {association.name}
              </Typography>
              <Typography variant="body2">
                {association.miniDescription}
              </Typography>
              <Typography color="textSecondary">
                {association.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Saber más</Button>
            </CardActions>
          </Card>
        ))}
      </IonContent>
    </>
  );
};

export default Associations;
