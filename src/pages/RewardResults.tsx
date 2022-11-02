import { IonAvatar, IonBackButton, IonBadge, IonButtons, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { CardContext, MerchantListContext } from '../App';
import CardAd from '../components/CardAd';
import MyCards from '../components/MyCards';
import { UserContext } from '../reducer/UserDataReducer';
import './RewardResults.css';


const RewardResultsPage: React.FC = () => {
    const [spendAmount,setSpendAmount] = useState('100');  
  function spendValueUpdate(newSpendValue:any){
    setSpendAmount(newSpendValue);
  }  

  const valueRef = useRef(null);
  const params = useParams<{id?:string}>();
  const mcc_query=params.id.indexOf('mcc')===0
  const query_id=params.id.replace("mcc","")
  useEffect(() => {
    console.log(valueRef.current)
    setTimeout(function(){
      valueRef.current.setFocus()
      valueRef.current.children[0].select()
    },500)
  },[])
  
  const {cardData}=useContext(CardContext)
  const {merchantData}=useContext(MerchantListContext)
  const {userData,removeCard,addCard}=useContext(UserContext);
  const userOwnsCard = (card_id) => {
    console.log(userData.card_owned)
    return userData.card_owned.indexOf(card_id)>-1
  }
  const renderCardResults = () => {
    let ownedCards = [],
    notOwnedCards =[];

    for(var i=0;i< cardData.cards.data.length;i++){
      let item=cardData.cards.data[i];
      let manupulation_results={
        "best_return_ratio":0.08,
        "best_return_choice":"points",
        "cash_reward_incontext":0.06,
        "miles_reward_incontext":1
      }
      item={...item,...manupulation_results}
      if(userOwnsCard(cardData.cards.data[i].card_id)){
        ownedCards.push(item)
      }else{
        notOwnedCards.push(item)
      }
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
          <CardAd mcc={mcc_query} spend_amount={spendAmount} code={query_id}></CardAd>

          <IonList>
              <IonListHeader>
                  我持有的信用卡 
              </IonListHeader>
              {ownedCards.length === 0 && <MyCards></MyCards>} 
              {ownedCards.map(({card_name,image,issuer}) => (
                <IonItem routerLink={'/rewardBreakdown/'+(mcc_query?"mcc":"")+query_id+'/'+1} routerDirection='forward'>
                  <IonThumbnail slot='start'><IonImg  className='fit-thumbnail' src={image}></IonImg></IonThumbnail>
                  <IonLabel>
                    <IonBadge color="medium" className='issuer-badge'><IonText>{cardData.issuers.data[issuer].name}</IonText></IonBadge>
                    <h3>{card_name}</h3>
                  </IonLabel>
                  <IonLabel slot='end' className='ion-text-end'>
                      {(issuer===0) ? <>
                        <IonBadge className='bold' color="success"><h1><b>$2 / A</b></h1></IonBadge>
                        <p>A {parseInt(spendAmount)/2||0} / ${parseInt(spendAmount)/2*0.08||0}</p>
                        <p>{100/2*0.08}%</p>
                      </> : <>
                        <IonText className='bold'><h1><b>3.6%</b></h1></IonText>
                        <p>$7.2</p>
                      </>
                      }
                  </IonLabel>
              </IonItem>
              ))}
              
          </IonList>

          <IonList>
              <IonListHeader>未持有的信用卡</IonListHeader>
              {notOwnedCards.map(({card_name,image,issuer}) => (
                <IonItem routerLink={'/rewardBreakdown/'+(mcc_query?"mcc":"")+query_id+'/'+1} routerDirection='forward'>
                  <IonThumbnail slot='start'><IonImg  className='fit-thumbnail' src={image}></IonImg></IonThumbnail>
                  <IonLabel>
                    <IonBadge color="medium" className='issuer-badge'><IonText>{cardData.issuers.data[issuer].name}</IonText></IonBadge>
                    <h3>{card_name}</h3>
                  </IonLabel>
                  <IonLabel slot='end' className='ion-text-end'>
                      {(issuer===0) ? <>
                        <IonBadge className='bold' color="success"><h1><b>$2 / A</b></h1></IonBadge>
                        <p>A {parseInt(spendAmount)/2||0} / ${parseInt(spendAmount)/2*0.08||0}</p>
                        <p>{100/2*0.08}%</p>
                      </> : <>
                        <IonText className='bold'><h1><b>3.6%</b></h1></IonText>
                        <p>$7.2</p>
                      </>
                      }
                  </IonLabel>
              </IonItem>
              ))}
          </IonList>
          
      </IonContent>
    </IonPage>
  );
};

export default RewardResultsPage;
