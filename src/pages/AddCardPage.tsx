import { IonBackButton, IonBadge, IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonText, IonThumbnail, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import { useContext } from 'react';
import { CardContext } from '../App';
import { UserContext } from "../reducer/UserDataReducer";
import ExploreContainer from '../components/ExploreContainer';
import { useHistory } from 'react-router';
import { add, pencil, trashBin } from 'ionicons/icons';
import { trace } from 'console';
import CardAddDropList from '../components/CardAddDropList';

const AddCardPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton/>
          </IonButtons>
          <IonTitle>選擇你持有的信用卡</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
            <IonList>
              <IonListHeader>
                已持有的信用卡
              </IonListHeader>
              <CardAddDropList userHoldsCard={true}></CardAddDropList>
          </IonList>
          <br></br>
          <IonList>
              <IonListHeader>
                未持有的信用卡
              </IonListHeader>
              <CardAddDropList userHoldsCard={false}></CardAddDropList>
          </IonList>
          </IonContent>
    </IonPage>
  );
};

export default AddCardPage;
