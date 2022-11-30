import { IonAvatar, IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemGroup, IonLabel, IonList, IonListHeader, IonPage, IonProgressBar, IonRow, IonSearchbar, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { add, pin, pulse } from 'ionicons/icons';
import { useState } from 'react';
import { useLocation } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './RewardResults.css';


const RewardBreakdown: React.FC = () => {
  const loc=useLocation();
  console.log(loc.state)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton/>
          </IonButtons>
          <IonTitle>優惠分項明細</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <div className="ion-padding-start ion-padding-end ion-text-center">
            <IonAvatar className='image-center'>
                <img src='/assets/images/cards/hsbcvs.png' ></img>
            </IonAvatar>
            <IonAvatar className='image-center'>
                <img src='/assets/images/merchants/donki.png' ></img>
            </IonAvatar>
            <IonLabel>Donki Central</IonLabel><br/>
            <IonText className="custom">$123</IonText>
            <IonButton size='large' expand='block' routerLink='/' routerDirection='root'><IonIcon icon={add}></IonIcon> 紀錄我的消費</IonButton>
            
          </div>

          <IonList>
              <IonListHeader>
                  優惠分項
              </IonListHeader>
              <IonItem routerLink={'/rewardItem/'+8502} routerDirection='forward'>
                  <IonLabel>
                    <h2>基本消費回贈</h2>
                    <IonBadge color="medium" className='condition-badge'><IonText>需登記</IonText></IonBadge>
                    <IonBadge color="medium" className='condition-badge'><IonText>流動支付</IonText></IonBadge>
                    <IonBadge color="medium" className='condition-badge'><IonText>最低簽帳</IonText></IonBadge>
                    <IonBadge color="medium" className='condition-badge'><IonText>低額度</IonText></IonBadge>
                    <IonBadge color="medium" className='condition-badge'><IonText>拍卡支付</IonText></IonBadge>
                  </IonLabel>
                  <IonLabel slot='end' className='ion-text-end'>
                      <IonBadge className='bold'><h3><b>$2 / A</b></h3></IonBadge>
                  </IonLabel>
              </IonItem>
              <IonItem routerLink={'/rewardItem/'+8502} routerDirection='forward'>
                  <IonLabel>
                    <h2>最紅夏日消費</h2>
                    <IonBadge color="medium" className='condition-badge'><IonText>需登記</IonText></IonBadge>
                    <IonBadge color="medium" className='condition-badge'><IonText>流動支付</IonText></IonBadge>
                    <IonBadge color="medium" className='condition-badge'><IonText>最低簽帳</IonText></IonBadge>
                    <IonBadge color="medium" className='condition-badge'><IonText>低額度</IonText></IonBadge>
                    <IonBadge color="medium" className='condition-badge'><IonText>拍卡支付</IonText></IonBadge>
                    <h3>簽帳進度（最低簽帳額）</h3>
                    <IonProgressBar value={1}></IonProgressBar>
                    <h3>簽帳進度（最多可賺取回贈）</h3>
                    <IonProgressBar value={0.8}></IonProgressBar>
                  </IonLabel>
                  <IonLabel slot='end' className='ion-text-end'>
                      <IonBadge className='bold'><h3><b>$2 / A</b></h3></IonBadge>
                  </IonLabel>
              </IonItem>
          </IonList>

          
      </IonContent>
    </IonPage>
  );
};

export default RewardBreakdown;
