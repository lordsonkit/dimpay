import { IonRadio } from '@ionic/core/components';
import { IonAvatar, IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemGroup, IonItemOption, IonLabel, IonList, IonListHeader, IonModal, IonNote, IonPage, IonProgressBar, IonRadioGroup, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { add, pin, pulse } from 'ionicons/icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { CardContext } from '../App';
import ExploreContainer from '../components/ExploreContainer';
import UserDataReducerProvider, { UserContext } from '../reducer/UserDataReducer';
import './RewardResults.css';



const MilesValueSetting: React.FC = () => {
  const {userData,setUserOptions}=useContext(UserContext);


  const {cardData,setCardData}=useContext(CardContext)

  function setMilesValue(e,item){
      console.log(e)
    setUserOptions(["miles_value",item],e.detail.value)
  }


  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton/>
          </IonButtons>
          <IonTitle>里數現金價值設定</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          
          
          <IonList>
            {Object.keys(cardData.mileages).map((item)=>(<IonItem key={item}>
                  <IonLabel slot="start">
                    <h3>{item}</h3>
                  </IonLabel>
                    <IonInput className='ion-text-end' type='number' min="0" step="0.001" slot='end' value={userData.miles_value?.[item]||0.1} onIonChange={(e)=>setMilesValue(e,item)}></IonInput>
              </IonItem>))}
            
          </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MilesValueSetting;
