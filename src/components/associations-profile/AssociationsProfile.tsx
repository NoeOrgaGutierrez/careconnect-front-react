import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonText,
  IonLoading,
  IonAlert
} from '@ionic/react';
import axios from 'axios';

import './AssociationsProfile.css';

interface Association {
  id: number;
  name: string;
  miniDescription: string;
  description: string;
  logo: string;
  banner: string;
}

const AssociationProfile: React.FC = () => {
  const [association, setAssociation] = useState<Association | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchAssociation = async () => {
      setLoading(true);
      const associationId = localStorage.getItem('associationId');
      try {
        const response = await axios.get(`http://localhost:3000/association/findOne/${associationId}`);
        setAssociation(response.data);
      } catch (error) {
        setAlertMessage('Error fetching association data. Please try again later.');
        setShowAlert(true);
        console.error('Error fetching association data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssociation();
  }, []);

  if (loading) {
    return <IonLoading isOpen={loading} message="Please wait..." />;
  }

  if (showAlert) {
    return (
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Error"
        message={alertMessage}
        buttons={['OK']}
      />
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{association ? association.name : 'Association Profile'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="association-profile-content">
        {association && (
          <>
            <div className="banner-container">
              <IonImg src={association.banner} className="association-banner" />
            </div>
            <IonGrid>
              <IonRow>
                <IonCol size="12" className="ion-text-center">
                  <div className="association-avatar-container">
                    <IonImg src={association.logo} className="association-avatar" />
                  </div>
                  <IonText className="association-name">{association.name}</IonText>
                  <IonText className="association-meta">50 miembros | 50 Blogs</IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonSegment>
                    <IonSegmentButton value="inicio">
                      <IonLabel>Inicio</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="blogs">
                      <IonLabel>Blogs</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="faq">
                      <IonLabel>FAQ</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="miembros">
                      <IonLabel>Miembros</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonText className="association-section-title">Nuestro objetivo</IonText>
                  <IonText className="association-description">
                    {association.description}
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AssociationProfile;
