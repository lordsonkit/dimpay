import { IonBackButton, IonBadge, IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonText, IonThumbnail, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import { useContext } from 'react';
import { CardContext } from '../App';
import { UserContext } from "../reducer/UserDataReducer";
import ExploreContainer from '../components/ExploreContainer';
import { useHistory } from 'react-router';
import { add, pencil, trashBin } from 'ionicons/icons';
import { trace } from 'console';

const AddCardPage: React.FC = () => {
  const history=useHistory();
  function userOwnsCard(card_id){
    console.log(userData.card_owned)
    return Object.keys(userData.card_owned).indexOf(card_id)>=0?true:false;
  }
  const {cardData}=useContext(CardContext);
  const {userData,removeCard,addCard}=useContext(UserContext);

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
                <IonItem key={card_id}>
                  <IonThumbnail className='thumbnail' slot='start'>
                    <IonImg className='fit-thumbnail'  src={image}></IonImg>
                  </IonThumbnail>
                  <IonLabel>
                    <IonBadge color="medium" className='issuer-badge'><IonText>{cardData.issuers.data[issuer].name}</IonText></IonBadge>
                    <h3>{card_name}</h3>
                  </IonLabel>
                  <IonLabel slot='end' className='ion-text-end'>
                    {userOwnsCard(card_id)?<>
                      <IonButton color="medium" fill="clear" onClick={e=>removeCard(card_id)}><IonIcon icon={trashBin}></IonIcon></IonButton>
                      <IonButton color="success" fill="outline" routerLink={'/cardDetails/'+card_id} routerDirection="forward"><IonIcon icon={pencil}></IonIcon></IonButton>
                      
                    </>:<>
                      <IonButton color="success" fill="outline" onClick={e=>addCard(card_id)} routerLink={'/cardDetails/'+card_id} routerDirection="forward"><IonIcon icon={add}></IonIcon></IonButton>
                    </>}
                      
                      
                  </IonLabel>
              </IonItem>
              ))}
              
          </IonList>
          </IonContent>
    </IonPage>
  );
};

export default AddCardPage;
