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
  IonTextarea
} from '@ionic/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { TextField, Box } from '@mui.material';

import './UserRegister.css';  // Asegúrate de que el archivo CSS esté en la ruta correcta

const UserRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [bio, setBio] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setLoading(true);

    try {
      const userData = {
        name,
        surname,
        email,
        password,
        bio
      };

      const response = await axios.post('http://localhost:3000/user', userData);

      if (response.status === 201) {
        const userId = response.data.id;
        localStorage.setItem('memberId', userId.toString()); // Save the user ID to local storage
        console.log('Registration successful:', response.data);

        // Now upload the avatar
        if (avatar) {
          const formData = new FormData();
          formData.append('file', avatar);

          await axios.post(`http://localhost:3000/storage/upload/user/${userId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('Avatar upload successful');
        }

        setLoading(false); // Update loading state
        history.push('/'); // Redirect to home page
        window.location.reload(); // Reload the page to apply the login state
      } else {
        setLoading(false); // Update loading state
        setAlertMessage('Registration failed. Please try again.');
        setShowAlert(true); // Show alert message
      }
    } catch (error) {
      setLoading(false); // Update loading state
      setAlertMessage('Connection error. Please try again later.');
      setShowAlert(true); // Show alert message
      console.error('Registration failed:', error);
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
      <IonHeader>
        <IonToolbar>
          <IonTitle>User Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="register-content">
        <div className="register-container">
          <IonCard className="register-card">
            <IonCardContent>
              <IonAvatar className="register-avatar">
                <IonImg src={avatar ? URL.createObjectURL(avatar) : "../../../resources/Logo.png"} />
              </IonAvatar>
              <form onSubmit={handleRegister}>
                <TextField 
                  label="Name" 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  variant="outlined" 
                  fullWidth 
                  margin="normal"
                />
                <TextField 
                  label="Surname" 
                  type="text" 
                  value={surname} 
                  onChange={e => setSurname(e.target.value)} 
                  variant="outlined" 
                  fullWidth 
                  margin="normal"
                />
                <TextField 
                  label="Email" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  variant="outlined" 
                  fullWidth 
                  margin="normal"
                />
                <TextField 
                  label="Password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  variant="outlined" 
                  fullWidth 
                  margin="normal"
                />
                <IonItem className="register-item">
                  <IonLabel className="register-label" position="stacked">Avatar</IonLabel>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} />
                </IonItem>
                <TextField 
                  label="Bio" 
                  value={bio} 
                  onChange={e => setBio(e.target.value)} 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                  multiline 
                  rows={4}
                />
                <IonButton type="submit" expand="block" className="register-button">Register</IonButton>
              </form>
            </IonCardContent>
            <IonButton expand="block" fill="clear" className="login-button-clear" onClick={() => history.push('/login')}>
              User Login
            </IonButton>
            <IonButton expand="block" fill="clear" className="login-button-clear" onClick={() => history.push('/associations-login')}>
              Association Login
            </IonButton>
          </IonCard>
        </div>
        {loading && <IonLoading isOpen={loading} message="Please wait..." />}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Registration Error"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default UserRegister;

