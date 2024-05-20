import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon
} from '@ionic/react';
import { personCircleOutline, logOutOutline } from 'ionicons/icons';

const Home: React.FC<{ name: string }> = ({ name }) => {
  const history = useHistory();

  const handleProfileClick = () => {
    history.push('/user');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('memberId');
    history.push('/');
    window.location.reload(); 
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleProfileClick}>
              <IonIcon icon={personCircleOutline} />
              Profile
            </IonButton>
            <IonButton onClick={handleLogoutClick}>
              <IonIcon icon={logOutOutline} />
              Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">Home</IonContent>
    </>
  );
};

export default Home;


