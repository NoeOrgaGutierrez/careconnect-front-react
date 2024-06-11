import React from 'react'
import {
	IonContent,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenu,
	IonMenuToggle,
	IonNote
} from '@ionic/react'
import { useLocation } from 'react-router-dom'
import {
	calendarOutline,
	chatbubbleOutline,
	heartOutline,
	heartSharp,
	homeOutline
} from 'ionicons/icons'
import './Menu.css'
import { Avatar, Grid } from '@mui/material'

interface AppPage {
	url: string
	iosIcon: string
	mdIcon: string
	title: string
}

const appPages: AppPage[] = [
	{
		title: 'Perfil',
		url: '/',
		iosIcon: homeOutline,
		mdIcon: homeOutline
	},
	{
		title: 'Comunidades',
		url: '/communities',
		iosIcon: chatbubbleOutline,
		mdIcon: chatbubbleOutline
	},
	{
		title: 'Asociaciones',
		url: '/associations',
		iosIcon: heartOutline,
		mdIcon: heartSharp
	}
]

const Menu: React.FC = () => {
	const location = useLocation()

	const handleMenuClick = (url: string) => {
		window.location.replace(url)
	}

	return (
		<IonMenu contentId='main' type='overlay'>
			<IonContent>
				<IonList id='options'>
					<Grid
						container
						direction={'column'}
						justifyContent={'space-between'}
						alignItems={'flex-start'}>
						<Grid
							item
							container
							direction={'row'}
							justifyContent={'flex-start'}
							alignItems={'center'}>
							<Grid item justifyContent={'center'} xs={12} md={3}>
								<Avatar
									alt='CareConnect Logo'
									src='./../../resources\Icono-Transparente-inverso.png'
									sx={{ width: 120, height: 120 }}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<IonListHeader>CareConnect</IonListHeader>
							</Grid>
						</Grid>
						<Grid item mb={3} justifyContent={'flex-start'}>
							<IonNote>Conecta con otros como tú</IonNote>
						</Grid>
					</Grid>
					{appPages.map((appPage, index) => (
						<IonMenuToggle key={index} autoHide={false}>
							<IonItem
								className={location.pathname === appPage.url ? 'selected' : ''}
								onClick={() => handleMenuClick(appPage.url)}
								lines='none'
								detail={false}>
								<IonIcon
									aria-hidden='true'
									slot='start'
									ios={appPage.iosIcon}
									md={appPage.mdIcon}
								/>
								<IonLabel>{appPage.title}</IonLabel>
							</IonItem>
						</IonMenuToggle>
					))}
				</IonList>
			</IonContent>
		</IonMenu>
	)
}

export default Menu
