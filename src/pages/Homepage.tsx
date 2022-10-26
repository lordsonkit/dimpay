import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTab, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import { triangle, ellipse, square, wallet, add, person, star } from 'ionicons/icons';
import { Redirect, Route } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import AccountPage from './AccountPage';

const Homepage: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/tabs" to="/tabs/tab1" />
        <Route exact path="/tabs/tab1">
          <Tab1 />
        </Route>
        <Route exact path="/tabs/tab2">
          <Tab2 />
        </Route>
        <Route path="/tabs/tab3">
          <Tab3 />
        </Route>
        <Route path="/tabs/account">
          <AccountPage />
        </Route>
        <Route exact path="/tabs">
          <Redirect to="/tabs/tab1" />
        </Route>
      </IonRouterOutlet>
      
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tabs/tab1">
          <IonIcon icon={wallet} />
          <IonLabel>My Wallet</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tabs/tab2">
          <IonIcon icon={star} />
          <IonLabel>Rewards</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tabs/tab3">
          <IonIcon icon={square} />
          <IonLabel>Discover</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab4" href="/tabs/account">
          <IonIcon icon={person} />
          <IonLabel>Account</IonLabel>
        </IonTabButton>
        
      </IonTabBar>
      
    </IonTabs>

  );
};

export default Homepage;