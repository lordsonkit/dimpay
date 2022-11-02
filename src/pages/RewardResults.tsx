import { IonAvatar, IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemGroup, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSearchbar, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { add, pin } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './RewardResults.css';


const RewardResultsPage: React.FC = () => {
    const [spendAmount,setSpendAmount] = useState('100');  
  function spendValueUpdate(newSpendValue:any){
    setSpendAmount(newSpendValue);
  }  

  const valueRef = useRef(null);

  useEffect(() => {
    console.log(valueRef.current)
    setTimeout(function(){
      valueRef.current.setFocus()
    },500)
  },[])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton/>
          </IonButtons>
          <IonTitle>最佳信用卡</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <div className="ion-padding-start ion-padding-end ion-text-center">
            <IonAvatar className='image-center'>
                <img src='/assets/images/merchants/donki.png' ></img>
            </IonAvatar>
            <IonLabel>Donki Central</IonLabel>
            <IonGrid>
                <IonRow>
                    <IonCol size='2'></IonCol>
                    <IonCol size='8'>
                        <IonItem className="custom">
                            $<IonInput type='number' ref={valueRef} placeholder='100' value={spendAmount} className='ion-text-center' onIonFocus={e => spendValueUpdate(e.target.value)} onIonBlur={e => spendValueUpdate(e.target.value)}  onIonInput={e => spendValueUpdate(e.target.value)}></IonInput>
                        </IonItem>
                    </IonCol>
                    <IonCol size='2'></IonCol>
                </IonRow>
            </IonGrid>
            
            
          </div>
          <IonCard color="light">
                <IonCardContent className="adcontent">
                    <IonItem>
                        <IonThumbnail slot='start' className="float-left"><IonImg  className='fit-thumbnail' src="/assets/images/hsbcvs.webp"></IonImg></IonThumbnail>
                        
                        <IonLabel className='ion-text-end float-right' slot='end'> 
                            <IonBadge className='bold' color="success"><h3><b>$2 / A</b></h3></IonBadge><br/>
                            <div className='ion-text-center'><IonText color="success">+50A</IonText></div>
                        </IonLabel>
                        <div>
                            <IonText className='fontsize-80'>國泰渣打Mastercard</IonText><br/>
                            <IonBadge color="medium" className='issuer-badge'><IonText>贊助</IonText></IonBadge>
                        </div>
                        
                    </IonItem>
                    
                    
                    <IonLabel slot='end'>
                        <div className=''>
                            <IonText>使用此卡進行本交易比你現有最佳的信用卡<b>多賺 {parseInt(spendAmount)/2||0}A</b></IonText>
                        </div>
                        <div>
                            <IonText>由2022年7月1日起，全新信用卡客戶於每個信用卡年度，可尊享10張可共享的國泰航空商務貴賓室使用券、於商務客艙專櫃辦理登機手續及享用優先登機服務</IonText>
                        </div>

                    </IonLabel>
                    
                </IonCardContent>
            </IonCard>
          <IonList>
              <IonListHeader>
                  我持有的信用卡
                  
              </IonListHeader>
              <IonItem routerLink={'/rewardBreakdown/'+15123+'/'+1} routerDirection='forward'>
                  <IonThumbnail slot='start'><IonImg  className='fit-thumbnail' src="/assets/images/hsbcvs.webp"></IonImg></IonThumbnail>
                  <IonLabel>
                    <IonBadge color="medium" className='issuer-badge'><IonText>匯豐</IonText></IonBadge>
                    <h3>Visa Signature卡</h3>
                  </IonLabel>
                  <IonLabel slot='end' className='ion-text-end'>
                      <IonBadge className='bold' color="success"><h1><b>$2 / A</b></h1></IonBadge>
                      <p>A {parseInt(spendAmount)/2||0} / ${parseInt(spendAmount)/2*0.08||0}</p>
                      <p>{100/2*0.08}%</p>
                  </IonLabel>
              </IonItem>
          </IonList>

          <IonList>
              <IonListHeader>未持有的信用卡</IonListHeader>
              <IonItem>
                  <IonThumbnail className='thumbnail' slot='start'><IonImg className='fit-thumbnail'  src="/assets/images/hsbcvs.webp"></IonImg></IonThumbnail>
                  <IonLabel>
                    <IonBadge color="medium" className='issuer-badge'><IonText>匯豐</IonText></IonBadge>
                    <h3>Visa Signature卡</h3>
                  </IonLabel>
                  <IonLabel slot='end' className='ion-text-end'>
                      <IonText className='bold'><h1><b>3.6%</b></h1></IonText>
                      <p>$7.2</p>
                  </IonLabel>
              </IonItem>
          </IonList>
          
      </IonContent>
    </IonPage>
  );
};

export default RewardResultsPage;
