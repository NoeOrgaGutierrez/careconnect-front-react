import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
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
	IonTextarea,
	IonItem,
	IonList,
	IonIcon,
	IonFooter,
	IonText,
	IonImg
} from '@ionic/react'
import { chatboxOutline, arrowBackOutline } from 'ionicons/icons'
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button
} from '@mui/material'
import axiosInstance from '../../axiosconfig'
import { AxiosError } from 'axios'
import LoadingSpinner from '../LoadingSpinner'
import './CommunitiesDetails.css'

interface Comment {
	id: number
	content: string
	created: string
	updated: string
	user: {
		id: number
		name: string
		surname: string
		avatar: string | null
	}
	parentComment: Comment | null
	comments: Comment[]
}

interface PublicationDetails {
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
	comments: Comment[]
}

const CommunitiesDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const history = useHistory()
	const [publication, setPublication] = useState<PublicationDetails | null>(null)
	const [newComment, setNewComment] = useState<string>('')
	const [comments, setComments] = useState<Comment[]>([])
	const [showDialog, setShowDialog] = useState<boolean>(false)
	const [replyToComment, setReplyToComment] = useState<Comment | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const defaultImageUrl =
		'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg'
	const handleError = (event: any) => {
		event.target.src = defaultImageUrl
	}

	useEffect(() => {
		const userId = localStorage.getItem('memberId')
		if (userId) {
			axiosInstance
				.get(`/publication/comments/${id}/${userId}`)
				.then((response) => {
					setComments(response.data || [])
				})
				.catch((error) => {
					if (error instanceof AxiosError) {
						console.error('Error fetching comments:', error.message)
					} else {
						console.error('Unexpected error:', error)
					}
				})

			axiosInstance
				.get(`/publication/${id}`)
				.then((response) => {
					console.log(response.data)
					setPublication(response.data)
				})
				.catch((error) => {
					if (error instanceof AxiosError) {
						console.error('Error fetching publication details:', error.message)
					} else {
						console.error('Unexpected error:', error)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}, [id])

	const handleAddComment = () => {
		if (newComment.trim() !== '') {
			const userId = localStorage.getItem('memberId')
			if (userId) {
				const payload = {
					content: newComment,
					user: { id: Number(userId) },
					publication: { id: Number(id) },
					parentComment: replyToComment ? { id: replyToComment.id } : null,
					updated: new Date().toISOString()
				}
				axiosInstance
					.post('/comment', payload)
					.then((response) => {
						const newCommentData = response.data
						if (replyToComment) {
							const updatedComments = comments.map((comment) => {
								if (comment.id === replyToComment.id) {
									return {
										...comment,
										comments: [...(comment.comments || []), newCommentData]
									}
								}
								return comment
							})
							setComments(updatedComments)
						} else {
							setComments([...comments, newCommentData])
						}
						setNewComment('')
						setShowDialog(false)
						setReplyToComment(null)
					})
					.catch((error) => {
						if (error instanceof AxiosError) {
							console.error('Error adding comment:', error.message)
						} else {
							console.error('Unexpected error:', error)
						}
					})
			}
		}
	}

	const renderComments = (comments: Comment[], level: number = 0) => {
		return comments.map((comment) => (
			<IonCard
				key={comment.id}
				className={`comment-level-${level}`}
				style={{ border: '2px solid #347ec7 ', borderRadius: '10px', marginLeft: '10px' }}>
				<IonCardHeader>
					<IonChip className='comment-chip'>
						<IonAvatar>
							<IonImg
								onIonError={handleError}
								alt='User Avatar'
								src={comment.user.avatar || 'https://via.placeholder.com/150'}
							/>
						</IonAvatar>
						<IonLabel>
							{comment.user.name} {comment.user.surname}
						</IonLabel>
					</IonChip>
					<IonCardSubtitle>
						{new Date(comment.created).toLocaleString()}
					</IonCardSubtitle>
				</IonCardHeader>
				<IonCardContent>
					{comment.content}
					<IonButton
						fill='clear'
						size='small'
						onClick={() => {
							setReplyToComment(comment)
							setShowDialog(true)
						}}>
						<IonIcon icon={chatboxOutline} slot='start' />
						Responder
					</IonButton>
					{comment.comments &&
						comment.comments.length > 0 &&
						renderComments(comment.comments, level + 1)}
				</IonCardContent>
			</IonCard>
		))
	}

	return (
		<>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{publication?.name}</IonTitle>
					<IonButtons slot='end'>
						<IonButton onClick={() => history.goBack()}>
							<IonIcon icon={arrowBackOutline} slot='icon-only' />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent className='content-with-extra-padding'>
				{loading ? (
					<LoadingSpinner imageUrl='resources/Icono.png' isOpen={loading} />
				) : (
					<>
						{publication && (
							<IonCard
								className='publication-card'
								style={{
									border: '2px solid #347ec7 ',
									borderRadius: '10px',
									backgroundColor: '#a8ddec'
								}}>
								<IonCardHeader>
									<IonChip className='publication-chip'>
										<IonAvatar>
											<IonImg
												onIonError={handleError}
												alt='User Avatar'
												src={publication.user.avatar || 'https://via.placeholder.com/150'}
											/>
										</IonAvatar>
										<IonLabel>
											{publication.user.name} {publication.user.surname}
										</IonLabel>
									</IonChip>
									<IonCardTitle>{publication.name}</IonCardTitle>
									<IonCardSubtitle>r/{publication.topic.name}</IonCardSubtitle>
								</IonCardHeader>
								<IonCardContent>{publication.description}</IonCardContent>
							</IonCard>
						)}
						<div
							style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
							<IonButton className='add-comment' onClick={() => setShowDialog(true)}>
								Añadir Comentario
							</IonButton>
						</div>
						<IonList>{renderComments(comments)}</IonList>
						<div
							style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
							<IonButton className='add-comment' onClick={() => setShowDialog(true)}>
								Añadir Comentario
							</IonButton>
						</div>
					</>
				)}
				<div style={{ height: '60px' }}></div>
				<Dialog
					open={showDialog}
					onClose={() => {
						setShowDialog(false)
						setReplyToComment(null)
					}}
					fullWidth
					maxWidth='sm'
					PaperProps={{
						style: {
							backgroundColor: '#ffffff',
							color: 'white'
						}
					}}>
					<DialogTitle style={{ color: 'white' }}>
						{replyToComment ? 'Responder a Comentario' : 'Añadir Comentario'}
					</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin='dense'
							label='Comentario'
							type='text'
							fullWidth
							multiline
							rows={4}
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
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
						<Button
							onClick={() => {
								setShowDialog(false)
								setReplyToComment(null)
							}}
							color='primary'>
							Cancelar
						</Button>
						<Button onClick={handleAddComment} color='primary'>
							{replyToComment ? 'Responder' : 'Añadir'}
						</Button>
					</DialogActions>
				</Dialog>
			</IonContent>
			<IonFooter className='footer-space'></IonFooter>
		</>
	)
}

export default CommunitiesDetails
