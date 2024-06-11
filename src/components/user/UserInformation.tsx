import React, { useEffect, useState } from 'react'
import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	IonAvatar,
	IonLabel,
	IonItem,
	IonList,
	IonIcon,
	IonButtons,
	IonButton,
	IonGrid,
	IonRow,
	IonCol,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardSubtitle,
	IonCardContent,
	IonMenuButton,
	IonFooter
} from '@ionic/react'
import {
	pencilOutline,
	arrowUndoOutline,
	star,
	logOutOutline,
	trashOutline
} from 'ionicons/icons'
import { useHistory } from 'react-router-dom'
import axiosInstance from '../../axiosconfig'
import { AxiosError } from 'axios'
import './UserInformation.css'
import LoadingSpinner from '../LoadingSpinner'
import {
	Grid,
	Card,
	CardMedia,
	CardContent,
	Typography,
	CardActions,
	Button
} from '@mui/material'

interface User {
	id: number
	name: string
	surname: string
	email: string
	avatar: string
	bio: string
}

interface Association {
	id: number
	name: string
	miniDescription: string
	description: string
	logo: string
}

interface UserAssociation {
	id: number
	association: Association
}

interface RecentComment {
	comment_id: number
	comment_content: string
	comment_created: string
	comment_updated: string
}

interface PinnedBlog {
	blog_id: number
	blog_name: string
	blog_description: string
	pin_id: number
}

interface UserRating {
	positiveCount: number
	negativeCount: number
	averageRating: number
}

