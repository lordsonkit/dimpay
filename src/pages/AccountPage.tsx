import { IonAvatar, IonButton, IonContent, IonHeader, IonItem, IonItemGroup, IonLabel, IonList, IonListHeader, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
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
            <IonAvatar slot='start'><img src="/assets/images/avatar.svg"></img></IonAvatar>
            <IonLabel>
              <h3>Name</h3>
              <p>Email:</p>
              <p>Account ID</p>
            </IonLabel>
          </IonItem>
          <IonItem>text</IonItem>
          <IonItem detail={true} href='#' routerLink="/settings/miles_value" routerDirection='forward'>
            <IonLabel>調整里數現金價值</IonLabel>
          </IonItem>
        </IonList>
        <br></br>
        <IonButton expand='full' color="danger" onClick={e=>{localStorage.clear();window.location.href="/"}}>
          Reset app data
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AccountPage;
