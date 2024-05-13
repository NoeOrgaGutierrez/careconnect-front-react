import {
	IonButtons,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonButton,
	IonIcon,
	IonRouterLink
} from '@ionic/react'
import { personCircleOutline } from 'ionicons/icons'
import React from 'react'
import { Button, Grid } from '@mui/material'
const Communities: React.FC = () => {
	return (
		<>
			<Button variant='contained'>Contained</Button>
			<IonHeader>
				<IonToolbar>
					<IonTitle slot='start'>Landing</IonTitle>
					<IonButtons slot='end'>
						<IonButton size='large'>
							<IonRouterLink routerLink='/login'>
								<IonIcon icon={personCircleOutline} />
							</IonRouterLink>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent></IonContent>
		</>
	)
}

export default Communities
