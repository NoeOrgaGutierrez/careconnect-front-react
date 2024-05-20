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

import './UserRegister.css';  // Asegúrate de que el archivo CSS esté en la ruta correcta

const UserRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);
  const [bio, setBio] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/user', {
        name,
        surname,
        email,
        password,
        avatar: avatar?.toString(), // Asegúrate de que avatar sea una URL válida o null
        bio
      });

      setLoading(false); // Update loading state
      if (response.status === 201) {
        const userId = response.data.id;
        localStorage.setItem('memberId', userId.toString()); // Save the user ID to local storage
        console.log('Registration successful:', response.data);
        history.push('/'); // Redirect to home page
        window.location.reload(); // Reload the page to apply the login state
      } else {
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
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatar(reader.result);
        };
        reader.readAsDataURL(compressedFile);
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
                <IonImg src={avatar ? avatar.toString() : "../../../resources/default-avatar.png"} />
              </IonAvatar>
              <form onSubmit={handleRegister}>
                <IonItem className="register-item">
                  <IonLabel className="register-label" position="stacked">Name</IonLabel>
                  <IonInput className="register-input" type="text" value={name} onIonChange={e => setName(e.detail.value!)} />
                </IonItem>
                <IonItem className="register-item">
                  <IonLabel className="register-label" position="stacked">Surname</IonLabel>
                  <IonInput className="register-input" type="text" value={surname} onIonChange={e => setSurname(e.detail.value!)} />
                </IonItem>
                <IonItem className="register-item">
                  <IonLabel className="register-label" position="stacked">Email</IonLabel>
                  <IonInput className="register-input" type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} />
                </IonItem>
                <IonItem className="register-item">
                  <IonLabel className="register-label" position="stacked">Password</IonLabel>
                  <IonInput className="register-input" type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
                </IonItem>
                <IonItem className="register-item">
                  <IonLabel className="register-label" position="stacked">Avatar</IonLabel>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} />
                </IonItem>
                <IonItem className="register-item">
                  <IonLabel className="register-label" position="stacked">Bio</IonLabel>
                  <IonTextarea className="register-input" value={bio} onIonChange={e => setBio(e.detail.value!)} />
                </IonItem>
                <IonButton type="submit" expand="block" className="register-button">Register</IonButton>
              </form>
            </IonCardContent>
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
