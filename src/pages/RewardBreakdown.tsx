import { IonAvatar, IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemGroup, IonLabel, IonList, IonListHeader, IonPage, IonProgressBar, IonRow, IonSearchbar, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { add, addCircleOutline, addOutline, pin, pulse, pulseOutline } from 'ionicons/icons';
import { useContext, useState } from 'react';
import { useLocation } from 'react-router';
import { CardContext, MerchantListContext, RewardsContext } from '../App';
import { CalculateCardRewardInContext } from '../components/CalculateCardRewardInContext';
import ExploreContainer from '../components/ExploreContainer';
import { humanize } from '../components/humanize';
import RewardBreakdownList from '../components/RewardBreakdownList';
import { UserContext } from '../reducer/UserDataReducer';
import './RewardBreakdown.css';


const RewardBreakdown: React.FC = () => {
  console.log("RewardBreakdown Page Render")
  const location = useLocation<{ card_id: number, mcc_query: boolean, query_id: string, spend_amount: number, spend_currency: string, user_payment_method: string }>();
  const { cardData } = useContext(CardContext)
  const { merchantData } = useContext(MerchantListContext)
  const { rewardData } = useContext(RewardsContext);
  const { userData, removeCard, addCard, addTransactionHistory } = useContext(UserContext);
  const [ useNotional, setUseNotional ] = useState(false);

  //Catch unload error
  if (!location.state) {
    return (<IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton />
          </IonButtons>
          <IonTitle>優惠分項明細</IonTitle>
        </IonToolbar>
      </IonHeader></IonPage>)
  }
  const { card_id, mcc_query, query_id, spend_amount, spend_currency,user_payment_method } = location.state

  let result = {
    "best_return_ratio": 0,
    "best_return_ratio_miles": 0,
    "best_return_choice": "cash",
    "cash_reward_incontext": 0,
    "miles_reward_incontext": 0,
    "reward_breakdown": [],
    "payment_method_limit": [],
    "miles_currency_in_context": "",
    "ineligible_rewards":[],
    "best_item": false,
    "bill_size":0,
    "spend_currency":"hkd"
}
  result=CalculateCardRewardInContext(card_id, mcc_query, query_id, spend_amount,spend_currency,user_payment_method);
  //warp 
  console.log(result)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton />
          </IonButtons>
          <IonTitle>優惠分項明細</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="ion-padding-start ion-padding-end ion-margin-top ion-padding-top ion-text-center">
          <div style={{ marginTop: "50px", backgroundImage: "url(" + cardData.cards.data?.[card_id].image + ")", backgroundPosition: "center", backgroundSize: "contain", backgroundRepeat: "no-repeat" }} className="card_hero ion-text-center">
            <IonAvatar className='image-center breakdown-avatar' style={{width: "100px", height:"100px", position: "relative", bottom: "50px"}}>
              <img src={mcc_query?merchantData.merchant_code?.[query_id].image:merchantData.merchants.data?.[query_id].image} ></img>
            </IonAvatar>
          </div>
          <div>
            <IonText>
              <h2>{ mcc_query ? merchantData.merchant_code?.[query_id].name : merchantData.merchants.data[query_id].name }</h2>
            </IonText>
            <IonText className="custom">${spend_amount}</IonText>
            <div className='ion-padding' onClick={e=>setUseNotional(!useNotional)}>
              {useNotional ? <>
              <IonBadge  color={result.best_return_choice==='cash'?"light":"success"}>${humanize(result.best_return_ratio_miles)} / {cardData.mileages[result.miles_currency_in_context].unit}</IonBadge> {cardData.cards.data[card_id].earn_cash==true && <IonBadge color={result.best_return_choice==='cash'?"success":"light"}>現金回贈 {humanize(result.cash_reward_incontext/spend_amount*100)}%</IonBadge>}
              </>:<>
              <IonBadge  color={result.best_return_choice==='cash'?"light":"success"}>{humanize(result.miles_reward_incontext)} {cardData.mileages[result.miles_currency_in_context].unit}</IonBadge> {cardData.cards.data[card_id].earn_cash==true &&<IonBadge  color={result.best_return_choice==='cash'?"success":"light"}>現金 ${humanize(result.cash_reward_incontext)}</IonBadge>}
              </>}
              
              <br />
              <IonBadge color="success">等值回贈 {humanize(result.best_return_ratio)}%</IonBadge>
            </div>
          </div>
        </div>
        <RewardBreakdownList eligible_list={true} list_items={result.reward_breakdown} context={result} ></RewardBreakdownList>
        <br/>
        <RewardBreakdownList eligible_list={false} list_items={result.ineligible_rewards}  context={result} ></RewardBreakdownList>

            <br></br>
            <br></br>
            <br></br>
            <br></br>

        <div className='bottom-button'>
          <IonButton size='large' expand='block' onClick={e=>addTransactionHistory({
            time:new Date().getTime()/1000,
            card_id, 
            mcc_query,
            query_id, 
            spend_amount,
            spend_currency,
            user_payment_method
            })} routerLink={"/tabs/tab3"} routerDirection="root"><IonIcon icon={addCircleOutline} slot="start"></IonIcon>紀錄消費</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RewardBreakdown;

