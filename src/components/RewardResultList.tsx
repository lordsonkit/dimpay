import { IonItem, IonThumbnail, IonImg, IonLabel, IonBadge, IonText } from "@ionic/react";
import { useHistory } from "react-router";
import { ConditionalWrapper } from "./ConditionalWrapper";
import { humanize } from "./humanize";

interface ContainerProps {
  cardlist: any,
  mcc_query: boolean,
  query_id: string,
  cardData: any,
  spend_amount: number,
  spend_currency: string
}
interface RewardBreakdownProps{card_id:string, mcc_query:boolean, query_id:string, spend_amount:number, spend_currency:string}


const RewardResultList: React.FC<ContainerProps> = ({ cardlist,mcc_query,query_id,cardData,spend_amount,spend_currency }) => {
    const history=useHistory();

    function viewRewardBreakdown(card_id:string,mcc_query:boolean,query_id:string,spend_amount:number,spend_currency:string=""){
        history.push({
            pathname:"/rewardBreakdown",
            state:{
                card_id:card_id,
                mcc_query:mcc_query,
                query_id:query_id,
                spend_amount:spend_amount,
                spend_currency:spend_currency
            }
        })
    }
  return (
    <>
    {cardlist.map(({card_name,earn_miles,has_mileage_programme,miles_currency_in_context,image,issuer,card_id,best_return_choice,miles_reward_incontext,cash_reward_incontext,best_return_ratio,best_return_ratio_miles,best_item}) => (
                <IonItem key={(mcc_query?"mcc":"")+query_id+"_"+card_id} onClick={e=>viewRewardBreakdown(card_id,mcc_query,query_id,spend_amount,spend_currency)}>
                  <IonThumbnail slot='start'><IonImg  className='fit-thumbnail' src={image}></IonImg></IonThumbnail>
                  <IonLabel>
                    <IonBadge color="medium" className='issuer-badge'><IonText>{cardData.issuers.data[issuer].name}</IonText></IonBadge>
                    <h3>{card_name}</h3>
                  </IonLabel>
                  <IonLabel slot='end' className='ion-text-end'>
                      {((earn_miles||has_mileage_programme) && best_return_choice=="miles") ? <>
                        <ConditionalWrapper condition={best_item} wrapper={children=><IonBadge className='bold' color="success">{children}</IonBadge>}>
                          <h1><b>$ {humanize(best_return_ratio_miles)} / {cardData.mileages?.[miles_currency_in_context].unit||"(?)"}</b></h1>
                        </ConditionalWrapper>
                        
                        <p>{cardData.mileages?.[miles_currency_in_context].unit||"(?)"} {humanize(miles_reward_incontext)||0} / ${humanize(cash_reward_incontext)||0}</p>
                        <p>{humanize(best_return_ratio)}%</p>
                      </> : <>
                        <IonText className='bold'><h1><b>{humanize(best_return_ratio)}%</b></h1></IonText>
                        <p>${humanize(cash_reward_incontext)}</p>
                      </>
                      }
                  </IonLabel>
              </IonItem>
              ))}
    </>
  );
};

  
export default RewardResultList;
