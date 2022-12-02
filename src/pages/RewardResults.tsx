import { IonAvatar, IonBackButton, IonBadge, IonButtons, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { CardContext, MerchantListContext } from '../App';
import { CalculateCardRewardInContext } from '../components/CalculateCardRewardInContext';
import CardAd from '../components/CardAd';
import MyCards from '../components/MyCards';
import RewardResultList from '../components/RewardResultList';
import { UserContext } from '../reducer/UserDataReducer';
import './RewardResults.css';


const RewardResultsPage: React.FC = () => {
  const [spendAmount,setSpendAmount] = useState('100');  
  const [spendCurrency,setSpendCurrency] = useState('hkd');  
  const [paymentMethod,setPaymentMethod] = useState('swipe');  
  function spendValueUpdate(newSpendValue:any){
    setSpendAmount(newSpendValue);
  }  

  const valueRef = useRef(null);
  const params = useParams<{id?:string}>();
  const mcc_query=params.id.indexOf('mcc')===0
  const query_id=params.id.replace("mcc","")
  useEffect(() => {
    //console.log(valueRef.current)
    setTimeout(function(){
      valueRef.current.setFocus()
      valueRef.current.children[0].select()
    },500)
  },[])
  
  const {cardData}=useContext(CardContext)
  const {merchantData}=useContext(MerchantListContext)
  const {userData,removeCard,addCard}=useContext(UserContext);
  const userOwnsCard = (card_id) => {
    return Object.keys(userData.card_owned).indexOf(card_id)>-1
  }
  const renderCardResults = () => {
    let ownedCards = [],
    notOwnedCards =[];

    for(var i=0;i< cardData.cards.data.length;i++){
      let item=cardData.cards.data[i];
      let manipulation_results={
        "best_return_ratio":0,
        "best_return_ratio_miles":0,
        "best_return_choice":"cash",
        "cash_reward_incontext":0,
        "miles_reward_incontext":0,
        "reward_breakdown":[],
        "payment_method_limit":[],
        "miles_currency_in_context":"",
        "best_item":false
      }
      
      manipulation_results=CalculateCardRewardInContext(i,mcc_query,query_id,parseInt(spendAmount))
      item={...item,...manipulation_results}
      if(userOwnsCard(cardData.cards.data[i].card_id)){
        ownedCards.push(item)
      }else{
        notOwnedCards.push(item)
      }
    }
    
    if(ownedCards.length>0){
      ownedCards.sort(dynamicSort("-best_return_ratio"));
      ownedCards[0].best_item=true;
    }
    if(notOwnedCards.length>0){
      notOwnedCards.sort(dynamicSort("-best_return_ratio"));
      notOwnedCards[0].best_item=true;
    }
    return {ownedCards, notOwnedCards};
  }
  const {ownedCards, notOwnedCards}=renderCardResults();
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
          <div className="ion-padding-start ion-margin-top ion-padding-end ion-text-center">
            <IonAvatar className='image-center'>
                <img src={
              mcc_query ? (
                merchantData.merchant_code[query_id].image
              ):(
                merchantData.merchants.data[query_id].image
              )
            } alt="logo"></img>
            </IonAvatar>
            <br></br>
            <IonLabel className=" ion-margin-top ion-margin-bottom"><h1>{
              mcc_query ? (
                merchantData.merchant_code[query_id].name
              ):(
                merchantData.merchants.data[query_id].name
              )
            }</h1></IonLabel>
            <IonGrid>
                <IonRow>
                    <IonCol size='0' sizeSm='2'></IonCol>
                    <IonCol size='12' sizeSm='8'>
                        <IonItem className="custom">
                            $<IonInput type='number' ref={valueRef} placeholder='100' value={spendAmount} className='ion-text-center' onIonFocus={e => spendValueUpdate(e.target.value)} onIonBlur={e => spendValueUpdate(e.target.value)}  onIonInput={e => spendValueUpdate(e.target.value)}></IonInput>
                        </IonItem>
                        <IonItem className='ion-text-end'>
                          <IonSelect interface='action-sheet'  value={spendCurrency}>
                            {Object.keys(cardData.currencies).map((ccy) => (
                              <IonSelectOption value={ccy}>{cardData.currencies[ccy].name}</IonSelectOption>
                            ))}
                          </IonSelect>
                          <IonSelect interface='action-sheet' slot="end" value={paymentMethod}>
                          {Object.keys(cardData.payment_method).map((method) => (
                              <IonSelectOption value={method}>{cardData.payment_method[method]}</IonSelectOption>
                            ))}
                          </IonSelect>
                        </IonItem>
                    </IonCol>
                    <IonCol size='0' sizeSm='2'></IonCol>
                </IonRow>
            </IonGrid>
            
            
          </div>
          <CardAd mcc={mcc_query} spend_amount={spendAmount} code={query_id}></CardAd>

          <IonList>
              <IonListHeader>
                  我持有的信用卡 
              </IonListHeader>
              {ownedCards.length === 0 && <MyCards></MyCards>} 
              <RewardResultList cardData={cardData} mcc_query={mcc_query} query_id={query_id} cardlist={ownedCards} spend_amount={parseFloat(spendAmount)} spend_currency={spendCurrency}></RewardResultList>
              
              
          </IonList>

          <IonList>
              <IonListHeader>未持有的信用卡</IonListHeader>
              <RewardResultList cardData={cardData} mcc_query={mcc_query} query_id={query_id} cardlist={notOwnedCards} spend_amount={parseFloat(spendAmount)} spend_currency={spendCurrency}></RewardResultList>
              
          </IonList>
          
      </IonContent>
    </IonPage>
  );
};
const ConditionalWrapper = ({ condition, wrapper, children }) => 
  condition ? wrapper(children) : children;



function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  return function (a,b) {
      /* next line works with strings and numbers, 
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
  }
}
export default RewardResultsPage;
