import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';
import { Grid } from '@mui/material';
const Calendar: React.FC<{ name: string }> = ({ name }) => {

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
            <IonContent class='ion-padding'>Calendar</IonContent>
        </>

    );
};

export default Calendar;
