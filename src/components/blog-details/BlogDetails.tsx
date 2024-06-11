import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import {
	IonPage,
	IonContent,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonButton,
	IonIcon,
	IonLoading,
	IonAlert,
	IonButtons,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardContent,
	IonChip,
	IonAvatar,
	IonLabel,
	IonList,
	IonFooter,
	IonImg
} from '@ionic/react'
import { arrowBackOutline, starOutline, star } from 'ionicons/icons'
import {
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button
} from '@mui/material'
import axiosInstance from '../../axiosconfig'
import { AxiosError } from 'axios'
import Comments from './../comments/Comments'
import './BlogDetails.css'

interface User {
	id: string
	name: string
	avatar: string | null
}

interface Valoration {
	id: number
	valoration: boolean
}

interface Comment {
	id: string
	content: string
	created: string
	updated: string
	member: {
		id: number
		user: User
	}
	parentComment: Comment | null
	blogComments: Comment[]
	valoration: Valoration[]
}

interface Blog {
	id: number
	name: string
	description: string
	blogComments: Comment[]
}

const BlogDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const history = useHistory()
	const [blog, setBlog] = useState<Blog | null>(null)
	const [loading, setLoading] = useState(false)
	const [showAlert, setShowAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState('')
	const [newComment, setNewComment] = useState<string>('')
	const [showDialog, setShowDialog] = useState<boolean>(false)
	const [isFavorited, setIsFavorited] = useState<boolean>(false)

	const getMemberIdForBlog = async (blogId: string) => {
		const memberId = localStorage.getItem('memberId')
		const associationDetailsId = localStorage.getItem('association-details-id')
		if (!memberId || !associationDetailsId) {
			console.error('No memberId or association-details-id found in localStorage')
			return null
		}
		try {
			const response = await axiosInstance.get(
				`/user-association/user/${memberId}`
			)
			const userAssociations = response.data
			const userAssociation = userAssociations.find(
				(ua: any) => ua.association.id === parseInt(associationDetailsId, 10)
			)
			return userAssociation ? userAssociation.id : null
		} catch (error) {
			console.error('Error fetching user associations:', error)
			return null
		}
	}

	useEffect(() => {
		const fetchBlog = async () => {
			setLoading(true)
			try {
				const memberId = await getMemberIdForBlog(id)
				if (!memberId) {
					setAlertMessage('Necesitá estar unido a la asociación para ver este blog.')
					setShowAlert(true)
					setLoading(false)
					return
				}
				const blogResponse = await axiosInstance.get(`/blog/${id}`)
				const commentsResponse = await axiosInstance.get(
					`/blog/comments/${id}/${memberId}`
				)
				const blogData: Blog = {
					...blogResponse.data,
					blogComments: commentsResponse.data
				}
				setBlog(blogData)
				console.log(blogData)
			} catch (error) {
				setAlertMessage(
					'Error al obtener datos del blog. Por favor, inténtelo de nuevo más tarde.'
				)
				setShowAlert(true)
				console.error('Error fetching blog data:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchBlog()
	}, [id])

	const handleBackClick = () => {
		history.goBack()
	}
	const defaultImageUrl =
		'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg'
	const handleError = (event) => {
		event.target.src = defaultImageUrl
	}

	const handleAddComment = async () => {
		if (!newComment.trim()) return
		setLoading(true)
		try {
			const memberId = await getMemberIdForBlog(id)
			if (!memberId) {
				console.error('No valid memberId found')
				setLoading(false)
				return
			}
			const newCommentData = {
				blog: { id: parseInt(id, 10) },
				member: { id: memberId },
				parentComment: null,
				content: newComment,
				created: new Date().toISOString(),
				updated: new Date().toISOString()
			}
			const response = await axiosInstance.post('/blog-comment', newCommentData)
			setBlog((prevBlog) => {
				if (!prevBlog) return null
				return {
					...prevBlog,
					blogComments: [...prevBlog.blogComments, response.data]
				}
			})
			setNewComment('')
			setShowDialog(false)
		} catch (error) {
			console.error('Error posting comment:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleFavorite = async () => {
		try {
			const memberId = await getMemberIdForBlog(id)
			if (!memberId) {
				console.error('No valid memberId found')
				return
			}
			const requestBody = {
				member: {
					id: memberId
				},
				blog: {
					id: id
				}
			}
			await axiosInstance.post('http://34.116.158.34/pin', requestBody)
			setIsFavorited(!isFavorited)
		} catch (error) {
			console.error('Error favoriting the blog:', error)
			if (error instanceof AxiosError) {
				console.error('Error details:', error.response?.data)
			}
		}
	}

	if (loading) {
		return <IonLoading isOpen={loading} message='Por favor espera...' />
	}

	if (showAlert) {
		return (
			<IonAlert
				isOpen={showAlert}
				onDidDismiss={() => setShowAlert(false)}
				header='Error'
				message={alertMessage}
				buttons={['OK']}
			/>
		)
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='end'>
						<IonButton onClick={handleBackClick}>
							<IonIcon icon={arrowBackOutline} slot='icon-only' />
						</IonButton>
					</IonButtons>
					<IonTitle>{blog ? blog.name : 'Detalles del Blog'}</IonTitle>
					<IonButtons slot='end'>
						<IonButton onClick={handleFavorite}>
							<IonIcon icon={isFavorited ? star : starOutline} slot='icon-only' />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent className='content-with-extra-padding'>
				{blog && (
					<>
						<IonCard
							className='publication-card'
							style={{
								border: '2px solid #347ec7 ',
								borderRadius: '10px',
								backgroundColor: '#28629c'
							}}>
							<IonCardHeader>
								<IonChip className='publication-chip'>
									<IonAvatar>
										<IonImg
											alt='User Avatar'
											onIonError={handleError}
											src={
												blog.blogComments[0]?.member.user.avatar ||
												'https://via.placeholder.com/150'
											}
										/>
									</IonAvatar>
									<IonLabel>{blog.blogComments[0]?.member.user.name}</IonLabel>
								</IonChip>
								<IonCardTitle>{blog.name}</IonCardTitle>
							</IonCardHeader>
							<IonCardContent>{blog.description}</IonCardContent>
						</IonCard>
						<div
							style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
							<IonButton className='add-comment' onClick={() => setShowDialog(true)}>
								Añadir Comentario
							</IonButton>
						</div>
						<IonList>
							<Comments blogId={id} initialComments={blog.blogComments} />
						</IonList>
					</>
				)}
				<Dialog
					open={showDialog}
					onClose={() => setShowDialog(false)}
					fullWidth
					maxWidth='sm'
					PaperProps={{
						style: {
							backgroundColor: '#333',
							color: 'white'
						}
					}}>
					<DialogTitle style={{ color: 'white' }}>Añadir Comentario</DialogTitle>
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
						<Button onClick={() => setShowDialog(false)} color='primary'>
							Cancelar
						</Button>
						<Button onClick={handleAddComment} color='primary'>
							Añadir
						</Button>
					</DialogActions>
				</Dialog>
			</IonContent>
			<IonFooter className='footer-space'></IonFooter>
		</IonPage>
	)
}

export default BlogDetails
