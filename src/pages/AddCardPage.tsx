import { IonBackButton, IonBadge, IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonSearchbar, IonText, IonThumbnail, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import { useContext, useState } from 'react';
import { CardContext } from '../App';
import { UserContext } from "../reducer/UserDataReducer";
import ExploreContainer from '../components/ExploreContainer';
import { useHistory } from 'react-router';
import { add, pencil, trashBin } from 'ionicons/icons';
import { trace } from 'console';
import CardAddDropList from '../components/CardAddDropList';

const AddCardPage: React.FC = () => {
  const [searchTerm,setSearchTerm] = useState("");
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

      <IonSearchbar
          animated={true}
          value={searchTerm}
          onIonChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜尋信用卡"
        ></IonSearchbar>

            <IonList>
              <IonListHeader>
                已持有的信用卡
              </IonListHeader>
              <CardAddDropList userHoldsCard={true} searchTerm={searchTerm}></CardAddDropList>
          </IonList>
          <br></br>
          <IonList>
              <IonListHeader>
                未持有的信用卡
              </IonListHeader>
              <CardAddDropList userHoldsCard={false} searchTerm={searchTerm}></CardAddDropList>
          </IonList>
          </IonContent>
    </IonPage>
  );
};

export default AddCardPage;
