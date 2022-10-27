import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Welcome.css';
import WelcomeSlides from '../components/WelcomeSlides';
import { bag, card, eye } from 'ionicons/icons';

const Welcome: React.FC = () => {
  return (
    <IonPage className='welcomepage_bg'>
      <IonContent fullscreen>
                <div className='container'>

                    <h1>簽邊張 App</h1>
                    <div className='content'>
                        <IonText><IonIcon icon={card}></IonIcon> 幫你揀最適合嘅信用卡消費，每次都賺盡回贈</IonText><br/><br/>
                        <IonText><IonIcon icon={eye}></IonIcon> 追蹤你賺取信用卡回贈嘅簽帳進度，唔會錯過任何迎新獎賞同限時優惠</IonText><br/><br/>
                        <IonText><IonIcon icon={bag}></IonIcon> 為你建議最適合你消費習慣嘅信用卡</IonText>
                    </div>
                </div>
        <IonButton className="bottom-button" routerDirection='root' routerLink='/homepage'>開始使用</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
