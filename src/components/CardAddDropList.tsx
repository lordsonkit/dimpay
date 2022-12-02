import { IonItem, IonThumbnail, IonImg, IonLabel, IonBadge, IonText, IonButton, IonIcon } from "@ionic/react";
import { trashBin, pencil, add } from "ionicons/icons";
import { useContext } from "react";
import { useHistory } from "react-router";
import { CardContext } from "../App";
import { UserContext } from "../reducer/UserDataReducer";
import { ConditionalWrapper } from "./ConditionalWrapper";

interface ContainerProps {
  userHoldsCard: boolean
}


const CardAddDropList: React.FC<ContainerProps> = ({ userHoldsCard }) => {
  const history = useHistory();
  function userOwnsCard(card_id) {
    return Object.keys(userData.card_owned).indexOf(card_id) >= 0 ? true : false;
  }
  const { cardData } = useContext(CardContext);
  const { userData, removeCard, addCard } = useContext(UserContext);
  return (
    <>
      {cardData.cards.data.map(({ card_name, issuer, card_id, image }) => (
        userOwnsCard(card_id)==userHoldsCard && <IonItem key={card_id}>
          <IonThumbnail className='thumbnail' slot='start'>
            <IonImg className='fit-thumbnail' src={image}></IonImg>
          </IonThumbnail>
          <IonLabel>
            <IonBadge color="medium" className='issuer-badge'><IonText>{cardData.issuers.data[issuer].name}</IonText></IonBadge>
            <h3>{card_name}</h3>
          </IonLabel>
          <IonLabel slot='end' className='ion-text-end'>
            {userOwnsCard(card_id) ? <>
              <IonButton color="medium" fill="clear" onClick={e => removeCard(card_id)}><IonIcon icon={trashBin}></IonIcon></IonButton>
              <IonButton color="success" fill="outline" routerLink={'/cardDetails/' + card_id} routerDirection="forward"><IonIcon icon={pencil}></IonIcon></IonButton>

            </> : <>
              <IonButton color="success" fill="outline" onClick={e => addCard(card_id)} routerLink={'/cardDetails/' + card_id} routerDirection="forward"><IonIcon icon={add}></IonIcon></IonButton>
            </>}


          </IonLabel>
        </IonItem>
      ))}
    </>
  );
};

export default CardAddDropList;
