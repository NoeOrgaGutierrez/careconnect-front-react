import React from 'react';
import {
  IonContent,
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
import {
  calendarOutline,
  chatbubbleOutline,
  heartOutline,
  heartSharp,
  homeOutline,
} from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Profile',
    url: '/',
    iosIcon: homeOutline,
    mdIcon: homeOutline,
  },
  {
    title: 'Communities',
    url: '/communities',
    iosIcon: chatbubbleOutline,
    mdIcon: chatbubbleOutline,
  },
  {
    title: 'Associations',
    url: '/associations',
    iosIcon: heartOutline,
    mdIcon: heartSharp,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();

  const handleMenuClick = (url: string) => {
    window.location.replace(url);
  };

  return (
    <IonMenu contentId='main' type='overlay'>
      <IonContent>
        <IonList id='options'>
          <IonListHeader>CareConnect</IonListHeader>
          <IonNote>Connect with others like you</IonNote>
          {appPages.map((appPage, index) => (
            <IonMenuToggle key={index} autoHide={false}>
              <IonItem
                className={location.pathname === appPage.url ? 'selected' : ''}
                onClick={() => handleMenuClick(appPage.url)}
                lines='none'
                detail={false}
              >
                <IonIcon aria-hidden='true' slot='start' ios={appPage.iosIcon} md={appPage.mdIcon} />
                <IonLabel>{appPage.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
