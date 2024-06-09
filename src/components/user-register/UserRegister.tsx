import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonAvatar,
  IonImg,
  IonAlert,
  IonCard,
  IonCardContent,
  IonIcon,
  IonRouterLink
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { TextField, Box } from '@mui/material';
import axiosInstance from '../../axiosconfig';
import { AxiosError } from 'axios';

import './UserRegister.css';
import { arrowBackOutline, eye, eyeOff } from 'ionicons/icons';
import LoadingSpinner from '../LoadingSpinner';

const UserRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [bio, setBio] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const userData = {
        name,
        surname,
        email,
        password,
        bio
      };

      const response = await axiosInstance.post('/user', userData);

      if (response.status === 201) {
        const userId = response.data.id;
        localStorage.setItem('memberId', userId.toString());
        console.log('Registration successful:', response.data);

        // Now upload the avatar
        if (avatar) {
          const formData = new FormData();
          formData.append('file', avatar);

          await axiosInstance.post(
            `/storage/upload/user/${userId}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          console.log('Avatar upload successful');
        }

        setLoading(false);
        history.push(`/`);
        window.location.reload();
      } else {
        setLoading(false);
        setAlertMessage('Registration failed. Please try again.');
        setShowAlert(true);
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        setAlertMessage('Connection error. Please try again later.');
        setShowAlert(true);
        console.error('Registration failed:', error);
      } else {
        setAlertMessage('An unexpected error occurred. Please try again later.');
        setShowAlert(true);
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 500,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(file, options);
        setAvatar(compressedFile);
      } catch (error) {
        console.error('Error compressing file:', error);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader className="register-header">
        <IonToolbar>
          <IonTitle>Registro de Usuario</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => { history.push('/'); window.location.reload(); }}>
              <IonIcon icon={arrowBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="register-content">
        <div className="spacer"></div>
        <div className="register-container">
          <IonCard className="register-card">
            <IonCardContent>
              <IonAvatar className="register-avatar">
                <IonImg
                  src={
                    avatar ? URL.createObjectURL(avatar) : 'resources/Logo.png'
                  }
                />
              </IonAvatar>
              <form onSubmit={handleRegister}>
                <TextField
                  label="Nombre"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="filled"
                  fullWidth
                  className="register-item"
                  margin="normal"
                  InputLabelProps={{ className: 'register-label' }}
                />
                <TextField
                  label="Apellido"
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  variant="filled"
                  fullWidth
                  className="register-item"
                  margin="normal"
                  InputLabelProps={{ className: 'register-label' }}
                />
                <TextField
                  label="Correo Electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="filled"
                  fullWidth
                  className="register-item"
                  margin="normal"
                  InputLabelProps={{ className: 'register-label' }}
                />
                <Box display="flex" alignItems="center" className="register-item password-container">
                  <TextField
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="filled"
                    fullWidth
                    className="register-item"
                    InputLabelProps={{ className: 'register-label' }}
                  />
                  <IonButton
                    fill="clear"
                    className="password-toggle-button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <IonIcon color="black" slot="icon-only" icon={showPassword ? eyeOff : eye} />
                  </IonButton>
                </Box>
                <Box display="flex" alignItems="center" className="register-item">
                  <label htmlFor="avatar-upload" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <img src="https://cdn-icons-png.flaticon.com/512/1828/1828926.png" alt="Upload Icon" style={{ width: '24px', height: '24px' }} />
                    <span style={{ marginLeft: '10px', color: 'black' }}>Seleccionar archivo</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                    id="avatar-upload"
                  />
                </Box>
                <TextField
                  label="Biografía"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  variant="filled"
                  fullWidth
                  margin="normal"
                  multiline
                  className="register-item"
                  InputLabelProps={{ className: 'register-label' }}
                />
                <IonButton type="submit" expand="block" className="register-button">
                  Registrar
                </IonButton>
              </form>
            </IonCardContent>
            <div className="login-buttons">
              <IonRouterLink routerLink="/login" className="login-link">
                Iniciar Sesión
              </IonRouterLink>
              <IonRouterLink routerLink="/associations-login" className="login-link">
                Inicio de Sesión de Asociación
              </IonRouterLink>
            </div>
          </IonCard>
        </div>
        <LoadingSpinner isOpen={loading} imageUrl="resources/Icono.png" />
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Error de Registro"
          message={alertMessage}
          buttons={['OK']}
        />
        <div style={{ height: '50px' }}></div>
      </IonContent>
    </IonPage>
  );
};

export default UserRegister;
