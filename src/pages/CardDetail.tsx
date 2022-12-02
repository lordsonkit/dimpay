import { IonRadio } from '@ionic/core/components';
import { IonAvatar, IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemGroup, IonItemOption, IonLabel, IonList, IonListHeader, IonModal, IonNote, IonPage, IonProgressBar, IonRadioGroup, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { add, pin, pulse } from 'ionicons/icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { CardContext } from '../App';
import ExploreContainer from '../components/ExploreContainer';
import UserDataReducerProvider, { UserContext } from '../reducer/UserDataReducer';
import './RewardResults.css';



const CardDetailPage: React.FC = () => {
  const param=useParams<{id?:string}>()
    const [spendAmount,setSpendAmount] = useState('100');  
  function spendValueUpdate(newSpendValue:any){
    setSpendAmount(newSpendValue);
  }  
  const {userData,setUserCardOptions}=useContext(UserContext);


  const {cardData,setCardData}=useContext(CardContext)

  function setUserCardExpDate(e){
    setUserCardOptions(param.id,["expiry"],new Date(e.detail.value).getTime()/1000)
  }

  function setUserBillingDate(e){
    setUserCardOptions(param.id,["billing_date"],e.target.value)
  }
  function setUserCardPremiumBanking(e){
    setUserCardOptions(param.id,['user_has_premium_banking'],e.detail.checked)
  }
  function setUserCardPrivateBanking(e){
    setUserCardOptions(param.id,['user_has_private_banking'],e.detail.checked)
  }
  function setUserCardCustomMiles(e,miles_currency){
    setUserCardOptions(param.id,['mileage_program_override',miles_currency],parseFloat(e.target.value))
  }
  function setCardBoostValue(e){
    setUserCardOptions(param.id,['card_reward_multiplier'],parseFloat(e.target.value))
  }
  let active_card_id=param.id;

  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton/>
          </IonButtons>
          <IonTitle>信用卡設定</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <div className="ion-padding-start ion-padding-end ion-margin-top ion-padding-top ion-text-center">
            <IonImg src={cardData.cards.data[active_card_id].image} className="card_hero"></IonImg>
            <IonText><h2>{cardData.cards.data[active_card_id].card_name}</h2></IonText><br/>
          </div>
          <IonList>

              { true && <><IonItem id="open-modal">
                  <IonLabel slot='start'>
                    <h3>信用卡到期月份</h3>
                    <p className='muted'>提醒要求免年費或取消</p>
                  </IonLabel>
                  <IonDatetimeButton slot="end" datetime='datetime_cardexp'></IonDatetimeButton>
                  <IonModal keepContentsMounted={true}  trigger='open-modal'>
                    <IonDatetime id='datetime_cardexp' presentation='date' value={new Date((userData.card_owned[active_card_id]?.expiry||0)*1000).toISOString()}   size="cover"  onIonChange={(e)=>setUserCardExpDate(e)} showDefaultButtons={true} preferWheel={true}></IonDatetime>
                  </IonModal>
              </IonItem>
              </> }
              { true && <IonItem>
                  
                  <IonLabel>
                    <h3>結算日</h3>
                    <p className='muted'>每月獎賞消費額度</p>
                  </IonLabel>
                  <IonLabel slot='end' className='ion-text-end'>
                    <IonInput type={'number'} min={1} max={30} value={userData.card_owned[active_card_id]?.billing_date} onIonInput={(e)=>setUserBillingDate(e)} ></IonInput>
                    
                      
                  </IonLabel>
              </IonItem> }
              
              { cardData.cards.data[active_card_id].has_premium_banking_offer && <IonItem>
                  
                  <IonLabel>
                    <h3>持有發卡行優越帳戶</h3>
                    <p className="muted">部分特選優惠適用</p>
                  </IonLabel>
                  <IonCheckbox slot="end" checked={userData.card_owned[active_card_id]?.user_has_premium_banking} onIonChange={(e)=>setUserCardPremiumBanking(e)}></IonCheckbox>
                  
              </IonItem> }

              { cardData.cards.data[active_card_id].has_private_banking_offer && <IonItem>
                  
                  <IonLabel>
                    <h3>持有發卡行私人銀行帳戶</h3>
                    <p className="muted">部分特選優惠適用</p>
                  </IonLabel>
                  <IonCheckbox slot="end" checked={userData.card_owned[active_card_id]?.user_has_private_banking} onIonChange={(e)=>setUserCardPrivateBanking(e)}></IonCheckbox>

              </IonItem> }

              
          </IonList>
          <br></br>
          <IonList>
          <IonListHeader><b>進階設定</b></IonListHeader>
          <IonItem>
            <IonLabel slot='start'>
              <IonText>信用卡獎賞調整比率</IonText>
              <p color='muted'>調整獎賞的價值</p>
              <p color='muted'>基準獎賞為100%</p>
            </IonLabel>
            <IonInput slot="end" className='ion-text-end' value={parseInt(userData.card_owned[active_card_id]?.card_reward_multiplier)} onIonChange={event => setCardBoostValue(event)}></IonInput>
          </IonItem>
          </IonList>
          <br></br>
          <IonList>
          {
            cardData.cards.data[active_card_id].has_mileage_programme && <>
            
            <IonListHeader>
              <b>獎賞兌換比率</b>
            </IonListHeader>
            <IonItem>
              <IonLabel>
                <p color='muted'>對應獎賞兌換不時提供的額外加乘，用戶可自行設定獎賞兌換率</p>
              </IonLabel>
            </IonItem>
            {Object.keys(cardData.cards.data[active_card_id].mileage_programme).map((item)=>(<IonItem key={item}>
                  <IonLabel slot="start">
                    <h3>每 $1 獎賞 {cardData.mileages?.[item].name} 兌換比率</h3>
                  </IonLabel>
                  <IonInput className='ion-text-end' type='number' min="0" slot='end' value={(!userData.card_owned[active_card_id].mileage_program_override?.[item]&&userData.card_owned[active_card_id].mileage_program_override?.[item]!==0)?cardData.cards.data[active_card_id].mileage_programme[item]:userData.card_owned[active_card_id].mileage_program_override?.[item]} onIonChange={(e)=>setUserCardCustomMiles(e,item)}></IonInput>
                  
              </IonItem>))}
            
            </>
          }
          </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CardDetailPage;
