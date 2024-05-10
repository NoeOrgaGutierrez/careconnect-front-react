

import { useLocation } from 'react-router-dom';

import { Grid } from '@mui/material';

const Calendar: React.FC = () => {
    const location = useLocation();

    return (
        <Grid>Calendar</Grid>
    );
};

export default Calendar;
