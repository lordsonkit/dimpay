import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Welcome.css';
import WelcomeSlides from '../components/WelcomeSlides';

const Welcome: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Welcome</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Welcome</IonTitle>
          </IonToolbar>
        </IonHeader>
        <WelcomeSlides />
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
