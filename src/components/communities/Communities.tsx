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
	MenuItem
} from '@mui/material'

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
	const [filteredPublications, setFilteredPublications] = useState<Publication[]>([])
	const [topics, setTopics] = useState<Topic[]>([])
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
	const [showTopicModal, setShowTopicModal] = useState<boolean>(false)
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
	const [topicName, setTopicName] = useState<string>('')
	const [topicDescription, setTopicDescription] = useState<string>('')
	const [publicationName, setPublicationName] = useState<string>('')
	const [publicationDescription, setPublicationDescription] = useState<string>('')
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
					<IonTitle>{name}</IonTitle>
					<IonButtons slot='end'>
					<IonButton onClick={() => history.replace("/")}>
							<IonIcon icon={arrowBackOutline} slot='icon-only' />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent class='ion-padding'>
				<h1>Communities</h1>
				<p>Connect with people like you</p>
				<IonButton expand='full' onClick={() => setShowTopicModal(true)}>
					Create Topic
				</IonButton>
				<IonButton
					expand='full'
					onClick={() => {
						setShowCreateModal(true)
						fetchTopics()
					}}
				>
					Create Community
				</IonButton>
				<IonList>
					<IonItem>
						<IonLabel position='stacked'>Filter by Topic Name</IonLabel>
						<IonInput
							value={filterName}
							placeholder='Enter Topic Name'
							onIonChange={(e) => setFilterName(e.detail.value!)}
						/>
					</IonItem>
					<IonItem>
						<IonLabel position='stacked'>Filter by Comment Count</IonLabel>
						<IonInput
							value={filterNumber}
							placeholder='Enter Comment Count'
							onIonChange={(e) => setFilterNumber(e.detail.value!)}
						/>
					</IonItem>
					<IonButton expand='full' onClick={handleFilter}>
						Apply Filter
					</IonButton>
				</IonList>
				{filteredPublications.length > 0 ? (
					filteredPublications.map((publication) => (
						<IonCard key={publication.id}>
							<IonCardHeader>
								<IonChip
									style={{
										width: 'fit-content',
										maxWidth: '100%',
										minWidth: 0
									}}
								>
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
								}}
							>
								Descripción: {publication.description}
							</IonCardContent>
							<IonButton
								fill='clear'
								style={{ float: 'right' }}
								onClick={() => handleViewPost(publication.id)}
							>
								VIEW POST
							</IonButton>
						</IonCard>
					))
				) : (
					<IonLabel>No communities found with the applied filters.</IonLabel>
				)}

				<Dialog open={showTopicModal} onClose={() => setShowTopicModal(false)}>
					<DialogTitle>Create Topic</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin='dense'
							label='Topic Name'
							type='text'
							fullWidth
							value={topicName}
							onChange={(e) => setTopicName(e.target.value)}
						/>
						<TextField
							margin='dense'
							label='Topic Description'
							type='text'
							fullWidth
							multiline
							rows={4}
							value={topicDescription}
							onChange={(e) => setTopicDescription(e.target.value)}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setShowTopicModal(false)} color='primary'>
							Cancel
						</Button>
						<Button onClick={handleCreateTopic} color='primary'>
							Create Topic
						</Button>
					</DialogActions>
				</Dialog>

				<Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)}>
					<DialogTitle>Create Community</DialogTitle>
					<DialogContent>
						<Select
							fullWidth
							value={selectedTopic}
							onChange={(e) => setSelectedTopic(e.target.value as number)}
							displayEmpty
						>
							<MenuItem value='' disabled>
								Select Topic
							</MenuItem>
							{topics.map((topic) => (
								<MenuItem key={topic.id} value={topic.id}>
									{topic.name}
								</MenuItem>
							))}
						</Select>
						<TextField
							margin='dense'
							label='Publication Name'
							type='text'
							fullWidth
							value={publicationName}
							onChange={(e) => setPublicationName(e.target.value)}
						/>
						<TextField
							margin='dense'
							label='Publication Description'
							type='text'
							fullWidth
							multiline
							rows={4}
							value={publicationDescription}
							onChange={(e) => setPublicationDescription(e.target.value)}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setShowCreateModal(false)} color='primary'>
							Cancel
						</Button>
						<Button onClick={handleCreateCommunity} color='primary'>
							Create Community
						</Button>
					</DialogActions>
				</Dialog>
				<div style={{ height: '100px' }}></div>
			</IonContent>
		</>
	)
}

export default Communities
