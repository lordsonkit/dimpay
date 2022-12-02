import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

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
import React, { useState, useMemo } from 'react';
import UserDataReducerProvider from './reducer/UserDataReducer';
import merchants_json from './app_data/merchants.json';
import CardDetailPage from './pages/CardDetail';
import MilesValueSetting from './pages/MilesValueSetting';

setupIonicReact();



//const [userdata,setUserdata]=useState(userdata_template_json)

//setUserdata(JSON.parse(localStorage.getItem("userdata")||'{}'))
//console.log(userdata)

export const CardContext = React.createContext({
  cardData:cards_json,
  setCardData:null
});
export const RewardsContext = React.createContext({
  rewardData:rewards_json,
  setRewardData:null
});
export const MerchantListContext = React.createContext({
  merchantData:merchants_json,
  setMerchantData:null
});

const App: React.FC = () => {
  const [rewardData,setRewardData]=useState(rewards_json);
  const rewardDataProvider = useMemo( () => {
    return ({rewardData,setRewardData})
  }, [rewardData,setRewardData])

  const [cardData,setCardData]=useState(cards_json);
  const cardDataProvider = useMemo( () => {
    return ({cardData,setCardData})
  }, [cardData,setCardData])

  const [merchantData,setMerchantData]=useState(merchants_json);
  const merchantDataProvider = useMemo( () => {
    return ({merchantData,setMerchantData})
  }, [merchantData,setMerchantData])
  
  /*
  const [userData,setUserData] = useState(userdata_template_json);
  const userDataProvider = useMemo( () => {
    console.log('userdata update')
    return ({userData, setUserData})
  }, [userData, setUserData])
*/

  

 return (
  <CardContext.Provider value={cardDataProvider}>
  <RewardsContext.Provider value={rewardDataProvider}>
  <MerchantListContext.Provider value={merchantDataProvider}>
  <UserDataReducerProvider>
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
              <Route exact path="/welcome">
                <Welcome />
              </Route>
              <Route exact path="/findMerchant">
                <FindMerchantPage />
              </Route>
              <Route path="/rewardResults/:id">
                <RewardResultsPage />
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
              <Route exact path="/settings/miles_value">
                <MilesValueSetting />
              </Route>
              <Route exact path="/cardDetails/:id">
                <CardDetailPage />
              </Route>
              <Route path="/tabs">
                <Homepage />
              </Route>
              <Route exact path="/">
                <Redirect to="/welcome" />
              </Route>
              <Route exact path="/rewardBreakdown">
                <RewardBreakdown />
              </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>

  </UserDataReducerProvider>
  </MerchantListContext.Provider>
  </RewardsContext.Provider>
  </CardContext.Provider>
);
 
}
export default App;
