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

setupIonicReact();

const App: React.FC = () => (
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
          <Route exact path="/spendOptimizer">
            <Welcome />
          </Route>
          <Route path="/tabs">
            <Homepage />
          </Route>
          <Route exact path="/">
            <Redirect to="/welcome" />
          </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
