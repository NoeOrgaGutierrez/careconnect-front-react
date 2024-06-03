import {
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonRouterLink,
} from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import React from "react";
import { Button, Grid, Typography, Box, styled } from "@mui/material";

// Estilos para HeroSection
const HeroSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  background: "linear-gradient(to right, #00c6ff, #0072ff)",
  color: "#fff",
  padding: theme.spacing(4),
  textAlign: "center",
  marginTop: "-50px",
}));

// Estilos para FeaturesSection
const FeaturesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 4),
}));

// Estilos para FeatureItem
const FeatureItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

// Estilos personalizados para IonHeader
const StyledIonHeader = styled(IonHeader)(({ theme }) => ({
  background: "linear-gradient(to right, #00c6ff, #0072ff)",
  color: "#fff",
}));

const StyledIonToolbar = styled(IonToolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const StyledIonTitle = styled(IonTitle)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  fontSize: "1.5rem",
  fontWeight: "bold",
}));

const Landing: React.FC = () => {
  return (
    <>
      <StyledIonHeader>
        <StyledIonToolbar>
          <StyledIonTitle>Landing</StyledIonTitle>
          <IonButtons slot="end">
            <IonButton size="large">
              <IonRouterLink routerLink="/login">
                <IonIcon icon={personCircleOutline} />
              </IonRouterLink>
            </IonButton>
          </IonButtons>
        </StyledIonToolbar>
      </StyledIonHeader>
      <IonContent>
        <HeroSection>
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
        </HeroSection>
        <FeaturesSection>
  <Typography variant="h4" gutterBottom>
    Nuestras Características
  </Typography>
  <Grid container spacing={4}>
    <Grid item xs={12} md={4}>
      <FeatureItem>
        <Typography variant="h6" gutterBottom>
          Información Centralizada
        </Typography>
        <Typography>
          Accede a toda la información que necesitas en un solo lugar.
        </Typography>
      </FeatureItem>
    </Grid>
    <Grid item xs={12} md={4}>
      <FeatureItem>
        <Typography variant="h6" gutterBottom>
          Contenido Personalizado
        </Typography>
        <Typography>
          Recibe información y recursos adaptados a tus necesidades específicas.
        </Typography>
      </FeatureItem>
    </Grid>
    <Grid item xs={12} md={4}>
      <FeatureItem>
        <Typography variant="h6" gutterBottom>
          Interacción Social
        </Typography>
        <Typography>
          Conéctate con otros usuarios para compartir experiencias y apoyo.
        </Typography>
      </FeatureItem>
    </Grid>
  </Grid>
</FeaturesSection>


      </IonContent>
    </>
  );
};

export default Landing;
