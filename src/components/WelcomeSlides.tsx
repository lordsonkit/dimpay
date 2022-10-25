import { IonButton, IonContent, IonSlide, IonSlides } from "@ionic/react";

interface ContainerProps {}

const WelcomeSlides: React.FC<ContainerProps> = () => {
  return (
    <IonContent scrollY={false} fullscreen={true}>
      <IonSlides>
          <IonSlide><h1>Slide 1</h1></IonSlide>
          <IonSlide><h1>Slide 2</h1></IonSlide>
          <IonSlide>
            <h1>Slide 3</h1>
            <IonButton>Add Card</IonButton>
          </IonSlide>
      </IonSlides>
    </IonContent>
    
  );
};

export default WelcomeSlides;
