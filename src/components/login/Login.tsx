import React, { useState } from 'react'
import {
	IonAlert,
	IonPage,
	IonContent,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonButton,
	IonInput,
	IonItem,
	IonLabel,
	IonAvatar,
	IonImg,
	IonLoading
} from '@ionic/react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

const Login: React.FC = () => {
	const [showAlert, setShowAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState('')
	const [loading, setLoading] = useState(false)
	const history = useHistory()

	async function attemptLogin(event: any, form: any) {
		setLoading(true)
		event.preventDefault()
		const email = form.email.value
		const password = form.password.value
		await axios
			.post('http://localhost:3000/user/login', { email, password })
			.then((response) => {
				setLoading(false)
				const userId = response.data && response.data.id
				if (userId) {
					localStorage.setItem('memberId', userId)
					console.log('correcto')
					history.push('/home')
					window.location.reload()
				} else {
					setAlertMessage(
						'Datos de usuario inválidos. Por favor, verifique sus credenciales.'
					)
					setShowAlert(true)
				}
			})
			.catch(() => {
				setLoading(false)
				setAlertMessage('Error de conexión al servidor.')
				setShowAlert(true)
			})
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Login</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className='ion-padding'>
				<form onSubmit={(event) => attemptLogin(event, event.target)}>
					<IonAvatar style={{ margin: 'auto', marginBottom: '1rem' }}>
						<IonImg src='../../../resources/logo.png' />
					</IonAvatar>
					<IonItem>
						<IonLabel position='stacked'>
							<h1>Email</h1>
						</IonLabel>
						<IonInput required type='text' name='email' />
					</IonItem>
					<IonItem>
						<IonLabel position='stacked'>
							<h1>Password</h1>
						</IonLabel>
						<IonInput required type='password' name='password' />
					</IonItem>
					<IonButton type='submit' expand='block'>
						Login
					</IonButton>
					{loading && <IonLoading isOpen={loading} message='Loading' />}
				</form>
				<IonAlert
					isOpen={showAlert}
					onDidDismiss={() => setShowAlert(false)}
					header={'Error de Autenticación'}
					message={alertMessage}
					buttons={['OK']}
				/>
			</IonContent>
		</IonPage>
	)
}

export default Login
