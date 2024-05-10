import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonLabel, IonMenuButton, IonNote, IonTitle, IonToolbar } from '@ionic/react';

const Communities: React.FC<{ name: string }> = ({ name }) => {

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
            <IonContent class='ion-padding'>
                <h1>Communities</h1>
                <p>Connect with people like you</p>
                <IonNote color="medium">Latest posts</IonNote>
                <IonCard>
                    <IonCardHeader>
                        <IonChip style={{
                            width: 'fit-content',
                            maxWidth: '100%',
                            minWidth: 0
                        }}>
                            <IonAvatar>
                                <img alt="Silhouette of a person's head" src="https://img.freepik.com/foto-gratis/primer-plano-joven-exitoso-sonriendo-camara-pie-traje-casual-contra-fondo-azul_1258-65479.jpg?size=626&ext=jpg&ga=GA1.1.1488620777.1712793600&semt=ais" />
                            </IonAvatar>
                            <IonLabel>Noe Orga</IonLabel>
                        </IonChip>
                        <IonCardTitle>Don't know how to use Wheelchair</IonCardTitle>
                        <IonCardSubtitle>r/Wheelchair</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                    }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur tempus sapien, vitae semper lacus sollicitudin sit amet. Fusce urna tortor, rhoncus ac est id, porttitor facilisis urna. In ac.</IonCardContent>
                    <IonButton fill="clear" style={{ float: 'right', marginRight: '1' }}>VIEW POST</IonButton>
                </IonCard>
            </IonContent>
        </>
    );
};

export default Communities;
