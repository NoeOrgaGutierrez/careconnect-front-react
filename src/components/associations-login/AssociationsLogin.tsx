import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonAvatar,
  IonImg,
  IonAlert,
  IonCard,
  IonCardContent,
  IonIcon,
  IonButtons,
  IonRouterLink
} from '@ionic/react';
import { eye, eyeOff, arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { TextField, Box } from '@mui/material';
import axiosInstance from '../../axiosconfig';
import { AxiosError } from 'axios';

import './AssociationsLogin.css';  // Usamos el nuevo archivo CSS
import LoadingSpinner from '../LoadingSpinner';

const AssociationLogin: React.FC = () => {
  const [loginCode, setLoginCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/association/login', {
        loginCode: loginCode,
        password: password
      });

      setLoading(false);
      const associationId = response.data && response.data.id;

      if (associationId) {
        localStorage.setItem('associationId', associationId.toString());
        console.log('Login successful:', response.data);
        history.push('/associations-profile');
      } else {
        setAlertMessage('Invalid login credentials. Please check and try again.');
        setShowAlert(true);
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        if (error.response && error.response.status === 404) {
          setAlertMessage('Invalid login credentials. Please check and try again.');
          setShowAlert(true);
        } else {
          setAlertMessage('Connection error. Please try again later.');
          setShowAlert(true);
          console.error('Login failed:', error);
        }
      } else {
        setAlertMessage('An unexpected error occurred. Please try again later.');
        setShowAlert(true);
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader className="login-header">
        <IonToolbar>
          <IonTitle>Inicio de Sesión de Asociación</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="login-content">
        <div className="spacer"></div>
        <div className="login-container">
          <IonCard className="login-card">
            <IonCardContent>
              <IonAvatar className="login-avatar">
                <IonImg src="resources/Icono.png" />
              </IonAvatar>
              <form onSubmit={handleLogin}>
                <TextField
                  label="Código de Asociación"
                  type="text"
                  value={loginCode}
                  onChange={(e) => setLoginCode(e.target.value)}
                  variant="filled"
                  fullWidth
                  className="login-item"
                  margin="normal"
                  required
                  InputLabelProps={{ className: 'login-label' }}
                />
                <Box display="flex" alignItems="center" marginBottom={2} position="relative">
                  <TextField
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="filled"
                    fullWidth
                    required
                    className="login-item"
                    InputLabelProps={{ className: 'login-label' }}
                  />
                  <IonButton 
                    fill="clear" 
                    className="password-toggle-button" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <IonIcon slot="icon-only" icon={showPassword ? eyeOff : eye} color="black"/>
                  </IonButton>
                </Box>
                <IonButton type="submit" expand="block" className="login-button">
                  Iniciar Sesión
                </IonButton>
              </form>
            </IonCardContent>
            <div className="login-links">
              <IonRouterLink routerLink="/user-register" className="login-link">
                ¿No tienes una cuenta? Regístrate
              </IonRouterLink>
              <IonRouterLink routerLink="/login" className="login-link">
                ¿Eres un usuario? Inicia sesión aquí
              </IonRouterLink>
            </div>
          </IonCard>
        </div>
        <LoadingSpinner isOpen={loading} imageUrl="resources/Icono.png" />
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
