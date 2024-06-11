import React, { useEffect, useState } from 'react'
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
	IonIcon,
	IonTextarea
} from '@ionic/react'
import { useHistory } from 'react-router-dom'
import { arrowBackOutline } from 'ionicons/icons'
import axiosInstance from '../../axiosconfig'
import { AxiosError } from 'axios'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Select,
	MenuItem,
	Divider,
	Grid,
	IconButton,
	Typography
} from '@mui/material'
import LoadingSpinner from '../LoadingSpinner'
import SearchIcon from '@mui/icons-material/Search'

import './Communities.css'

interface Publication {
	id: number
	name: string
	description: string
	user: {
		id: number
		name: string
		surname: string
		avatar: string | null
	}
	topic: {
		id: number
		name: string
		description: string
	}
}

interface Topic {
	id: number
	name: string
	description: string
}

const Communities: React.FC<{ name: string }> = ({ name }) => {
	const [publications, setPublications] = useState<Publication[]>([])
	const [filterName, setFilterName] = useState<string>('')
	const [filterNumber, setFilterNumber] = useState<string>('')
	const [filteredPublications, setFilteredPublications] = useState<
		Publication[]
	>([])
	const [topics, setTopics] = useState<Topic[]>([])
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
	const [showTopicModal, setShowTopicModal] = useState<boolean>(false)
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
	const [topicName, setTopicName] = useState<string>('')
	const [topicDescription, setTopicDescription] = useState<string>('')
	const [publicationName, setPublicationName] = useState<string>('')
	const [publicationDescription, setPublicationDescription] =
		useState<string>('')
	const [loading, setLoading] = useState<boolean>(true)
	const history = useHistory()

	const handleFilter = async () => {
		try {
			const response = await axiosInstance.get('/topic/filter', {
				params: { topicName: filterName, commentCount: filterNumber }
			})
			console.log('Filtered Topics:', response.data)
			if (response.data.length === 0) {
				setFilteredPublications(publications)
			} else {
				setTopics(response.data)
				const filtered = publications.filter((publication) =>
					response.data.some(
						(topic: { name: string }) => topic.name === publication.topic.name
					)
				)
				setFilteredPublications(filtered)
			}
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 404) {
				setFilteredPublications(publications)
			} else {
				if (error instanceof AxiosError) {
					console.error('Error filtering topics:', error.message)
				} else {
					console.error('Unexpected error:', error)
				}
			}
		}
	}

	useEffect(() => {
		const fetchPublications = async () => {
			try {
				const response = await axiosInstance.get('/publication')
				setPublications(response.data)
				setFilteredPublications(response.data)
				console.log('Publications:', response.data)
			} catch (error) {
				if (error instanceof AxiosError) {
					console.error('Error fetching publications:', error.message)
				} else {
					console.error('Unexpected error:', error)
				}
			} finally {
				setLoading(false)
			}
		}

		fetchPublications()
	}, [])

	useEffect(() => {
		handleFilter()
	}, [filterName, filterNumber, publications])

	const handleViewPost = (id: number) => {
		history.push(`/communities-details/${id}`)
	}

	const handleCreateTopic = async () => {
		const memberId = localStorage.getItem('memberId')

		if (!memberId) {
			console.error('No memberId found in localStorage')
			return
		}

		try {
			await axiosInstance.post('/topic', {
				user: { id: parseInt(memberId, 10) },
				name: topicName,
				description: topicDescription
			})

			setShowTopicModal(false)
			window.location.reload()
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error('Error creating topic:', error.message)
			} else {
				console.error('Unexpected error:', error)
			}
		}
	}

	const handleCreateCommunity = async () => {
		const memberId = localStorage.getItem('memberId')

		if (!memberId) {
			console.error('No memberId found in localStorage')
			return
		}

		try {
			await axiosInstance.post('/publication', {
				name: publicationName,
				description: publicationDescription,
				topic: { id: selectedTopic },
				user: { id: parseInt(memberId, 10) }
			})

			setShowCreateModal(false)
			window.location.reload()
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error('Error creating community:', error.message)
			} else {
				console.error('Unexpected error:', error)
			}
		}
	}

	const fetchTopics = async () => {
		try {
			const response = await axiosInstance.get('/topic')
			setTopics(response.data)
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error('Error fetching topics:', error.message)
			} else {
				console.error('Unexpected error:', error)
			}
		}
	}

	return (
		<>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Comunidades</IonTitle>
					<IonButtons slot='end'>
						<IonButton onClick={() => history.replace('/')}>
							<IonIcon icon={arrowBackOutline} slot='icon-only' />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent class='ion-padding'>
				<Grid
					container
					spacing={2}
					direction='row'
					justifyContent={'space-around'}
					xs={12}
					alignContent={'center'}>
					<Grid item xs={12} md={9}>
						<IonInput
							type='text'
							fill='solid'
							placeholder='Nombre'
							value={filterName}
							onIonChange={(e) => setFilterName(e.detail.value!)}
							style={{
								'--highlight-color-focused': '#4c8dff'
							}}
						/>
					</Grid>
					<Grid item xs={12} md={2}>
						<IonInput
							type='number'
							fill='solid'
							min={0}
							placeholder='Nº Miembros'
							value={filterNumber}
							onIonChange={(e) => setFilterNumber(e.detail.value!)}
							style={{
								'--highlight-color-focused': '#4c8dff'
							}}
						/>
					</Grid>
					<Grid
						container
						item
						justifyContent={'center'}
						alignContent={'center'}
						alignItems={'center'}
						xs={12}
						md={1}>
						<IconButton
							sx={{
								bgcolor: '#4c8dff',
								color: 'text.secondary',
								borderRadius: '1.5rem',
								padding: '5px',
								width: '100%',
								boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								':hover': {
									cursor: 'pointer',
									bgcolor: '#e0e0e0',
									animation: 'pulse 1s infinite'
								}
							}}
							onClick={handleFilter}>
							<SearchIcon fontSize='large' />
						</IconButton>
					</Grid>
					<Grid item xs={12} mt={2}>
						<Divider style={{ backgroundColor: '#ffffff' }} />
					</Grid>
				</Grid>

				<IonButton
					className='community-button-caracteristics'
					expand='full'
					onClick={() => setShowTopicModal(true)}>
					Crear Topico
				</IonButton>
				<IonButton
					className='community-button-caracteristics'
					expand='full'
					onClick={() => {
						setShowCreateModal(true)
						fetchTopics()
					}}>
					Crear Comunidad
				</IonButton>

				{loading ? (
					<LoadingSpinner imageUrl='resources/Icono.png' isOpen={loading} />
				) : filteredPublications.length > 0 ? (
					filteredPublications.map((publication) => (
						<IonCard
							key={publication.id}
							style={{
								border: '2px solid #347ec7 ',
								borderRadius: '10px',
								backgroundColor: '#a8ddec'
							}}>
							<IonCardHeader>
								<IonChip
									style={{
										width: 'fit-content',
										maxWidth: '100%',
										minWidth: 0
									}}>
									<IonAvatar>
										<img
											alt='User Avatar'
											src={publication.user.avatar || 'https://via.placeholder.com/150'}
										/>
									</IonAvatar>
									<IonLabel>
										{publication.user.name} {publication.user.surname}
									</IonLabel>
								</IonChip>
								<IonCardTitle>{publication.name}</IonCardTitle>
								<IonCardSubtitle>Topic/{publication.topic.name}</IonCardSubtitle>
							</IonCardHeader>
							<IonCardContent
								style={{
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									display: '-webkit-box',
									WebkitLineClamp: 3,
									WebkitBoxOrient: 'vertical'
								}}>
								Descripción: {publication.description}
							</IonCardContent>
							<IonButton
								fill='clear'
								style={{ float: 'right' }}
								onClick={() => handleViewPost(publication.id)}>
								VER POST
							</IonButton>
						</IonCard>
					))
				) : (
					<IonLabel>
						No se encontraron comunidades con los filtros aplicados.
					</IonLabel>
				)}

				<Dialog
					open={showTopicModal}
					onClose={() => setShowTopicModal(false)}
					PaperProps={{
						style: {
							backgroundColor: '#333',
							color: 'white'
						}
					}}>
					<DialogTitle style={{ color: 'white' }}>Crear Topico</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin='dense'
							label='Nombre del Topico'
							type='text'
							fullWidth
							value={topicName}
							onChange={(e) => setTopicName(e.target.value)}
							InputProps={{
								style: {
									color: 'white'
								}
							}}
							InputLabelProps={{
								style: {
									color: 'white'
								}
							}}
						/>
						<TextField
							margin='dense'
							label='Descripción del Topico'
							type='text'
							fullWidth
							multiline
							rows={4}
							value={topicDescription}
							onChange={(e) => setTopicDescription(e.target.value)}
							InputProps={{
								style: {
									color: 'white'
								}
							}}
							InputLabelProps={{
								style: {
									color: 'white'
								}
							}}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setShowTopicModal(false)} color='primary'>
							Cancelar
						</Button>
						<Button onClick={handleCreateTopic} color='primary'>
							Crear Topico
						</Button>
					</DialogActions>
				</Dialog>

				<Dialog
					open={showCreateModal}
					onClose={() => setShowCreateModal(false)}
					PaperProps={{
						style: {
							backgroundColor: '#333',
							color: 'white'
						}
					}}>
					<DialogTitle style={{ color: 'white' }}>Crear Comunidad</DialogTitle>
					<DialogContent>
						<Select
							fullWidth
							value={selectedTopic}
							onChange={(e) => setSelectedTopic(e.target.value as number)}
							displayEmpty
							inputProps={{
								style: {
									color: 'white'
								}
							}}
							MenuProps={{
								PaperProps: {
									style: {
										backgroundColor: '#333',
										color: 'white'
									}
								}
							}}>
							<MenuItem value='' disabled>
								<span style={{ color: 'white' }}>Seleccionar Topico</span>
							</MenuItem>
							{topics.map((topic) => (
								<MenuItem key={topic.id} value={topic.id} style={{ color: 'white' }}>
									{topic.name}
								</MenuItem>
							))}
						</Select>
						<TextField
							margin='dense'
							label='Nombre de la Publicación'
							type='text'
							fullWidth
							value={publicationName}
							onChange={(e) => setPublicationName(e.target.value)}
							InputProps={{
								style: {
									color: 'white'
								}
							}}
							InputLabelProps={{
								style: {
									color: 'white'
								}
							}}
						/>
						<TextField
							margin='dense'
							label='Descripción de la Publicación'
							type='text'
							fullWidth
							multiline
							rows={4}
							value={publicationDescription}
							onChange={(e) => setPublicationDescription(e.target.value)}
							InputProps={{
								style: {
									color: 'white'
								}
							}}
							InputLabelProps={{
								style: {
									color: 'white'
								}
							}}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setShowCreateModal(false)} color='primary'>
							Cancelar
						</Button>
						<Button onClick={handleCreateCommunity} color='primary'>
							Crear Comunidad
						</Button>
					</DialogActions>
				</Dialog>
				<div style={{ height: '100px' }}></div>
			</IonContent>
		</>
	)
}

export default Communities
