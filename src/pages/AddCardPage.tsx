import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';

const AddCardPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>AddCardPage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">AddCardPage</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="AddCardPage" />
      </IonContent>
    </IonPage>
  );
};

export default AddCardPage;
