import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonAvatar,
  IonImg,
} from "@ionic/react";
import axios from "axios";

const Login: React.FC<{ name: string }> = ({ name }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const corsProxy = "https://cors-anywhere.herokuapp.com/";
    const apiUrl = "http://localhost:3000/user/login"; // La URL del endpoint de tu API

    try {
      const response = await axios.post(corsProxy + apiUrl, {
        email: email,
        password: password,
      });

      console.log("Login successful:", response.data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar Sesión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonAvatar style={{ margin: 'auto', marginBottom: '1rem' }}> {/* Centrado automáticamente */}
          <IonImg src="../../../resources/logo.png"  /> {/* Incluir la imagen del perfil */}
        </IonAvatar>
        <IonItem>
          <IonLabel position="floating">Correo electrónico</IonLabel>
          <IonInput type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Contraseña</IonLabel>
          <IonInput type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} />
        </IonItem>
        <IonButton expand="block" onClick={handleLogin}>Iniciar Sesión</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
