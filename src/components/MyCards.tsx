import { IonButton, IonContent, IonSlide, IonSlides } from "@ionic/react";
import './MyCards.css'

interface UserOwnedCard {
  cardName: string; cardId: string; cardImage: string
}

interface UserOwnedCards extends Array<UserOwnedCard>{}

interface ContainerProps {
  cardsArray: UserOwnedCards
}


const MyCards: React.FC<ContainerProps> = ({cardsArray}) => {
  return (
    <div className="card_content">
      {cardsArray.map(({cardName, cardImage, cardId}) => (
        <div className="stackCards"><img src={cardImage}></img></div>
      ))}
      <div className="stackCards"><img src="/assets/images/hsbcvs.webp"></img></div>
    </div>
  );
};

export default MyCards;
