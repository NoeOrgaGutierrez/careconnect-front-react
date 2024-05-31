import {
	IonButtons,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonButton,
	IonIcon,
	IonRouterLink
} from '@ionic/react'
import { personCircleOutline } from 'ionicons/icons'
import React from 'react'
import { Button, Grid, Typography, Box, styled } from '@mui/material'

const HeroSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  background: 'linear-gradient(to right, #00c6ff, #0072ff)',
  color: '#fff',
  padding: theme.spacing(4),
  textAlign: 'center',
}));

const FeaturesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 4),
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const Landing: React.FC = () => {
	return (
		<>
			<IonHeader>
				<IonToolbar>
					<IonTitle slot='start'>Landing</IonTitle>
					<IonButtons slot='end'>
						<IonButton size='large'>
							<IonRouterLink routerLink='/login'>
								<IonIcon icon={personCircleOutline} />
							</IonRouterLink>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<HeroSection>
					<Typography variant="h2" gutterBottom>
						Welcome to CareConnect
					</Typography>
					<Typography variant="h5" paragraph>
						Connecting you with the best healthcare professionals.
					</Typography>
					<Button variant="contained" color="primary" size="large">
						Get Started
					</Button>
				</HeroSection>
				<FeaturesSection>
					<Typography variant="h4" gutterBottom>
						Our Features
					</Typography>
					<Grid container spacing={4}>
						<Grid item xs={12} md={4}>
							<FeatureItem>
								<Typography variant="h6" gutterBottom>
									Easy Scheduling
								</Typography>
								<Typography>
									Book appointments with healthcare professionals easily.
								</Typography>
							</FeatureItem>
						</Grid>
						<Grid item xs={12} md={4}>
							<FeatureItem>
								<Typography variant="h6" gutterBottom>
									Reliable Doctors
								</Typography>
								<Typography>
									Connect with trusted and experienced doctors.
								</Typography>
							</FeatureItem>
						</Grid>
						<Grid item xs={12} md={4}>
							<FeatureItem>
								<Typography variant="h6" gutterBottom>
									24/7 Support
								</Typography>
								<Typography>
									Get support anytime, anywhere.
								</Typography>
							</FeatureItem>
						</Grid>
					</Grid>
				</FeaturesSection>
			</IonContent>
		</>
	)
}

export default Landing