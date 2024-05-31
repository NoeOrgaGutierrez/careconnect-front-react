import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonButton
} from "@ionic/react";
import { Card, CardContent, CardActions, Button, Typography, CardMedia, Grid } from "@mui/material";

interface Association {
  id: number;
  name: string;
  miniDescription: string;
  description: string;
  logo: string;
  banner: string;
}

interface UserAssociation {
  id: number;
  association: Association;
}

const Associations: React.FC<{ name: string }> = ({ name }) => {
  const history = useHistory();
  const [associations, setAssociations] = useState<Association[]>([]);
  const [userAssociations, setUserAssociations] = useState<UserAssociation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [associationName, setAssociationName] = useState<string>('');
  const [memberCount, setMemberCount] = useState<string>('');

  useEffect(() => {
    // Carga inicial de todas las asociaciones y asociaciones del usuario
    const fetchAssociations = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/association");
        console.log("Associations data:", response.data);
        setAssociations(response.data);
      } catch (error) {
        console.error("Error fetching associations", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserAssociations = async () => {
      try {
        const memberId = localStorage.getItem('memberId');
        if (memberId) {
          const response = await axios.get(`http://localhost:3000/user-association/user/${memberId}`);
          console.log("User Associations data:", response.data);
          setUserAssociations(response.data);
        }
      } catch (error) {
        console.error("Error fetching user associations", error);
      }
    };

    fetchAssociations();
    fetchUserAssociations();
  }, []);

  const fetchFilteredAssociations = async (name?: string, count?: number) => {
    setLoading(true);
    console.log("Fetching filtered associations:", count);
    try {
      const params: { [key: string]: any } = {};
      if (name) params.associationName = name;
      if (count) params.memberCount = count;

      const response = await axios.get("http://localhost:3000/association/filter", { params });
      console.log("Filtered Associations data:", response.data);
      setAssociations(response.data);
    } catch (error) {
      console.error("Error fetching filtered associations", error);
    } finally {
      setLoading(false);
    }
  };

  const isUserInAssociation = (associationId: number) => {
    return userAssociations.some(userAssociation => userAssociation.association.id === associationId);
  };

  const handleAssociationToggle = async (associationId: number) => {
    const memberId = localStorage.getItem('memberId');
    if (memberId) {
      if (isUserInAssociation(associationId)) {
        try {
          await axios.delete(`http://localhost:3000/user-association/user/${memberId}/association/${associationId}`);
          setUserAssociations(userAssociations.filter(userAssociation => userAssociation.association.id !== associationId));
        } catch (error) {
          console.error("Error leaving association", error);
        }
      } else {
        try {
          const response = await axios.post('http://localhost:3000/user-association', {
            user: {
              id: parseInt(memberId, 10)
            },
            association: {
              id: associationId
            }
          });
          const newAssociation = associations.find(association => association.id === associationId);
          if (newAssociation) {
            setUserAssociations([...userAssociations, { id: response.data.id, association: newAssociation }]);
          }
        } catch (error) {
          console.error("Error joining association", error);
        }
      }
    }
  };

  const handleFilterChange = () => {
    const count = parseInt(memberCount, 10);
    fetchFilteredAssociations(associationName, isNaN(count) ? undefined : count);
  };

  const handleMoreInfo = (associationId: number) => {
    // Navegar a la pantalla de detalles de la asociación
    history.push(`/association-details/${associationId}`);
    localStorage.setItem('association-details-id', associationId.toString());
  };

  const handleViewBlogs = (associationId: number) => {
    // Implementa la lógica para manejar la navegación o mostrar los blogs de la asociación
    console.log(`View blogs for association ${associationId}`);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ overflowY: "auto" }}>
        <IonItem>
          <IonLabel position="floating">Nombre de la asociación</IonLabel>
          <IonInput value={associationName} onIonChange={e => setAssociationName(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Número de miembros</IonLabel>
          <IonInput type="number" value={memberCount} onIonChange={e => setMemberCount(e.detail.value!)} />
        </IonItem>
        <IonButton expand="block" onClick={handleFilterChange}>Filtrar</IonButton>
        {loading ? (
          <IonLabel>Cargando...</IonLabel>
        ) : associations.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {associations.map((association) => (
                <Grid item xs={12} sm={6} md={4} key={association.id}>
                  <Card 
                    style={{ 
                      marginBottom: '20px', 
                      backgroundColor: '#1e1e1e', 
                      color: '#ffffff', 
                      borderRadius: '15px', 
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%'
                    }}
                  >
                    <CardMedia
                      component="img"
                      style={{ height: '150px', objectFit: 'cover', backgroundColor: '#ffffff' }}
                      image={association.logo}
                      alt={`Logo of ${association.name}`}
                    />
                    <CardContent>
                      <Typography variant="h5" component="div" style={{ color: '#bb86fc' }}>
                        {association.name}
                      </Typography>
                      <Typography variant="body2" style={{ color: '#ffffff', marginBottom: '10px' }}>
                        {association.miniDescription}
                      </Typography>
                      <Typography variant="body2" style={{ color: '#e0e0e0' }}>
                        {association.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        style={{ color: '#bb86fc' }} 
                        onClick={() => handleAssociationToggle(association.id)}
                      >
                        {isUserInAssociation(association.id) ? "Salirse" : "Unirse"}
                      </Button>
                      <Button 
                        size="small" 
                        style={{ color: '#bb86fc' }} 
                        onClick={() => handleMoreInfo(association.id)}
                      >
                        Saber más
                      </Button>
                      <Button 
                        size="small" 
                        style={{ color: '#bb86fc' }} 
                        onClick={() => handleViewBlogs(association.id)}
                      >
                        Blogs
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {/* Elemento vacío para el margen inferior */}
            <div style={{ height: '50px' }}></div>
          </>
        ) : (
          <IonLabel>Ninguna asociación fue encontrada.</IonLabel>
        )}
      </IonContent>
    </>
  );
}

export default Associations;
