import { IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonRouterLink } from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import React from 'react';
const Communities: React.FC = () => {

    return (
        <>
        <IonHeader>
            <IonToolbar>
                <IonTitle slot="start">Landing</IonTitle>
                <IonButtons slot="end">
                    <IonButton size="large">
                        <IonRouterLink routerLink="/login">
                            <IonIcon icon={personCircleOutline} />
                        </IonRouterLink>
                    </IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
        <IonContent>
        </IonContent>
        </>
    );
};

export default Communities;

