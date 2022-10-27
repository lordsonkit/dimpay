import { IonBackButton, IonBadge, IonButtons, IonCheckbox, IonContent, IonHeader, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';

const AddCardPage: React.FC = () => {
  function cardCheckbox(cardID:Event){

  }
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
              
              <IonItem>
                  <IonThumbnail className='thumbnail' slot='start'><IonImg className='fit-thumbnail'  src="/assets/images/hsbcvs.webp"></IonImg></IonThumbnail>
                  <IonLabel>
                    <IonBadge color="medium" className='issuer-badge'><IonText>匯豐</IonText></IonBadge>
                    <h3>Visa Signature卡</h3>
                  </IonLabel>
                  <IonLabel slot='end' className='ion-text-end'>
                      <IonCheckbox checked={false} onIonChange={cardCheckbox}></IonCheckbox>
                  </IonLabel>
              </IonItem>
          </IonList>
          </IonContent>
    </IonPage>
  );
};

export default AddCardPage;
