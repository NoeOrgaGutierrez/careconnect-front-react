import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonImg,
} from "@ionic/react";
import axios from "axios";
import "./Login.css";

const Login: React.FC<{ name: string }> = ({ name }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const corsProxy = "https://cors-anywhere.herokuapp.com/";
    const apiUrl = "http://localhost:3000/user/login"; // La URL del endpoint de tu API

    try {
      const response = await axios.post(corsProxy + apiUrl, {
        email: email, // Asegúrate de que estas variables están definidas en tu componente o contexto
        password: password,
      });

      // Suponiendo que la API retorna datos del usuario en caso de éxito
      console.log("Login successful:", response.data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Sign In to {name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="login-content">
        <div className="login-container">
          <IonImg src="../../../resources/Logo.png" />
          <IonList>
            <IonItem>
              <IonLabel position="floating">Username or email address</IonLabel>
              <IonInput
                type="text"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
              />
            </IonItem>
          </IonList>
          <IonButton expand="block" onClick={handleLogin}>
            Sign In
          </IonButton>
          <IonButton fill="clear" expand="full">
            Create an Account
          </IonButton>
          <IonButton fill="clear" expand="full">
            Association Sign In
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
