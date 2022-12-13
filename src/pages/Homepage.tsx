import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { square, wallet, person, star } from 'ionicons/icons';
import { Redirect, Route } from 'react-router';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import AccountPage from './AccountPage';

const Homepage: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        
        <Route exact path="/tabs">
          <Redirect  to="/tabs/tab1" />
        </Route>
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
      </IonRouterOutlet>
      
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tabs/tab1">
          <IonIcon icon={wallet} />
          <IonLabel>我的錢包</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tabs/tab2">
          <IonIcon icon={star} />
          <IonLabel>獎賞</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tabs/tab3">
          <IonIcon icon={square} />
          <IonLabel>我的消費</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab4" href="/tabs/account">
          <IonIcon icon={person} />
          <IonLabel>設定</IonLabel>
        </IonTabButton>
        
      </IonTabBar>
      
    </IonTabs>

  );
};

export default Homepage;
