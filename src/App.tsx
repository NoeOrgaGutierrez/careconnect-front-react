import React, { useEffect, useState } from "react";
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Associations from "./components/associations/Associations";
import Communities from "./components/communities/Communities";
import Calendar from "./components/calendar/Calendar";
import Home from "./components/home/Home";
import Landing from "./components/Landing";
import Login from "./components/login/Login";
import UserInformation from "./components/user/UserInformation";
import AssociationProfile from "./components/associations-profile/AssociationsProfile";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Ionic Dark Mode */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

import UserRegister from "./components/user-register/UserRegister";
import AssociationsDetails from "./components/associations-details/AssociationsDetails";
import AssociationsLogin from "./components/associations-login/AssociationsLogin";
import BlogDetails from "./components/blog-details/BlogDetails";  // Importa el nuevo componente
import CommunitiesDetails from "./components/communities-details/CommunitiesDetails";

setupIonicReact();

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    console.log("comprobando logeado");
    if (localStorage.getItem("memberId") !== null) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [localStorage.getItem("memberId")]);

  // Forzar tema oscuro
  useEffect(() => {
    document.body.classList.toggle("dark", true);
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        {loggedIn === true ? (
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <Route path="/" exact={true}>
                <Redirect to="/home" exact={true} />
              </Route>
              <Route path="/home" exact={true}>
                <Home name="Home" />
              </Route>
              <Route path="/associations" exact={true}>
                <Associations name="Associations" />
              </Route>
              <Route path="/communities" exact={true}>
                <Communities name="Communities" />
              </Route>
              <Route path="/calendar" exact={true}>
                <Calendar name="Calendar" />
              </Route>
              <Route path="/user" exact={true}>
                <UserInformation name="UserInformation" />
              </Route>
              <Route path="/association-details/:id" exact={true}>
                <AssociationsDetails />
              </Route>
              <Route path="/blog-details/:id" exact={true}>
                <BlogDetails />  
              </Route>
              <Route path="/communities-details/:id" exact={true}>
                <CommunitiesDetails />
              </Route>
            </IonRouterOutlet>
          </IonSplitPane>
        ) : (
          <IonRouterOutlet>
            <Route path="/" exact={true}>
              <Landing />
            </Route>
            <Route path="/login" exact={true}>
              <Login />
            </Route>
            <Route path="/user-register" exact={true}>
              <UserRegister />
            </Route>
            <Route path="/associations-login" exact={true}>
              <AssociationsLogin />
            </Route>
            <Route path="/associations-profile" exact={true}>
              <AssociationProfile />
            </Route>
          </IonRouterOutlet>
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
