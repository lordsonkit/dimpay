import { IonCard, IonCardContent, IonItem, IonThumbnail, IonImg, IonLabel, IonBadge, IonText } from '@ionic/react';
import './ExploreContainer.css';

interface ContainerProps {
  mcc: boolean;
  code: string;
  spend_amount: string;
}

const CardAd: React.FC<ContainerProps> = ({ mcc, code, spend_amount }) => {
  return (
    
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
                <IonText>使用此卡進行本交易比你現有最佳的信用卡<b>多賺 {parseInt(spend_amount)/2||0}A</b></IonText>
            </div>
            <div>
                <IonText>由2022年7月1日起，全新信用卡客戶於每個信用卡年度，可尊享10張可共享的國泰航空商務貴賓室使用券、於商務客艙專櫃辦理登機手續及享用優先登機服務</IonText>
            </div>

        </IonLabel>
        
    </IonCardContent>
</IonCard>
  );
};

export default CardAd;
