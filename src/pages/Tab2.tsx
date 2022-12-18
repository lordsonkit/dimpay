import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useContext } from 'react';
import { CardContext, RewardsContext } from '../App';
import ExploreContainer from '../components/ExploreContainer';
import { UserContext } from '../reducer/UserDataReducer';
import './Tab2.css';
const rewards=['a','b','c']
const Tab2: React.FC = () => {
  const pageRewardList=[];

  const {cardData}=useContext(CardContext)
  const {rewardData}=useContext(RewardsContext);
  const {userData}=useContext(UserContext);
  //get reward data for user's card universe
  for(var k in rewardData.rewards.data){
    if(rewardData.rewards.data[k].target_cards.map(String).filter(value => (Object.keys(userData.card_owned)).includes(value)).length>0){
      //Offer releates to user
      if(!rewardData.rewards.data[k].aux){
        //not auxilary offer
        for (var j = 0; j < rewardData.rewards.data[k].offer_time.length; j++) {
          if ((rewardData.rewards.data[k].offer_time[j][0] < new Date().getTime()/1000) && (new Date().getTime()/1000 < rewardData.rewards.data[k].offer_time[j][1])) {
              //offer is running
              pageRewardList.push(k);
              break;
          }
        }
      }
      
      
    }
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>發現獎賞</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">發現獎賞</IonTitle>
          </IonToolbar>
        </IonHeader>
        {pageRewardList.map((reward_id) => (<IonCard key={reward_id}>
          <div className='headerImage' style={{backgroundImage:"url("+(rewardData.rewards.data[reward_id].reward_banners[0]||cardData.cards.data[rewardData.rewards.data[reward_id].target_cards[0]]?.image)+")"}}></div>
          <IonCardHeader>
            <IonCardTitle>{rewardData.rewards.data[reward_id].reward_name}</IonCardTitle>
            <IonCardSubtitle>{cardData.cards.data[rewardData.rewards.data[reward_id].target_cards[0]]?.card_name}{rewardData.rewards.data[reward_id].target_cards.length>1?"及"+(rewardData.rewards.data[reward_id].target_cards.length-1)+"張其他":""}</IonCardSubtitle>
            {getRewardDateRangeText(reward_id)}

          </IonCardHeader>
          <IonCardContent>Content</IonCardContent>
        </IonCard>))}
        
      </IonContent>
    </IonPage>
  );

  function getRewardCurrenctSession(k:string):number[]{
    for (var j = 0; j < rewardData.rewards.data[k].offer_time.length; j++) {
      if ((rewardData.rewards.data[k].offer_time[j][0] < new Date().getTime()/1000) && (new Date().getTime()/1000 < rewardData.rewards.data[k].offer_time[j][1])) {
       
          return rewardData.rewards.data[k].offer_time[j]
      }
    }
    return [0,0]  
  }
  function getRewardDateRangeText(k:string){
    let session=getRewardCurrenctSession(k);
    if(session[1]<new Date().getTime()/1000+86400*365*3){
      //reward end within 3 years
      return <IonCardSubtitle>{new Date(session[0]*1000).toISOString().split('T')[0] +" - "+new Date(session[1]*1000).toISOString().split('T')[0]}</IonCardSubtitle>
    }
  }

};



export default Tab2;
