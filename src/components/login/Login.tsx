import React, { useState } from 'react';
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
  IonLoading,
  IonAlert,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import './Login.css';  // Asegúrate de que el archivo CSS esté en la ruta correcta

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/user/login', {
        email: email,
        password: password
      });

      setLoading(false); // Update loading state
      const userId = response.data && response.data.id;

      if (userId) {
        localStorage.setItem('memberId', userId); // Save the user ID to local storage
        console.log('Login successful:', response.data);
        history.push('/'); // Redirect to home page
        window.location.reload(); // Reload the page to apply the login state
      } else {
        setAlertMessage('Invalid login credentials. Please check and try again.');
        setShowAlert(true); // Show alert message
      }
    } catch (error) {
      setLoading(false); // Update loading state
      setAlertMessage('Connection error. Please try again later.');
      setShowAlert(true); // Show alert message
      console.error('Login failed:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>User Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="login-content">
        <div className="login-container">  {/* Nuevo contenedor para asegurar centrado */}
          <IonCard className="login-card">
            <IonCardContent>
              <IonAvatar style={{ margin: 'auto', marginBottom: '1rem' }}>
                <IonImg src="../../../resources/logo.png" />
              </IonAvatar>
              <form onSubmit={handleLogin}>
                <IonItem>
                  <IonLabel position="stacked">Email address</IonLabel>
                  <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Password</IonLabel>
                  <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
                </IonItem>
                <IonButton type="submit" expand="block" className="login-button">Sign In</IonButton>
              </form>
            </IonCardContent>
            <IonButton expand="block" fill="clear">Register</IonButton>
            <IonButton expand="block" fill="clear">Association Login</IonButton>
          </IonCard>
        </div>
        {loading && <IonLoading isOpen={loading} message="Please wait..." />}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Authentication Error"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
