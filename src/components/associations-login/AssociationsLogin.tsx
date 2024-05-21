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
  IonIcon
} from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import './AssociationsLogin.css';  // Asegúrate de que el archivo CSS esté en la ruta correcta

const AssociationLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/association/login', {
        email: email,
        password: password
      });

      setLoading(false); // Update loading state
      const associationId = response.data && response.data.id;

      if (associationId) {
        localStorage.setItem('associationId', associationId); // Save the association ID to local storage
        console.log('Login successful:', response.data);
        history.push('/association-dashboard'); // Redirect to association dashboard
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
          <IonTitle>Association Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="login-content">
      <div style={{ height: '50px' }}></div>
        <div className="login-container">  
          <IonCard className="login-card">
            <IonCardContent>
              <IonAvatar className="login-avatar">
                <IonImg src="../../../resources/logo.png" />
              </IonAvatar>
              <form onSubmit={handleLogin}>
                <IonItem className="login-item">
                  <IonLabel className="login-label" position="stacked">Email address</IonLabel>
                  <IonInput className="login-input" type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} />
                </IonItem>
                <IonItem className="login-item" lines="none">
                  <IonLabel className="login-label" position="stacked">Password</IonLabel>
                  <IonInput className="login-input" type={showPassword ? 'text' : 'password'} value={password} onIonChange={e => setPassword(e.detail.value!)} />
                  <IonButton slot="end" fill="clear" className="password-toggle-button" onClick={() => setShowPassword(!showPassword)}>
                    <IonIcon icon={showPassword ? eyeOff : eye} />
                  </IonButton>
                </IonItem>
                <IonButton type="submit" expand="block" className="login-button">Sign In</IonButton>
              </form>
            </IonCardContent>
            <IonButton expand="block" fill="clear" className="login-button-clear" onClick={() => history.push('/user-register')}>
              Register as User
            </IonButton>
            <IonButton expand="block" fill="clear" className="login-button-clear" onClick={() => history.push('/association-register')}>
              Register as Association
            </IonButton>
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

export default AssociationLogin;