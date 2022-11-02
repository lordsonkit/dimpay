/* eslint-disable jsx-a11y/alt-text */
import { IonButton, IonContent, IonSlide, IonSlides } from "@ionic/react";
import { useContext } from "react";
import { CardContext } from "../App";
import { UserContext } from "../reducer/UserDataReducer";
import './MyCards.css';
import { useHistory } from "react-router-dom"

interface UserOwnedCard {
  cardName: string; cardId: string; cardImage: string
}

interface UserOwnedCards extends Array<UserOwnedCard>{}

interface ContainerProps {
  
}


const MyCards: React.FC<ContainerProps> = () => {
  const history = useHistory();
  const {cardData,setCardData}= useContext(CardContext);
  const {userData,setUserData} = useContext(UserContext);
  console.log('Render MyCards')
  console.log('Cards to render:'+JSON.stringify(userData.card_owned))
  return (
    <div className="card_content" onClick={(e)=>
      history.push('/addCard')
    }>
      <div className="mirrored fit_wrapper">
      {
      userData.card_owned.map((card_id) => (
        <div className="stackCards mirrored" key={card_id}><img src={cardData.cards.data[card_id].image}></img></div>
      ))}
      </div>
    </div>
  );
};

export default MyCards;
