import React, { useState } from 'react'
import {
	IonPage,
	IonContent,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonButton,
	IonButtons,
	IonItem,
	IonLabel,
	IonAvatar,
	IonImg,
	IonLoading,
	IonAlert,
	IonCard,
	IonCardContent
} from '@ionic/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import imageCompression from 'browser-image-compression'

import './UserRegister.css' // Asegúrate de que el archivo CSS esté en la ruta correcta
import { TextField } from '@mui/material'

const UserRegister: React.FC = () => {
	const [name, setName] = useState('')
	const [surname, setSurname] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [avatar, setAvatar] = useState<File | null>(null)
	const [bio, setBio] = useState('')
	const [showAlert, setShowAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState('')
	const [loading, setLoading] = useState(false)
	const history = useHistory()

	const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault() // Prevent default form submission
		setLoading(true)

		try {
			const userData = {
				name,
				surname,
				email,
				password,
				bio
			}

			const response = await axios.post('http://34.116.158.34/user', userData)

			if (response.status === 201) {
				const userId = response.data.id
				localStorage.setItem('memberId', userId.toString()) // Save the user ID to local storage
				console.log('Registration successful:', response.data)

				// Now upload the avatar
				if (avatar) {
					const formData = new FormData()
					formData.append('file', avatar)

					await axios.post(
						`http://34.116.158.34/storage/upload/user/${userId}`,
						formData,
						{
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						}
					)
					console.log('Avatar upload successful')
				}

				setLoading(false) // Update loading state
				history.push('/') // Redirect to home page
				window.location.reload() // Reload the page to apply the login state
			} else {
				setLoading(false) // Update loading state
				setAlertMessage('Registration failed. Please try again.')
				setShowAlert(true) // Show alert message
			}
		} catch (error) {
			setLoading(false) // Update loading state
			setAlertMessage('Connection error. Please try again later.')
			setShowAlert(true) // Show alert message
			console.error('Registration failed:', error)
		}
	}

	const handleAvatarChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0]
		if (file) {
			try {
				const options = {
					maxSizeMB: 1,
					maxWidthOrHeight: 500,
					useWebWorker: true
				}
				const compressedFile = await imageCompression(file, options)
				setAvatar(compressedFile)
			} catch (error) {
				console.error('Error compressing file:', error)
			}
		}
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='end'>
						<IonButton onClick={() => history.goBack()}>Back</IonButton>
					</IonButtons>
					<IonTitle>User Register</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className='register-content'>
				<div style={{ height: '50px' }}></div>
				<div className='register-container'>
					<IonCard className='register-card'>
						<IonCardContent>
							<IonAvatar className='register-avatar'>
								<IonImg
									src={
										avatar ? URL.createObjectURL(avatar) : '../../../resources/Logo.png'
									}
								/>
							</IonAvatar>
							<form onSubmit={handleRegister}>
								<TextField
									label='Name'
									type='text'
									value={name}
									onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
										setName(e.target.value)
									}
									variant='outlined'
									fullWidth
									margin='normal'
									className='text-field'
								/>
								<TextField
									label='Surname'
									type='text'
									value={surname}
									onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
										setSurname(e.target.value)
									}
									variant='outlined'
									fullWidth
									margin='normal'
									className='text-field'
								/>
								<TextField
									label='Email'
									type='email'
									value={email}
									onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
										setEmail(e.target.value)
									}
									variant='outlined'
									fullWidth
									margin='normal'
									className='text-field'
								/>
								<TextField
									label='Password'
									type='password'
									value={password}
									onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
										setPassword(e.target.value)
									}
									variant='outlined'
									fullWidth
									margin='normal'
									className='text-field'
								/>
								<IonItem className='register-item'>
									<IonLabel className='register-label' position='stacked'>
										Avatar
									</IonLabel>
									<input type='file' accept='image/*' onChange={handleAvatarChange} />
								</IonItem>
								<TextField
									label='Bio'
									value={bio}
									onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
										setBio(e.target.value)
									}
									variant='outlined'
									fullWidth
									margin='normal'
									multiline
									rows={4}
									className='text-field'
								/>
								<IonButton type='submit' expand='block' className='register-button'>
									Register
								</IonButton>
							</form>
						</IonCardContent>
						<IonButton
							expand='block'
							fill='clear'
							className='login-button-clear'
							onClick={() => history.push('/login')}>
							User Login
						</IonButton>
						<IonButton
							expand='block'
							fill='clear'
							className='login-button-clear'
							onClick={() => history.push('/associations-login')}>
							Association Login
						</IonButton>
					</IonCard>
				</div>
				{loading && <IonLoading isOpen={loading} message='Please wait...' />}
				<IonAlert
					isOpen={showAlert}
					onDidDismiss={() => setShowAlert(false)}
					header='Registration Error'
					message={alertMessage}
					buttons={['OK']}
				/>
				<div style={{ height: '50px' }}></div>
			</IonContent>
		</IonPage>
	)
}

export default UserRegister
