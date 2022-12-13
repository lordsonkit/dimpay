import { IonRadio } from '@ionic/core/components';
import { IonAvatar, IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemGroup, IonItemOption, IonLabel, IonList, IonListHeader, IonModal, IonNote, IonPage, IonProgressBar, IonRadioGroup, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { add, addOutline, pin, pulse, trashBin } from 'ionicons/icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { CardContext } from '../App';
import ExploreContainer from '../components/ExploreContainer';
import UserDataReducerProvider, { UserContext } from '../reducer/UserDataReducer';
import './RewardResults.css';



const CustomRewardList: React.FC = () => {
    const { userData, setUserOptions } = useContext(UserContext);


    const { cardData, setCardData } = useContext(CardContext)


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>我的自定義優惠</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>


                <IonList>
                    {Object.keys(userData.custom_rewards).map((item) => (<IonItem key={item} routerLink={"/rewardItem/"+item}>

                        <IonThumbnail className='thumbnail' slot='start'>
                            <IonImg className='fit-thumbnail' src={cardData.cards.data[userData.custom_rewards[item].target_cards[0]].image}></IonImg>
                        </IonThumbnail>
                        {userData.custom_rewards[item].reward_name}
                        <IonLabel slot='end' className='ion-text-end'>
                                <IonButton color="medium" fill="clear" onClick={e => removeCustomReward(item)}><IonIcon icon={trashBin}></IonIcon></IonButton>
                        </IonLabel>

                    </IonItem>))}

                </IonList>
                <div className='bottom-button'>
                    <IonButton expand='block' size="large" style={{width:"100%"}} routerLink={"/settings/add_custom_reward"}><IonIcon icon={addOutline}></IonIcon> 添加優惠</IonButton>
                </div>

            

            </IonContent>
        </IonPage>
    );
    function removeCustomReward(item_id){
        //TODO
        return false
    }
};

export default CustomRewardList;
