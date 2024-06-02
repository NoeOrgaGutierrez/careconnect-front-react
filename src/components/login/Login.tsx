import React, { useState } from 'react'
import {
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
  IonLoading,
  IonAlert,
  IonCard,
  IonCardContent,
  IonIcon,
  IonButtons
} from '@ionic/react'
import { eye, eyeOff, arrowBackOutline } from 'ionicons/icons'
import { useHistory } from 'react-router-dom'
import { TextField, Box } from '@mui/material'
import axiosInstance from '../../axiosconfig'
import { AxiosError } from 'axios'

import './Login.css'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await axiosInstance.post('/user/login', {
        email: email,
        password: password
      })

      setLoading(false)
      const userId = response.data && response.data.id

      if (userId) {
        localStorage.setItem('memberId', userId)
        console.log('Login successful:', response.data)
        history.push('/')
        window.location.reload()
      } else {
        setAlertMessage('Invalid login credentials. Please check and try again.')
        setShowAlert(true)
      }
    } catch (error) {
      setLoading(false)
      if (error instanceof AxiosError) {
        if (error.response && error.response.status === 404) {
          setAlertMessage('Invalid login credentials. Please check and try again.')
          setShowAlert(true)
        } else {
          setAlertMessage('Connection error. Please try again later.')
          setShowAlert(true)
          console.error('Login failed:', error)
        }
      } else {
        setAlertMessage('An unexpected error occurred. Please try again later.')
        setShowAlert(true)
        console.error('Unexpected error:', error)
      }
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>User Login</IonTitle>
          <IonButtons slot='start'>
          <IonButton onClick={() => history.goBack()}>
							<IonIcon icon={arrowBackOutline} slot='icon-only' />
						</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='login-content'>
        <div style={{ height: '50px' }}></div>
        <div className='login-container'>
          <IonCard className='login-card'>
            <IonCardContent>
              <IonAvatar className='login-avatar'>
                <IonImg src='../../../resources/logo.png' />
              </IonAvatar>
              <form onSubmit={handleLogin}>
                <TextField
                  label='Email address'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant='outlined'
                  fullWidth
                  margin='normal'
                />
                <Box display='flex' alignItems='center' marginBottom={2}>
                  <TextField
                    label='Password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant='outlined'
                    fullWidth
                  />
                  <IonButton fill='clear' onClick={() => setShowPassword(!showPassword)}>
                    <IonIcon slot='end' icon={showPassword ? eyeOff : eye} />
                  </IonButton>
                </Box>
                <IonButton type='submit' expand='block' className='login-button'>
                  Sign In
                </IonButton>
              </form>
            </IonCardContent>
            <IonButton
              expand='block'
              fill='clear'
              className='login-button-clear'
              onClick={() => history.push('/user-register')}>
              Register
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
          header='Authentication Error'
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  )
}

export default Login
