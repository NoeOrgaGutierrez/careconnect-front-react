import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonList,
} from "@ionic/react";
import { useHistory } from 'react-router-dom';

interface Publication {
  id: number;
  name: string;
  description: string;
  user: {
    id: number;
    name: string;
    surname: string;
    avatar: string | null;
  };
  topic: {
    id: number;
    name: string;
    description: string;
  };
}

const Communities: React.FC<{ name: string }> = ({ name }) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filterName, setFilterName] = useState<string>('');
  const [filterNumber, setFilterNumber] = useState<string>('');
  const history = useHistory();

  useEffect(() => {
    axios.get('http://localhost:3000/publication')
      .then(response => {
        setPublications(response.data);
        console.log('Publications:', response.data);
      })
      .catch(error => {
        console.error('Error fetching publications:', error);
      });
  }, []);

  const handleFilter = () => {
    alert(`Filter Name: ${filterName}, Filter Number: ${filterNumber}`);
  };

  const handleViewPost = (id: number) => {
    history.push(`/communities-details/${id}`);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <h1>Communities</h1>
        <p>Connect with people like you</p>
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Filter by Name</IonLabel>
            <IonInput
              value={filterName}
              placeholder="Enter Name"
              onIonChange={(e) => setFilterName(e.detail.value!)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Filter by Number</IonLabel>
            <IonInput
              value={filterNumber}
              placeholder="Enter Number"
              onIonChange={(e) => setFilterNumber(e.detail.value!)}
            />
          </IonItem>
          <IonButton expand="full" onClick={handleFilter}>Apply Filter</IonButton>
        </IonList>
        {publications.map((publication) => (
          <IonCard key={publication.id}>
            <IonCardHeader>
              <IonChip
                style={{
                  width: "fit-content",
                  maxWidth: "100%",
                  minWidth: 0,
                }}
              >
                <IonAvatar>
                  <img
                    alt="User Avatar"
                    src={publication.user.avatar || 'https://via.placeholder.com/150'}
                  />
                </IonAvatar>
                <IonLabel>{publication.user.name} {publication.user.surname}</IonLabel>
              </IonChip>
              <IonCardTitle>{publication.name}</IonCardTitle>
              <IonCardSubtitle>Topico/{publication.topic.name}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
            Descripción: {publication.description}
            </IonCardContent>
            <IonButton fill="clear" style={{ float: "right" }} onClick={() => handleViewPost(publication.id)}>
              VIEW POST
            </IonButton>
          </IonCard>
        ))}
      </IonContent>
    </>
  );
};

export default Communities;
