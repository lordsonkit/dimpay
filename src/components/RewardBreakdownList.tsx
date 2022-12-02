import { IonItem, IonThumbnail, IonImg, IonLabel, IonBadge, IonText, IonList, IonListHeader, IonProgressBar } from "@ionic/react";
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
    limits: number
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
    "除外商戶"
]

const RewardBreakdownList: React.FC<ContainerProps> = ({ eligible_list, list_items, context }) => {
    const { cardData } = useContext(CardContext);
    const { rewardData } = useContext(RewardsContext);

    if (context.cash_reward_incontext && context.miles_reward_incontext) {
        context.miles_conversion_ratio = context.miles_reward_incontext / context.cash_reward_incontext;
    } else {
        context.miles_conversion_ratio = 0;
    }
    console.warn(list_items)
    return (
        <>
            <IonList key={eligible_list?"eligible_list":"non_eligible_list"}>
                <IonListHeader key="Rewardheader">
                    <IonText><h2>{eligible_list ? "此簽帳適用優惠分項" : "不合資格的優惠分項"}</h2></IonText>
                </IonListHeader>

                {list_items.map((item) => (
                    
                        <IonItem routerLink={'/rewardItem/' + item.reward_id} routerDirection='forward' key={"Reward" + item.reward_id}>
                            <IonLabel>
                                <h2>{rewardData.rewards.data[item.reward_id].reward_name}</h2>

                                {item.reason > -1 && <IonBadge color="medium" className='condition-badge'><IonText>{disqualification_reason[item.reason]}</IonText></IonBadge>}
                                {item.limits > 0 && <IonBadge color={context.bill_size > item.limits ? "warning" : "medium"} className='condition-badge'><IonText>帳單限額{humanize(item.limits||0)}</IonText></IonBadge>}
                                {rewardData.rewards.data[0].charge_currency_requirement.length>0 && <IonBadge color={ "warning" } className='condition-badge'><IonText>支付方法 {humanize(item.limits||0)}</IonText></IonBadge>}
                                {rewardData.rewards.data[0].payment_method.length>0 && <IonBadge color={"warning" } className='condition-badge'><IonText>貨幣 {humanize(item.limits||0)}</IonText></IonBadge>}
                                <IonBadge color="medium" className='condition-badge'><IonText>需登記</IonText></IonBadge>
                                {false && <><h3>簽帳進度（最低簽帳額）</h3>
                                    <IonProgressBar value={1}></IonProgressBar>
                                    <h3>簽帳進度（最多可賺取回贈）</h3>
                                    <IonProgressBar value={0.8}></IonProgressBar></>}

                            </IonLabel>
                            <IonLabel slot='end' className='ion-text-end'>
                                <IonBadge className='bold' color={eligible_list ? "success" : "medium"}><h3><b>{(rewardData.rewards.data[item.reward_id].reward_type == 'cash') ? (
                                    context.best_return_choice == "miles" ? "$" + humanize(1 / (context.miles_conversion_ratio * rewardData.rewards.data[item.reward_id].reward_ratio)) + "/" + (cardData.mileages[context.miles_currency_in_context].unit) : humanize(rewardData.rewards.data[item.reward_id].reward_ratio * 100) + "%"
                                ) : (
                                    "$" + humanize(rewardData.rewards.data[item.reward_id].reward_ratio) + "/" + (cardData.mileages[context.miles_currency_in_context].unit)
                                )}</b></h3></IonBadge>
                                {rewardData.rewards.data[item.reward_id].reward_type == 'cash' && context.best_return_choice == "miles" && <><br></br><IonBadge color="medium">{humanize(rewardData.rewards.data[item.reward_id].reward_ratio * 100)}%</IonBadge></>}
                            </IonLabel>
                        </IonItem>

                    
                ))}



            </IonList>

        </>
    );
};


export default RewardBreakdownList;
