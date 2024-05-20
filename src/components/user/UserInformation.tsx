import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonLabel,
  IonItem,
  IonList,
  IonIcon,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/react';
import axios from 'axios';
import { pencilOutline, arrowUndoOutline, star } from 'ionicons/icons';

import './UserInformation.css';
interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  avatar: string;
  bio: string;
}

interface Association {
  id: number;
  name: string;
  miniDescription: string;
  description: string;
  logo: string;
}

interface UserAssociation {
  id: number;
  association: Association;
}

import { useHistory, useLocation } from 'react-router-dom';

const UserInformation: React.FC<{ name: string }> = ({ name }) => {
  const [user, setUser] = useState<User | null>(null);
  const [associations, setAssociations] = useState<UserAssociation[]>([]);
  const location = useLocation();

  useEffect(() => {
    const memberId = localStorage.getItem('memberId');
    if (memberId) {
      axios.get(`http://localhost:3000/user/${memberId}`)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, []);

  const history = useHistory();

  const handleProfileClick = () => {
    history.replace('/');
    window.location.reload();
  };

  const handleAssociationClick = () => {
    const memberId = localStorage.getItem('memberId');
    if (memberId) {
      console.log(`http://localhost:3000/user-association/user/${memberId}`);
      axios.get(`http://localhost:3000/user-association/user/${memberId}`)
        .then(response => {
          console.log('Association successful:', response.data);
          setAssociations(response.data); // Guardar las asociaciones en el estado
        })
        .catch(error => console.error('Error associating user:', error));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleProfileClick}>
              <IonIcon icon={arrowUndoOutline} />
              Home
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        {user ? (
          <IonGrid>
            <IonRow>
              <IonCol size="12" size-md="4" className="ion-text-center">
                <IonAvatar style={{ margin: '0 auto', width: '150px', height: '150px' }}>
                  <img src={user.avatar} alt="Profile" />
                </IonAvatar>
                <h2>{user.name} {user.surname}</h2>
                <p>{user.email}</p>
                <p>{user.bio}</p>
                <IonButton onClick={handleAssociationClick} expand="block" color="primary">
                  Associate User
                </IonButton>
                <IonItem>
                  <IonLabel><strong>Rating:</strong></IonLabel>
                  {[...Array(5)].map((_, i) => (
                    <IonIcon key={i} icon={star} style={{ color: i < 4 ? 'gold' : 'gray' }} />
                  ))}
                </IonItem>
              </IonCol>
              <IonCol size="12" size-md="8">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Pinned Topics</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList lines="none">
                      <IonItem>
                        <IonLabel>
                          <h3>How to connect with your disabled students as a teacher</h3>
                          <p>5 new notifications</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Being the father of a child with cerebral palsy</h3>
                          <p>No new activities detected</p>
                        </IonLabel>
                      </IonItem>
                    </IonList>
                  </IonCardContent>
                </IonCard>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Recent Activity</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList lines="none">
                      <IonItem>
                        <IonLabel>
                          <h3>Sara has commented on your topic</h3>
                          <p>I think it's a great way to start comm...</p>
                        </IonLabel>
                        <IonLabel slot="end">40m ago</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Pablo upvoted your topic</h3>
                          <p>How to treat children when they don’t...</p>
                        </IonLabel>
                        <IonLabel slot="end">2h ago</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Ernesto has joined your community</h3>
                          <p>Physically disabled parents</p>
                        </IonLabel>
                        <IonLabel slot="end">Yesterday</IonLabel>
                      </IonItem>
                    </IonList>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Calendar</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {/* Aquí podrías insertar un componente de calendario */}
                    <p>Calendar component placeholder</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
            {associations.length > 0 && (
              <IonRow>
                <IonCol size="12">
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>My Joined Associations</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonGrid>
                        <IonRow>
                          {associations.map(assoc => (
                            <IonCol size="12" size-md="6" size-lg="4" key={assoc.id}>
                              <IonCard className="association-card">
                                <IonCardHeader>
                                  <IonCardTitle>{assoc.association.name}</IonCardTitle>
                                  <IonCardSubtitle>{assoc.association.miniDescription}</IonCardSubtitle>
                                </IonCardHeader>
                                <IonCardContent>
                                  <img src={assoc.association.logo} alt={assoc.association.name} style={{ width: '100%', height: 'auto', backgroundColor: 'white' }} />
                                  <p>{assoc.association.description}</p>
                                  <IonButton color="danger" size="small">Leave</IonButton>
                                  <IonButton fill="outline" size="small">Know more</IonButton>
                                </IonCardContent>
                              </IonCard>
                            </IonCol>
                          ))}
                        </IonRow>
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            )}
          </IonGrid>
        ) : (
          <IonLabel>Loading...</IonLabel>
        )}
      </IonContent>
    </IonPage>
  );
};

export default UserInformation;

