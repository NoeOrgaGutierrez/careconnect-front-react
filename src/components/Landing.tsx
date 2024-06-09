import {
  IonButtons,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
  IonRouterLink,
} from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import React from "react";
import { Button, Grid, Typography, Box } from "@mui/material";
import "./Landing.css";

const Landing: React.FC = () => {
  return (
    <>
      <IonHeader className="styled-ion-header">
        <IonToolbar className="styled-ion-toolbar">
          <IonButtons slot="end">
            <IonButton className="styled-ion-button" size="large">
              <IonRouterLink routerLink="/login">
                <IonIcon icon={personCircleOutline} style={{ fontSize: "2rem", color: "#fff" }} />
              </IonRouterLink>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Box className="hero-section">
          <Typography variant="h2" gutterBottom>
            Bienvenido a CareConnect
          </Typography>
          <Typography variant="h5" paragraph sx={{ marginTop: "30px" }}>
            Transformando vidas, conectando corazones
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className="get-started"
            component={IonRouterLink}
            routerLink="/user-register"
          >
            <div>Únete y marca la diferencia</div>
          </Button>
        </Box>
        <Box className="features-section">
          <Typography variant="h4" gutterBottom>
            Nuestras Características
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box className="feature-item">
                <Typography variant="h6" gutterBottom>
                  Información Centralizada
                </Typography>
                <Typography>
                  Accede a toda la información que necesitas en un solo lugar.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className="feature-item">
                <Typography variant="h6" gutterBottom>
                  Contenido Personalizado
                </Typography>
                <Typography>
                  Recibe información y recursos adaptados a tus necesidades específicas.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className="feature-item">
                <Typography variant="h6" gutterBottom>
                  Interacción Social
                </Typography>
                <Typography>
                  Conéctate con otros usuarios para compartir experiencias y apoyo.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </IonContent>
    </>
  );
};

export default Landing;
