import { IonItem, IonThumbnail, IonImg, IonLabel, IonBadge, IonText, IonList, IonListHeader, IonProgressBar, IonIcon } from "@ionic/react";
import { atCircle, checkmarkCircleOutline, closeCircle, closeCircleOutline, warning } from "ionicons/icons";
import { useContext } from "react";
import { useHistory } from "react-router";
import { CardContext, RewardsContext } from "../App";
import { CalculateCardRewardInContext } from "./CalculateCardRewardInContext";
import { ConditionalWrapper } from "./ConditionalWrapper";
import { humanize } from "./humanize";
import { INELIGIBLE_REASON } from "./IneligibleReason";

interface ContainerProps {
    eligible_list: boolean,
    list_items: RewardReason[],
    context: any
}
interface RewardReason {
    reward_id: number,
    reason: INELIGIBLE_REASON,
    limits: number,
    eligible: boolean,
    qualification_spend: number

}

let disqualification_reason = [
    "商戶不合資格",
    "商戶類型",
    "繳付帳單",
    "繳稅",
    "支付方式",
    "金額太小",
    "金額太大",
    "支付貨幣",
    "部分回贈",
    "部分日子",
    "部分日子",
    "除外商戶",
    "用戶剔除項目",
    "已超過優惠額度"
]

let reward_remarks_text = [
    "需登記"
]

const RewardBreakdownList: React.FC<ContainerProps> = ({ eligible_list, list_items, context }) => {
    const { cardData } = useContext(CardContext);
    const { rewardData } = useContext(RewardsContext);

    if (context.cash_reward_incontext && context.miles_reward_incontext) {
        context.miles_conversion_ratio = context.miles_reward_incontext / context.cash_reward_incontext;
    } else {
        context.miles_conversion_ratio = 0;
    }

    return (
        <>
            <IonList key={eligible_list ? "eligible_list" : "non_eligible_list"}>
                <IonListHeader key="Rewardheader">
                    <IonText><h2>{eligible_list ? "此簽帳適用優惠分項" : "不合資格的優惠分項"}</h2></IonText>
                </IonListHeader>

                {list_items.map((item) => (

                    <IonItem routerLink={'/rewardItem/' + item.reward_id} routerDirection='forward' key={"Reward" + item.reward_id}>
                        <IonLabel >
                            <h2>{rewardData.rewards.data[item.reward_id].reward_name}</h2>
                            <div style={{ wordWrap: "break-word", wordBreak: "break-all" }} className="ion-text-wrap">
                                {item.reason > -1 && <IonBadge color="medium" className='condition-badge'><IonText><IonIcon icon={warning}></IonIcon> {disqualification_reason[item.reason]}</IonText></IonBadge>}
                                {item.limits > 0 && <IonBadge color={context.bill_size > item.limits ? "warning" : "medium"} className='condition-badge'><IonText>帳單限額 {humanize(item.limits || 0)}</IonText></IonBadge>}
                                {item.qualification_spend<rewardData.rewards.data[item.reward_id].minimum_qualification_spend && <IonBadge color={"warning"} className='condition-badge'><IonText>未達成簽帳要求</IonText></IonBadge>}
                                
                                {rewardData.rewards.data[0].client_remarks.map((remark_id) => (
                                    <IonBadge color="medium" className='condition-badge'><IonText>{reward_remarks_text[remark_id]}</IonText></IonBadge>
                                ))
                                }
                            </div>
                            {item.qualification_spend<rewardData.rewards.data[item.reward_id].minimum_qualification_spend && <><br></br><h3>簽帳進度（最低簽帳要求)</h3>
                                <IonProgressBar value={item.qualification_spend/rewardData.rewards.data[item.reward_id].minimum_qualification_spend} color="warning"></IonProgressBar>
                                <div className="ion-text-right"><IonText color={"medium"}><sup>${rewardData.rewards.data[item.reward_id].minimum_qualification_spend }</sup></IonText></div>
                                </>}
                                {rewardData.rewards.data[item.reward_id].maximum_qualifacation_spend > 0 && item.qualification_spend>=rewardData.rewards.data[item.reward_id].minimum_qualification_spend && <>
                                <h3>簽帳進度（回贈簽帳限額）</h3>
                                <IonProgressBar value={item.qualification_spend/rewardData.rewards.data[item.reward_id].maximum_qualifacation_spend}></IonProgressBar>
                                <div className="ion-text-right"><IonText color={"medium"}><sup>${rewardData.rewards.data[item.reward_id].maximum_qualifacation_spend}</sup></IonText></div></>}

                                {rewardEligibleRatio(item.limits,context.bill_size)!=1 && <IonText color={"medium"} ><sup>* 因優惠受帳單限額限制只獲得部分回贈</sup></IonText>}

                        </IonLabel>
                        <IonLabel slot='end' className='ion-text-end'>
                            <IonBadge className='bold' color={eligible_list ? "success" : "medium"}>
                                <h3>
                                    <b>{
                                        (rewardData.rewards.data[item.reward_id].reward_type == 'cash') ? (
                                    context.best_return_choice == "miles" ? "$" + humanize(1 / (context.miles_conversion_ratio * rewardData.rewards.data[item.reward_id].reward_ratio * rewardEligibleRatio(item.limits,context.bill_size))) + "/" + (cardData.mileages[context.miles_currency_in_context].unit) : humanize(rewardData.rewards.data[item.reward_id].reward_ratio  * rewardEligibleRatio(item.limits,context.bill_size) * 100) + "%"
                                ) : (
                                    "$" + humanize(rewardData.rewards.data[item.reward_id].reward_ratio * rewardEligibleRatio(item.limits,context.bill_size)) + "/" + (cardData.mileages[context.miles_currency_in_context].unit)
                                )}
                                    </b>
                                </h3>
                            </IonBadge>
                            {rewardData.rewards.data[item.reward_id].reward_type == 'cash' && context.best_return_choice == "miles" && <>
                                <br></br>
                                <IonBadge color="medium">{humanize(rewardData.rewards.data[item.reward_id].reward_ratio * rewardEligibleRatio(item.limits,context.bill_size) * 100)}%</IonBadge>
                            </>}
                        </IonLabel>
                    </IonItem>


                ))}



            </IonList>
        </>
    );
};

function rewardEligibleRatio(limit,spend){
    if(limit>0){
        return limit/spend
    }else{
        return 1
    }
}
export default RewardBreakdownList;
