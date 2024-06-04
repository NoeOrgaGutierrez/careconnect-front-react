import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
	IonButtons,
	IonContent,
	IonHeader,
	IonLabel,
	IonMenuButton,
	IonTitle,
	IonToolbar,
	IonItem,
	IonInput,
	IonButton,
	IonIcon
} from '@ionic/react'
import {
	Card,
	CardContent,
	CardActions,
	Button as MUIButton,
	Typography,
	CardMedia,
	Grid
} from '@mui/material'
import { arrowBackOutline } from 'ionicons/icons'
import axiosInstance from '../../axiosconfig'
import { AxiosError } from 'axios'
import LoadingSpinner from '../LoadingSpinner'

interface Association {
	id: number
	name: string
	miniDescription: string
	description: string
	logo: string
	banner: string
}

interface UserAssociation {
	id: number
	association: Association
}

const Associations: React.FC<{ name: string }> = ({ name }) => {
	const history = useHistory()
	const [associations, setAssociations] = useState<Association[]>([])
	const [userAssociations, setUserAssociations] = useState<UserAssociation[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [associationName, setAssociationName] = useState<string>('')
	const [memberCount, setMemberCount] = useState<string>('')

	useEffect(() => {
		const fetchAssociations = async () => {
			setLoading(true)
			try {
				const response = await axiosInstance.get('/association')
				console.log('Associations data:', response.data)
				setAssociations(response.data)
			} catch (error) {
				if (error instanceof AxiosError) {
					console.error('Error fetching associations', error.message)
				} else {
					console.error('Unexpected error', error)
				}
			} finally {
				setLoading(false)
			}
		}

		const fetchUserAssociations = async () => {
			try {
				const memberId = localStorage.getItem('memberId')
				if (memberId) {
					const response = await axiosInstance.get(
						`/user-association/user/${memberId}`
					)
					console.log('User Associations data:', response.data)
					setUserAssociations(response.data)
				}
			} catch (error) {
				if (error instanceof AxiosError) {
					console.error('Error fetching user associations', error.message)
				} else {
					console.error('Unexpected error', error)
				}
			}
		}

		fetchAssociations()
		fetchUserAssociations()
	}, [])

	const fetchFilteredAssociations = async (name?: string, count?: number) => {
		setLoading(true)
		console.log('Fetching filtered associations:', count)
		try {
			const params: { [key: string]: any } = {}
			if (name) params.associationName = name
			if (count) params.memberCount = count

			const response = await axiosInstance.get('/association/filter', {
				params
			})
			console.log('Filtered Associations data:', response.data)
			setAssociations(response.data)
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error('Error fetching filtered associations', error.message)
			} else {
				console.error('Unexpected error', error)
			}
		} finally {
			setLoading(false)
		}
	}

	const isUserInAssociation = (associationId: number) => {
		return userAssociations.some(
			(userAssociation) => userAssociation.association.id === associationId
		)
	}

	const handleAssociationToggle = async (associationId: number) => {
		const memberId = localStorage.getItem('memberId')
		if (memberId) {
			if (isUserInAssociation(associationId)) {
				try {
					await axiosInstance.delete(
						`/user-association/user/${memberId}/association/${associationId}`
					)
					setUserAssociations(
						userAssociations.filter(
							(userAssociation) => userAssociation.association.id !== associationId
						)
					)
				} catch (error) {
					if (error instanceof AxiosError) {
						console.error('Error leaving association', error.message)
					} else {
						console.error('Unexpected error', error)
					}
				}
			} else {
				try {
					const response = await axiosInstance.post('/user-association', {
						user: {
							id: parseInt(memberId, 10)
						},
						association: {
							id: associationId
						}
					})
					const newAssociation = associations.find(
						(association) => association.id === associationId
					)
					if (newAssociation) {
						setUserAssociations([
							...userAssociations,
							{ id: response.data.id, association: newAssociation }
						])
					}
				} catch (error) {
					if (error instanceof AxiosError) {
						console.error('Error joining association', error.message)
					} else {
						console.error('Unexpected error', error)
					}
				}
			}
		}
	}

	const handleFilterChange = () => {
		const count = parseInt(memberCount, 10)
		fetchFilteredAssociations(associationName, isNaN(count) ? undefined : count)
	}

	const handleMoreInfo = (associationId: number) => {
		history.push(`/association-details/${associationId}`)
		localStorage.setItem('association-details-id', associationId.toString())
	}

	return (
		<>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Asociaciones</IonTitle>
					<IonButtons slot='end'>
						<IonButton onClick={() => history.replace('/')}>
							<IonIcon icon={arrowBackOutline} slot='icon-only' />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent className='ion-padding' style={{ overflowY: 'auto' }}>
				<IonItem>
					<IonLabel position='floating'>Nombre de la asociación</IonLabel>
					<IonInput
						value={associationName}
						onIonChange={(e) => setAssociationName(e.detail.value!)}
					/>
				</IonItem>
				<IonItem>
					<IonLabel position='floating'>Número de miembros</IonLabel>
					<IonInput
						type='number'
						value={memberCount}
						onIonChange={(e) => setMemberCount(e.detail.value!)}
					/>
				</IonItem>
				<IonButton className='community-button-caracteristics' expand='block' onClick={handleFilterChange}>
					Filtrar
				</IonButton>
				<div style={{ height: '10px' }}></div>
				{loading ? (
					<LoadingSpinner imageUrl='resources/Icono.png' isOpen={loading} />
				) : associations.length > 0 ? (
					<Grid container spacing={3}>
						{associations.map((association) => (
							<Grid item xs={12} sm={6} md={4} key={association.id}>
								<Card
									style={{
										marginBottom: '20px',
										backgroundColor: '#1e1e1e',
										color: '#ffffff',
										borderRadius: '15px',
										boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'space-between',
										height: '100%'
									}}>
									<CardMedia
										component='img'
										style={{
											height: '150px',
											objectFit: 'cover',
											backgroundColor: '#ffffff'
										}}
										image={association.logo}
										alt={`Logo of ${association.name}`}
									/>
									<CardContent>
										<Typography
											variant='h5'
											component='div'
											style={{ color: '#bb86fc' }}>
											{association.name}
										</Typography>
										<Typography
											variant='body2'
											style={{ color: '#ffffff', marginBottom: '10px' }}>
											{association.miniDescription}
										</Typography>
										<Typography variant='body2' style={{ color: '#e0e0e0' }}>
											{association.description}
										</Typography>
									</CardContent>
									<CardActions>
										<MUIButton
											size='small'
											style={{ color: '#bb86fc' }}
											onClick={() => handleAssociationToggle(association.id)}>
											{isUserInAssociation(association.id) ? 'Salirse' : 'Unirse'}
										</MUIButton>
										<MUIButton
											size='small'
											style={{ color: '#bb86fc' }}
											onClick={() => handleMoreInfo(association.id)}>
											Saber más
										</MUIButton>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				) : (
					<IonLabel>Ninguna asociación fue encontrada.</IonLabel>
				)}
				<div style={{ height: '100px' }}></div>
			</IonContent>
		</>
	)
}

export default Associations
