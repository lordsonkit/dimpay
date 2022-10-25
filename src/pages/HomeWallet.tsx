import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';

const HomeWallet: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>HomeWallet</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">HomeWallet</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="HomeWallet" />
      </IonContent>
    </IonPage>
  );
};

export default HomeWallet;
