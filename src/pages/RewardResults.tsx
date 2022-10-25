import { IonAvatar, IonBackButton, IonButtons, IonCard, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemGroup, IonLabel, IonList, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { add, pin } from 'ionicons/icons';
import ExploreContainer from '../components/ExploreContainer';
import './RewardResults.css';

const RewardResultsPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton/>
          </IonButtons>
          <IonTitle>最佳信用卡</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <div className="ion-padding-start ion-padding-end ion-text-center">
            <IonAvatar className='image-center'>
                <img src='/assets/images/merchants/donki.png' ></img>
            </IonAvatar>
            <IonLabel>Donki Central</IonLabel>
            <IonGrid>
                <IonRow>
                    <IonCol size='2'></IonCol>
                    <IonCol size='8'>
                        <IonItem className="custom">
                            <IonInput type='text' value="$" className='ion-text-center'></IonInput>
                        </IonItem>
                    </IonCol>
                    <IonCol size='2'></IonCol>
                </IonRow>
            </IonGrid>
            
            
          </div>
       
       test1234
      </IonContent>
    </IonPage>
  );
};

export default RewardResultsPage;
