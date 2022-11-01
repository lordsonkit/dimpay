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
  const cards= useContext(CardContext);
  const {userdata,setUserdata} = useContext(UserContext);
  
  return (
    <div className="card_content">
      <div className="mirrored fit_wrapper">
      {userdata.card_owned.map((card_id) => (
        <div className="stackCards mirrored" key={card_id}><img src={cards.data[card_id].image}></img></div>
      ))}
      </div>
    </div>
  );
};

export default MyCards;
