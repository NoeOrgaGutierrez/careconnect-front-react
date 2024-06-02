import React, { useEffect, useState } from 'react'
import axios from 'axios'
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
	IonIcon
} from '@ionic/react'
import { useHistory } from 'react-router-dom'
import { arrowBackOutline } from 'ionicons/icons'

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
	const history = useHistory()

	useEffect(() => {
		const fetchPublications = async () => {
			try {
				const response = await axios.get('http://34.116.158.34/publication')
				setPublications(response.data)
				setFilteredPublications(response.data) // Initial set to display all publications
				console.log('Publications:', response.data)
			} catch (error) {
				console.error('Error fetching publications:', error)
			}
		}

		fetchPublications()
	}, [])

	const handleFilter = async () => {
		try {
			const response = await axios.get('http://34.116.158.34/topic/filter', {
				params: { topicName: filterName, commentCount: filterNumber }
			})
			console.log('Filtered Topics:', response.data)
			if (response.data.length === 0) {
				// If no topics found, reset to show all publications
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
			if (axios.isAxiosError(error) && error.response?.status === 404) {
				// If 404 error, reset to show all publications
				setFilteredPublications(publications)
			} else {
				console.error('Error filtering topics:', error)
			}
		}
	}

	const handleViewPost = (id: number) => {
		history.push(`/communities-details/${id}`)
	}

	useEffect(() => {
		handleFilter()
	}, [filterName, filterNumber])

	return (
		<>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{name}</IonTitle>
					<IonButtons slot='end'>
						<IonButton onClick={() => history.goBack()}>
							<IonIcon icon={arrowBackOutline} slot='icon-only' />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent class='ion-padding'>
				<h1>Communities</h1>
				<p>Connect with people like you</p>
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
								VIEW POST
							</IonButton>
						</IonCard>
					))
				) : (
					<IonLabel>No communities found with the applied filters.</IonLabel>
				)}
			</IonContent>
		</>
	)
}

export default Communities
