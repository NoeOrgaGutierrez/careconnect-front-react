import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonLoading, IonAlert, IonCard, IonCardContent, IonAvatar, IonImg } from '@ionic/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { TextField, Box, Typography, Grid } from '@mui/material';

const UserInformation: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const history = useHistory();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const memberId = localStorage.getItem('memberId');
      if (memberId) {
        try {
          const response = await axios.get(`http://localhost:3000/user/${memberId}`);
          setUserInfo(response.data);
        } catch (error) {
          console.error('Error fetching user information:', error);
          setAlertMessage('Failed to fetch user information. Please try again later.');
          setShowAlert(true);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setAlertMessage('User not logged in. Please log in and try again.');
        setShowAlert(true);
      }
    };

    fetchUserInfo();
  }, []);

  const handleEditProfile = () => {
    history.push('/edit-profile');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>User Information</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading ? (
          <IonLoading isOpen={loading} message="Loading user information..." />
        ) : (
          userInfo && (
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <IonCard>
                  <IonCardContent>
                    <Box display="flex" justifyContent="center" mb={2}>
                      <IonAvatar>
                        <IonImg src={userInfo.avatar || '../../../resources/Logo.png'} />
                      </IonAvatar>
                    </Box>
                    <Typography variant="h5" component="div" gutterBottom>
                      {userInfo.name} {userInfo.surname}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {userInfo.bio}
                    </Typography>
                    <Box mt={2}>
                      <TextField
                        label="Email"
                        value={userInfo.email}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        margin="normal"
                      />
                    </Box>
                    <IonButton expand="block" onClick={handleEditProfile}>
                      Edit Profile
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </Grid>
            </Grid>
          )
        )}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Error"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default UserInformation;