const UserInformation: React.FC<{ name: string }> = ({ name }) => {
	const [user, setUser] = useState<User | null>(null)
	const [associations, setAssociations] = useState<UserAssociation[]>([])
	const [recentComments, setRecentComments] = useState<RecentComment[]>([])
	const [pinnedBlogs, setPinnedBlogs] = useState<PinnedBlog[]>([])
	const [userRating, setUserRating] = useState<UserRating | null>(null)
	const [loading, setLoading] = useState(true)
	const history = useHistory()

	useEffect(() => {
		const memberId = localStorage.getItem('memberId')
		if (memberId) {
			Promise.allSettled([
				axiosInstance.get(`/user/${memberId}`),
				axiosInstance.get(`/user/latest-comments/${memberId}`),
				axiosInstance.get(`/user/pinned-blogs/${memberId}`),
				axiosInstance.get(`/valoration/user/${memberId}`),
				axiosInstance.get(`/user-association/user/${memberId}`)
			])
				.then(
					([
						userResponse,
						commentsResponse,
						blogsResponse,
						ratingResponse,
						associationsResponse
					]) => {
						if (userResponse.status === 'fulfilled') {
							setUser(userResponse.value.data)
						}
						if (commentsResponse.status === 'fulfilled') {
							setRecentComments(commentsResponse.value.data.slice(0, 4))
						}
						if (blogsResponse.status === 'fulfilled') {
							setPinnedBlogs(blogsResponse.value.data)
						}
						if (ratingResponse.status === 'fulfilled') {
							setUserRating(ratingResponse.value.data)
						}
						if (associationsResponse.status === 'fulfilled') {
							setAssociations(associationsResponse.value.data)
						}
					}
				)
				.catch((error) => {
					console.error('Error fetching data:', error)
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}, [])

	const handleProfileClick = () => {
		window.location.replace('/')
	}

	const handleLogoutClick = () => {
		localStorage.removeItem('memberId')
		window.location.replace('/')
	}

	const handleLeaveAssociation = async (associationId: number) => {
		const memberId = localStorage.getItem('memberId')
		if (memberId) {
			try {
				await axiosInstance.delete(
					`/user-association/user/${memberId}/association/${associationId}`
				)
				setAssociations(
					associations.filter((assoc) => assoc.association.id !== associationId)
				)
			} catch (error) {
				if (error instanceof AxiosError) {
					console.error('Error leaving association:', error.message)
				} else {
					console.error('Unexpected error:', error)
				}
			}
		}
	}

	const handleUnpinBlog = async (pin_id: number) => {
		try {
			await axiosInstance.delete(`http://34.116.158.34/pin/${pin_id}`)
			window.location.reload()
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error('Error unpinning blog:', error.message)
			} else {
				console.error('Unexpected error:', error)
			}
		}
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Perfil</IonTitle>
					<IonButtons slot='end'>
						<IonButton onClick={handleLogoutClick}>
							<IonIcon icon={logOutOutline} size='large' />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent className='ion-padding'>
				{loading ? (
					<LoadingSpinner imageUrl='resources/Icono.png' isOpen={loading} />
				) : user ? (
					<IonGrid>
						<IonRow>
							<IonCol size='12' size-md='4' className='ion-text-center'>
								<IonAvatar
									style={{ margin: '0 auto', width: '150px', height: '150px' }}>
									<img src={user.avatar} alt='Profile' />
								</IonAvatar>
								<h2>
									{user.name} {user.surname}
								</h2>
								<p>{user.email}</p>
								<p>{user.bio}</p>
								{userRating && (
									<IonItem>
										<IonLabel>
											<strong>Rating:</strong>
										</IonLabel>
										{[...Array(5)].map((_, i) => (
											<IonIcon
												key={i}
												icon={star}
												style={{ color: i < userRating.averageRating ? 'gold' : 'gray' }}
											/>
										))}
									</IonItem>
								)}
							</IonCol>
							<IonCol size='12' size-md='8'>
								<IonCard>
									<IonCardHeader>
										<IonCardTitle>Blogs Favoritos</IonCardTitle>
									</IonCardHeader>
									<IonCardContent>
										<IonList lines='none' className='recent-activity'>
											{pinnedBlogs.map((blog) => (
												<IonItem key={blog.blog_id} className='recent-activity-content'>
													<IonLabel>
														<h3 style={{ padding: '5px' }}>{blog.blog_name}</h3>
														<p style={{ padding: '5px', color: 'white' }}>
															{blog.blog_description}
														</p>
													</IonLabel>
													<IonButton
														onClick={() => handleUnpinBlog(blog.pin_id)}
														fill='clear'
														slot='end'>
														<IonIcon icon={trashOutline} />
													</IonButton>
												</IonItem>
											))}
										</IonList>
									</IonCardContent>
								</IonCard>
								<IonCard>
									<IonCardHeader>
										<IonCardTitle>Actividad de Asociaciones Reciente</IonCardTitle>
									</IonCardHeader>
									<IonCardContent>
										<IonList lines='none'>
											{recentComments.map((comment) => (
												<IonItem key={comment.comment_id}>
													<IonLabel
														style={{
															border: '2px solid #a8ddec ',
															borderRadius: '10px',
															backgroundColor: '#a8ddec'
														}}>
														<h3 style={{ padding: '5px' }}>{comment.comment_content}</h3>
														<p style={{ padding: '5px', color: 'white' }}>
															{new Date(comment.comment_created).toLocaleString()}
														</p>
													</IonLabel>
												</IonItem>
											))}
										</IonList>
									</IonCardContent>
								</IonCard>
							</IonCol>
						</IonRow>
						{associations.length > 0 && (
							<IonRow>
								<IonCol size='12'>
									<IonCard>
										<IonCardHeader>
											<IonCardTitle>Mis asociaciones</IonCardTitle>
										</IonCardHeader>
										<IonCardContent>
											<IonGrid>
												<IonRow>
													<Grid container spacing={2}>
														{associations.map((assoc) => (
															<Grid item xs={12} sm={4} md={4} key={assoc.id}>
																<Card
																	style={{
																		marginBottom: '20px',
																		backgroundColor: '#a8ddec',
																		color: '#ffffff',
																		borderRadius: '10px',
																		boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
																		display: 'flex',
																		flexDirection: 'column',
																		justifyContent: 'space-between',
																		height: '100%',
																		border: '2px solid #265c91'
																	}}>
																	<CardMedia
																		component='img'
																		style={{
																			height: 'auto',
																			objectFit: 'cover',
																			backgroundColor: 'white',
																			width: '100%'
																		}}
																		image={assoc.association.logo}
																		alt={`Logo of ${assoc.association.name}`}
																	/>
																	<CardContent>
																		<Grid
																			container
																			justifyContent={'space-between'}
																			direction={'column'}
																			alignItems={'flex-start'}>
																			<Grid xs={4} item>
																				<Typography
																					variant='h5'
																					component='div'
																					style={{ color: '#bb86fc' }}>
																					{assoc.association.name}
																				</Typography>
																			</Grid>
																			<Grid xs={4} item>
																				<Typography
																					variant='body2'
																					style={{ color: '#ffffff', marginBottom: '10px' }}>
																					{assoc.association.miniDescription}
																				</Typography>
																			</Grid>
																			<Grid xs={4} item>
																				<Typography variant='body2' style={{ color: '#e0e0e0' }}>
																					{assoc.association.description}
																				</Typography>
																			</Grid>
																		</Grid>
																	</CardContent>
																	<Grid
																		container
																		justifyContent={'flex-start'}
																		direction={'row-reverse'}>
																		<CardActions>
																			<Button
																				size='small'
																				style={{ color: '#bb86fc' }}
																				onClick={() =>
																					handleLeaveAssociation(assoc.association.id)
																				}
																				className='leave-button'>
																				Salir
																			</Button>
																			<Button
																				size='small'
																				style={{ color: '#bb86fc' }}
																				onClick={() =>
																					history.push(
																						`/association-details/${assoc.association.id}`
																					)
																				}>
																				Saber más
																			</Button>
																		</CardActions>
																	</Grid>
																</Card>
															</Grid>
														))}
													</Grid>
												</IonRow>
											</IonGrid>
										</IonCardContent>
									</IonCard>
								</IonCol>
							</IonRow>
						)}
					</IonGrid>
				) : (
					<LoadingSpinner imageUrl='resources/Icono.png' isOpen={!user} />
				)}
			</IonContent>
		</IonPage>
	)
}

export default UserInformation
