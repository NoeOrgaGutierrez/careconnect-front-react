import React, { useState } from "react";
import {
  IonAlert,
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
import { useHistory } from "react-router-dom";
import axios from "axios";

interface LoginProps {
  name: string;
  handleLogin: (status: boolean) => void; 
}

const Login: React.FC<LoginProps> = ({ name, handleLogin }) => {
  const history = useHistory();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  async function attemptLogin(event: any, form: any) {
    event.preventDefault();
    const email = form.email.value;
    const password = form.password.value;
    const response = await axios.post(
      "http://localhost:3000/user/login",
      { email, password },
      { validateStatus: () => true }
    );
    const success = response.data && response.data.id;
    handleLogin(success);
    if (success) history.push("/");
    else {
      setAlertMessage(
        "Datos de usuario inválidos. Por favor, verifique sus credenciales."
      );
      setShowAlert(true);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar Sesión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={(event) => attemptLogin(event, event.target)}>
          <IonAvatar style={{ margin: "auto", marginBottom: "1rem" }}>
            <IonImg src="../../../resources/logo.png" />
          </IonAvatar>
          <IonItem>
            <IonLabel position="stacked">
              <h1>Correo electrónico</h1>
            </IonLabel>
            <IonInput required type="text" name="email" />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">
              <h1>Contraseña</h1>
            </IonLabel>
            <IonInput required type="password" name="password" />
          </IonItem>
          <IonButton type="submit" expand="block">
            Iniciar Sesión
          </IonButton>
        </form>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"Error de Autenticación"}
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
