import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

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

/* Theme variables */
import './theme/variables.css';
import Homepage from './pages/Homepage';
import FindMerchantPage from './pages/FindMerchant';
import RewardResultsPage from './pages/RewardResults';
import Welcome from './pages/Welcome';
import RewardBreakdown from './pages/RewardBreakdown';
import RewardItem from './pages/RewardItem';
import AddCardPage from './pages/AddCardPage';


/* App Data */
import cards_json from './app_data/card_data.json';
import rewards_json from './app_data/rewards.json';
import userdata_template_json from './app_data/user_data.json';
import React, { useEffect, useState, useMemo } from 'react';


setupIonicReact();

//Detect Userdata, setup user if first time
if(!localStorage.getItem("userdata")){
  //User data not set, user is here for the first time
  localStorage.setItem("userdata",JSON.stringify(userdata_template_json))
  console.log("Initialize local storage")
}
const [cards,setCards]=useState(cards_json);
const [rewards,setRewards]=useState(rewards_json);
const [userdata,setUserdata]=useState(userdata_template_json)

setUserdata(JSON.parse(localStorage.getItem("userdata")||'{}'))
console.log(userdata)

export const CardContext = React.createContext({cards,setCards});
export const RewardsContext = React.createContext({rewards,setRewards});
export const UserContext = React.createContext({userdata,setUserdata});

const providerUserdata= useMemo(()=>({userdata,setUserdata}),[userdata,setUserdata])



const App: React.FC = () => {
 return (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <CardContext.Provider value={{cards,setCards}}>
          <RewardsContext.Provider value={{rewards,setRewards}}>
            <UserContext.Provider value={{userdata,setUserdata}}>
              <Redirect exact path="/tabs" to="/tabs/tab1" />
              <Route exact path="/welcome">
                <Welcome />
              </Route>
              <Route exact path="/findMerchant">
                <FindMerchantPage />
              </Route>
              <Route path="/rewardResults/:id">
                <RewardResultsPage />
              </Route>
              <Route path="/rewardBreakdown/:id/:cardid">
                <RewardBreakdown />
              </Route>
              <Route path="/rewardItem/:id">
                <RewardItem />
              </Route>
              <Route exact path="/spendOptimizer">
                <Welcome />
              </Route>
              <Route exact path="/addCard">
                <AddCardPage />
              </Route>
              <Route path="/tabs">
                <Homepage />
              </Route>
              <Route exact path="/">
                <Redirect to="/welcome" />
              </Route>
            </UserContext.Provider>
          </RewardsContext.Provider>
        </CardContext.Provider>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);
 
}
export default App;
