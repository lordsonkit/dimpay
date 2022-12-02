import { IonAvatar, IonButton, IonContent, IonHeader, IonIcon, IonItem, IonItemGroup, IonLabel, IonList, IonListHeader, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { cardOutline, cashOutline } from 'ionicons/icons';
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
          <IonItem detail={true} routerLink="/addCard" routerDirection='forward'>
            <IonIcon icon={cardOutline} slot="start"></IonIcon>
            <IonLabel>管理我的信用卡列表</IonLabel>
          </IonItem>
          <IonItem detail={true} routerLink="/settings/miles_value" routerDirection='forward'>
            <IonIcon icon={cashOutline} slot="start"></IonIcon>
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
