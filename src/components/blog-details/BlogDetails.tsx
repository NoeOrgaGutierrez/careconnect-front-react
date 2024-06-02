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
	IonButtons
} from '@ionic/react'
import { arrowBackOutline } from 'ionicons/icons'
import Comments from './../comments/Comments'
import { Typography } from '@mui/material'
import axiosInstance from '../../axiosconfig'
import { AxiosError } from 'axios'
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

	const getMemberIdForBlog = async (blogId: string) => {
		const memberId = localStorage.getItem('memberId')
		const associationDetailsId = localStorage.getItem('association-details-id')
		if (!memberId) {
			console.error('No memberId found in localStorage')
			return null
		}
		if (!associationDetailsId) {
			console.error('No association-details-id found in localStorage')
			return null
		}
		try {
			const response = await axiosInstance.get(
				`/user-association/user/${memberId}`
			)
			console.log('User associations:', response.data)
			const userAssociations = response.data
			const userAssociation = userAssociations.find(
				(ua: any) => ua.association.id === parseInt(associationDetailsId, 10)
			)
			console.log(
				'memberId encontrado:',
				userAssociation ? userAssociation.id : null
			)
			return userAssociation ? userAssociation.id : null
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error('Error fetching user associations:', error.message)
			} else {
				console.error('Unexpected error:', error)
			}
			return null
		}
	}

	useEffect(() => {
		const fetchBlog = async () => {
			setLoading(true)
			try {
				const memberId = await getMemberIdForBlog(id)
				if (!memberId) {
					setAlertMessage(
						'No se pudo obtener el memberId. Por favor, inténtelo de nuevo más tarde.'
					)
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
				console.log('Blog data:', blogData)
				setBlog(blogData)
			} catch (error) {
				if (error instanceof AxiosError) {
					setAlertMessage(
						'Error al obtener datos del blog. Por favor, inténtelo de nuevo más tarde.'
					)
					console.error('Error fetching blog data:', error.message)
				} else {
					setAlertMessage('An unexpected error occurred. Please try again later.')
					console.error('Unexpected error:', error)
				}
				setShowAlert(true)
			} finally {
				setLoading(false)
			}
		}

		fetchBlog()
	}, [id])

	const handleBackClick = () => {
		history.goBack() // Navigate back without reloading
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
					<IonTitle>{blog ? blog.name : 'Detalles del Blog'}</IonTitle>
					<IonButtons slot='end'>
					<IonButton onClick={() => history.goBack()}>
							<IonIcon icon={arrowBackOutline} slot='icon-only' />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent className='blog-details-content'>
				{blog && (
					<>
						<Typography variant='h4' className='blog-title'>
							{blog.name}
						</Typography>
						<Typography variant='body1' className='blog-description'>
							{blog.description}
						</Typography>
						<Comments blogId={id} initialComments={blog.blogComments} />
					</>
				)}
			</IonContent>
		</IonPage>
	)
}

export default BlogDetails
