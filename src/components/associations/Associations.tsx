import {
    IonContent,
    IonGrid,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import { Grid } from '@mui/material';

const Associations: React.FC = () => {
    const location = useLocation();

    return (
        <Grid>Asociaciones</Grid>
    );
};

export default Associations;
