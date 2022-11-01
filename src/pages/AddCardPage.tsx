import { IonBackButton, IonBadge, IonButtons, IonCheckbox, IonContent, IonHeader, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { useContext } from 'react';
import { CardContext , UserContext } from '../App';
import ExploreContainer from '../components/ExploreContainer';

const AddCardPage: React.FC = () => {
  function cardCheckbox(cardID){
    try{
      console.log(cardID.target)
    }catch (e){}    
  }
  function userOwnsCard(card_id:number){
    return userData.card_owned.indexOf(card_id)>=0?true:false;
  }
  const {cardData,setCardData}=useContext(CardContext);
  const {userData,setUserData}=useContext(UserContext);

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
              
              {cardData.cards.data.map(({card_name,issuer,card_id,image})=>(
                <IonItem>
                  <IonThumbnail className='thumbnail' slot='start'>
                    <IonImg className='fit-thumbnail'  src={image}></IonImg>
                  </IonThumbnail>
                  <IonLabel>
                    <IonBadge color="medium" className='issuer-badge'><IonText>{cardData.issuers.data[issuer].name}</IonText></IonBadge>
                    <h3>{card_name}</h3>
                  </IonLabel>
                  <IonLabel slot='end' className='ion-text-end'>
                      <IonCheckbox checked={userOwnsCard(card_id)} value={card_id} onIonChange={cardCheckbox}></IonCheckbox>
                  </IonLabel>
              </IonItem>
              ))}
              
          </IonList>
          </IonContent>
    </IonPage>
  );
};

export default AddCardPage;
