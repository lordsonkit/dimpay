import { IonBackButton, IonBadge, IonButton, IonButtons, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSlide, IonSlides, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { add, cog, pencil, search } from 'ionicons/icons';
import './RewardItem.css';
const RewardItem: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton/>
          </IonButtons>
          <IonTitle>優惠</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSlides pager options={{speed:500, autoplay:{delay:10000}}}>
          <IonSlide> 
            <img src="https://ionic-docs-demo.herokuapp.com/assets/card-top-img.png"></img>
          </IonSlide>
          <IonSlide>
          <img src="https://ionic-docs-demo.herokuapp.com/assets/card-top-img.png"></img>
          </IonSlide>
        </IonSlides>
        
        <div className='ion-padding-start ion-padding-end'>
            <IonText><h1>匯豐最紅夏日獎賞</h1></IonText>
            <p>2022-10-01 ~ 2022-12-31</p>
            <IonBadge color="medium" className='condition-badge'><IonText>需登記</IonText></IonBadge>
            <IonBadge color="medium" className='condition-badge'><IonText>流動支付</IonText></IonBadge>        
            <hr/>
            <div>
                <IonText>由2022年7月1日起，全新信用卡客戶於每個信用卡年度，可尊享10張可共享的國泰航空商務貴賓室使用券、於商務客艙專櫃辦理登機手續及享用優先登機服務</IonText>
            </div>
            <IonButton expand='block' target='_blank' href='https://google.com' className='bottom-button'>申請優惠</IonButton>
        </div>
      </IonContent>
    </IonPage>
    
  );
};

export default RewardItem;
