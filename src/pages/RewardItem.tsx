import { IonBackButton, IonBadge, IonButton, IonButtons, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSlide, IonSlides, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { add, cog, pencil, search } from 'ionicons/icons';
import { useContext, useReducer } from 'react';
import { useParams } from 'react-router';
import { RewardsContext } from '../App';
import { UserContext } from '../reducer/UserDataReducer';
import './RewardItem.css';
const RewardItem: React.FC = () => {
  const {rewardData}=useContext(RewardsContext)
  const {userData,toggleUserRewardExemption}=useContext(UserContext);

  const params = useParams<{id?:string}>();
  const reward_id=params.id;
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
        {rewardData.rewards.data[reward_id].reward_banners.length>0&&<IonSlides pager options={{speed:500, autoplay:{delay:10000}}}>
          {rewardData.rewards.data[reward_id].reward_banners.map((item)=>(
            <IonSlide> 
            <img src={item}></img>
            </IonSlide>
          ))}
          
        </IonSlides>}
        
        
        <div className='ion-padding-start ion-padding-end'>
            <IonText><h1>{rewardData.rewards.data[reward_id].reward_name}</h1></IonText>
            <p>{getRewardPeriod(reward_id)}</p>
            <IonBadge color="medium" className='condition-badge'><IonText>需登記</IonText></IonBadge>
            <IonBadge color="medium" className='condition-badge'><IonText>流動支付</IonText></IonBadge>        
            <hr/>
            <div>
                <IonText style={{whiteSpace:"pre-wrap"}}>{rewardData.rewards.data[reward_id].reward_description}</IonText>
            </div>

            <br></br>
            <IonButton expand='block' size="default" slot='start' color="medium" onClick={e=>toggleUserRewardExemption(reward_id,isRewardExempted(reward_id))}>{
              isRewardExempted(reward_id)?"不納入考慮獎賞計算":"從不納入考慮列表剔除"
            }</IonButton>
            <div className='bottom-button'>
            <IonButton expand='block' size="default" style={{width:"100%"}}  target='_blank' href={rewardData.rewards.data[reward_id].reg_link} >登記優惠</IonButton>
            </div>

            
        </div>
      </IonContent>
    </IonPage>
    
  );
  function getRewardPeriod(reward_id){

    return ""
  }

  function isRewardExempted(reward_id){
    return userData.opt_out_offers.indexOf(reward_id)
  }
};

export default RewardItem;
