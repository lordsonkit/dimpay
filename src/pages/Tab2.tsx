import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
const rewards=['a','b','c']
const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        {rewards.map((itemTitle) => (<IonCard>
          <img className='headerImage' src='https://ionic-docs-demo.herokuapp.com/assets/card-top-img.png' />
          <IonCardHeader>
            <IonCardSubtitle>Subtitle</IonCardSubtitle>
            <IonCardTitle>{itemTitle}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>Content</IonCardContent>
        </IonCard>))}
        
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
