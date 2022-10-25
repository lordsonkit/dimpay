import { IonAvatar, IonContent, IonHeader, IonItem, IonItemGroup, IonLabel, IonList, IonListHeader, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';

const AccountPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonListHeader>
            <IonLabel></IonLabel>
          </IonListHeader>
          <IonItem>
            <IonAvatar slot='start'><img src="https://ionic-docs-demo.herokuapp.com/assets/avatar.svg"></img></IonAvatar>
            <IonLabel>
              <h3>Name</h3>
              <p>Email:</p>
              <p>Account ID</p>
            </IonLabel>
          </IonItem>
          <IonItem>text</IonItem>
        </IonList>
        <IonList>
          <IonItem>
            <IonText color='danger'>Delete All Data</IonText>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AccountPage;
