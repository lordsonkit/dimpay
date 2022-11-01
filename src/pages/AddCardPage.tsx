import { IonBackButton, IonBadge, IonButtons, IonCheckbox, IonContent, IonHeader, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { useContext } from 'react';
import { CardContext, UserContext } from '../App';
import ExploreContainer from '../components/ExploreContainer';

const AddCardPage: React.FC = () => {
  function cardCheckbox(cardID:Event){
    console.log(cardID)
  }
  function userOwnsCard(card_id:number){
    return userdata.card_owned.indexOf(card_id)>=0?true:false;
  }
  const cards=useContext(CardContext);
  const userdata=useContext(UserContext);

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
              {cards.cards.data.map(({card_name,issuer,card_id,image})=>(
                <IonItem>
                  <IonThumbnail className='thumbnail' slot='start'>
                    <IonImg className='fit-thumbnail'  src={image}></IonImg>
                  </IonThumbnail>
                  <IonLabel>
                    <IonBadge color="medium" className='issuer-badge'><IonText>{cards.issuers.data[issuer].name}</IonText></IonBadge>
                    <h3>{card_name}</h3>
                  </IonLabel>
                  <IonLabel slot='end' className='ion-text-end'>
                      <IonCheckbox checked={userOwnsCard(card_id)} onIonChange={cardCheckbox}></IonCheckbox>
                  </IonLabel>
              </IonItem>
              ))}
              
          </IonList>
          </IonContent>
    </IonPage>
  );
};

export default AddCardPage;
