import { useLocation } from "react-router-dom";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

const Associations: React.FC<{ name: string }> = ({ name }) => {
  const location = useLocation();

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">Associations</IonContent>
    </>
  );
};

export default Associations;
