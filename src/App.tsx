import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import Menu from './components/Menu';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Associations from './components/associations/Associations';
import Communities from './components/communities/Communities';
import Calendar from './components/calendar/Calendar';
import Home from './components/home/Home';
import Landing from './components/Landing';

setupIonicReact();

const App: React.FC = () => {

  const loggedIn = true;
  return (
    <IonApp>
      <IonReactRouter>
        {loggedIn ? <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Landing />
            </Route>
            <Route path="/home" exact={true}>
              <Home name='Home' />
            </Route>
            <Route path="/associations" exact={true}>
              <Associations name='Associations' />
            </Route>
            <Route path="/communities" exact={true}>
              <Communities name='Communities' />
            </Route>
            <Route path="/calendar" exact={true}>
              <Calendar name='Calendar' />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane> : <Landing />}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
