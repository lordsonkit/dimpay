/* eslint-disable jsx-a11y/alt-text */
import { IonButton, IonContent, IonSlide, IonSlides } from "@ionic/react";
import { useContext } from "react";
import { CardContext, UserContext } from "../App";
import './MyCards.css'

interface UserOwnedCard {
  cardName: string; cardId: string; cardImage: string
}

interface UserOwnedCards extends Array<UserOwnedCard>{}

interface ContainerProps {
  cardsArray: UserOwnedCards
}


const MyCards: React.FC<ContainerProps> = () => {
  const {cardData,setCardData}= useContext(CardContext);
  const {userData,setUserData} = useContext(UserContext);
  
  return (
    <div className="card_content">
      <div className="mirrored fit_wrapper">
      {userData.card_owned.map((card_id) => (
        <div className="stackCards mirrored" key={card_id}><img src={cardData.cards.data[card_id].image}></img></div>
      ))}
      </div>
    </div>
  );
};

export default MyCards;
