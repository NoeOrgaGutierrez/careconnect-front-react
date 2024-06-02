import React, { useEffect, useState } from 'react';
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
  IonMenuButton
} from '@ionic/react';
import { pencilOutline, arrowUndoOutline, star, personCircleOutline, logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../../axiosconfig';
import { AxiosError } from 'axios';
import './UserInformation.css';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  avatar: string;
  bio: string;
}

interface Association {
  id: number;
  name: string;
  miniDescription: string;
  description: string;
  logo: string;
}

interface UserAssociation {
  id: number;
  association: Association;
}

interface RecentComment {
  comment_id: number;
  comment_content: string;
  comment_created: string;
  comment_updated: string;
}

interface PinnedBlog {
  blog_id: number;
  blog_name: string;
  blog_description: string;
}

interface UserRating {
  positiveCount: number;
  negativeCount: number;
  averageRating: number;
}

const UserInformation: React.FC<{ name: string }> = ({ name }) => {
  const [user, setUser] = useState<User | null>(null);
  const [associations, setAssociations] = useState<UserAssociation[]>([]);
  const [recentComments, setRecentComments] = useState<RecentComment[]>([])
  const [pinnedBlogs, setPinnedBlogs] = useState<PinnedBlog[]>([])
  const [userRating, setUserRating] = useState<UserRating | null>(null)
  const history = useHistory()

  useEffect(() => {
	  const memberId = localStorage.getItem('memberId')
	  if (memberId) {
		  axiosInstance
			  .get(`/user/${memberId}`)
			  .then((response) => {
				  setUser(response.data)
			  })
			  .catch((error) => {
				  if (error instanceof AxiosError) {
					  console.error('Error fetching user data:', error.message)
				  } else {
					  console.error('Unexpected error:', error)
				  }
			  })

		  axiosInstance
			  .get(`/user/latest-comments/${memberId}`)
			  .then((response) => {
				  setRecentComments(response.data.slice(0, 4)) // Limitar a los primeros 4 comentarios
			  })
			  .catch((error) => {
				  if (error instanceof AxiosError) {
					  console.error('Error fetching recent comments:', error.message)
				  } else {
					  console.error('Unexpected error:', error)
				  }
			  })

		  axiosInstance
			  .get(`/user/pinned-blogs/${memberId}`)
			  .then((response) => {
				  setPinnedBlogs(response.data)
			  })
			  .catch((error) => {
				  if (error instanceof AxiosError) {
					  console.error('Error fetching pinned blogs:', error.message)
				  } else {
					  console.error('Unexpected error:', error)
				  }
			  })

		  axiosInstance
			  .get(`/valoration/user/${memberId}`)
			  .then((response) => {
				  console.log(response.data)
				  setUserRating(response.data) // Suponiendo que el JSON tiene una propiedad 'averageRating'
			  })
			  .catch((error) => {
				  if (error instanceof AxiosError) {
					  console.error('Error fetching user rating:', error.message)
				  } else {
					  console.error('Unexpected error:', error)
				  }
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

  const handleAssociationClick = () => {
	  const memberId = localStorage.getItem('memberId')
	  if (memberId) {
		  axiosInstance
			  .get(`/user-association/user/${memberId}`)
			  .then((response) => {
				  setAssociations(response.data)
			  })
			  .catch((error) => {
				  if (error instanceof AxiosError) {
					  console.error('Error associating user:', error.message)
				  } else {
					  console.error('Unexpected error:', error)
				  }
			  })
	  }
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

  return (
	  <IonPage>
		  <IonHeader>
			  <IonToolbar>
				  <IonButtons slot='start'>
					  <IonMenuButton />
				  </IonButtons>
				  <IonTitle>{name}</IonTitle>
				  <IonButtons slot='end'>
					  <IonButton onClick={handleProfileClick}>
						  <IonIcon icon={personCircleOutline} />
						  Profile
					  </IonButton>
					  <IonButton onClick={handleLogoutClick}>
						  <IonIcon icon={logOutOutline} />
						  Logout
					  </IonButton>
				  </IonButtons>
			  </IonToolbar>
		  </IonHeader>
		  <IonContent class='ion-padding'>
			  {user ? (
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
							  <IonButton
								  onClick={handleAssociationClick}
								  expand='block'
								  color='primary'>
								  Associate User
							  </IonButton>
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
									  <IonCardTitle>Pinned Topics</IonCardTitle>
								  </IonCardHeader>
								  <IonCardContent>
									  <IonList lines='none'>
										  {pinnedBlogs.map((blog) => (
											  <IonItem key={blog.blog_id}>
												  <IonLabel>
													  <h3>{blog.blog_name}</h3>
													  <p>{blog.blog_description}</p>
												  </IonLabel>
											  </IonItem>
										  ))}
									  </IonList>
								  </IonCardContent>
							  </IonCard>
							  <IonCard>
								  <IonCardHeader>
									  <IonCardTitle>Recent Activity</IonCardTitle>
								  </IonCardHeader>
								  <IonCardContent>
									  <IonList lines='none'>
										  {recentComments.map((comment) => (
											  <IonItem key={comment.comment_id}>
												  <IonLabel>
													  <h3>{comment.comment_content}</h3>
													  <p>{new Date(comment.comment_created).toLocaleString()}</p>
												  </IonLabel>
											  </IonItem>
										  ))}
									  </IonList>
								  </IonCardContent>
							  </IonCard>
						  </IonCol>
					  </IonRow>
					  <IonRow>
						  <IonCol size='12'>
							  <IonCard>
								  <IonCardHeader>
									  <IonCardTitle>Calendar</IonCardTitle>
								  </IonCardHeader>
								  <IonCardContent>
									  {/* Aquí podrías insertar un componente de calendario */}
									  <p>Calendar component placeholder</p>
								  </IonCardContent>
							  </IonCard>
						  </IonCol>
					  </IonRow>
					  {associations.length > 0 && (
						  <IonRow>
							  <IonCol size='12'>
								  <IonCard>
									  <IonCardHeader>
										  <IonCardTitle>My Joined Associations</IonCardTitle>
									  </IonCardHeader>
									  <IonCardContent>
										  <IonGrid>
											  <IonRow>
												  {associations.map((assoc) => (
													  <IonCol size='12' size-md='6' size-lg='4' key={assoc.id}>
														  <IonCard className='association-card'>
															  <IonCardHeader>
																  <IonCardTitle>{assoc.association.name}</IonCardTitle>
																  <IonCardSubtitle>
																	  {assoc.association.miniDescription}
																  </IonCardSubtitle>
															  </IonCardHeader>
															  <IonCardContent>
																  <img
																	  src={assoc.association.logo}
																	  alt={assoc.association.name}
																	  style={{
																		  width: '100%',
																		  height: 'auto',
																		  backgroundColor: 'white'
																	  }}
																  />
																  <p>{assoc.association.description}</p>
																  <IonButton
																	  color='danger'
																	  size='small'
																	  onClick={() => handleLeaveAssociation(assoc.association.id)}>
																	  Leave
																  </IonButton>
																  <IonButton fill='outline' size='small'>
																	  Know more
																  </IonButton>
															  </IonCardContent>
														  </IonCard>
													  </IonCol>
												  ))}
											  </IonRow>
										  </IonGrid>
									  </IonCardContent>
								  </IonCard>
							  </IonCol>
						  </IonRow>
					  )}
				  </IonGrid>
			  ) : (
				  <IonLabel>Loading...</IonLabel>
			  )}
		  </IonContent>
	  </IonPage>
  )
}

export default UserInformation

