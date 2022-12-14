import { useContext } from "react";
import { CardContext, MerchantListContext, RewardsContext } from "../App";
import { UserContext } from "../reducer/UserDataReducer";
import { INELIGIBLE_REASON } from "./IneligibleReason";
interface PaymentHistory {
    time: number,
    card_id: number,
    mcc_query: boolean,
    query_id: string,
    spend_amount: number,
    spend_currency: string,
    user_payment_method: string
}
export const EligibilityCalc = (reward_id: string, card_id: number, mcc_query, query_id: string, spend_amount: number, spend_currency: string = "hkd", user_payment_method, time, calculate_limits = false) => {
    card_id = parseInt(String(card_id))
    const { cardData } = useContext(CardContext)
    const { merchantData } = useContext(MerchantListContext)
    const { rewardData } = useContext(RewardsContext);
    const { userData} = useContext(UserContext);

    let rewards = rewardData.rewards.data;
    let ineligble_rewards = [];
    var qualified = true;
    var target_merchant_id = "0";
    var target_mcc = query_id;

    let qualification_spend = 0;

    if (rewards[reward_id].target_cards.indexOf(card_id) == -1) {
        return false;
    }

    let offer_running = false
    for (var j = 0; j < rewards[reward_id].offer_time.length; j++) {

        if (rewards[reward_id].offer_time[j][0] < time && time < rewards[reward_id].offer_time[j][1]) {
            offer_running = true;
            break;
        }
    }
    if (offer_running == false) {
        return false;
    }


    if (!mcc_query) {
        // For merchant query, get the MCC data
        target_merchant_id = query_id
        target_mcc = merchantData.merchants.data[query_id].mcc;
    }

    if (!mcc_query && rewards[reward_id].qualify_merchant.indexOf(target_merchant_id) == -1 && rewards[reward_id].qualify_merchant.length > 0) {
        // For merchant query, if the merchant is not in list of qualifying merchants, and the list is not empty
        qualified = false;
        //console.log("Merchant not in list")
        return ({
            reward_id: reward_id,
            reason: INELIGIBLE_REASON.MERCHANT_NOT_IN_LIST,
            limits: -1,
            eligible: false,
            qualification_spend: 0
        })

    }
    if (rewards[reward_id].disqualified_merchants.indexOf(target_merchant_id) != -1 && rewards[reward_id].disqualified_merchants.length > 0) {
        // For merchant query, if the merchant is not in list of qualifying merchants, and the list is not empty
        qualified = false;
        //console.log("Merchant not in list")
        return ({
            reward_id: reward_id,
            reason: INELIGIBLE_REASON.DISQUALIFIED_MERCHANT,
            limits: -1,
            eligible: false,
            qualification_spend: 0
        })
    }

    if (mcc_query && ["tax", "bill"].indexOf(target_mcc) > -1 && rewards[reward_id].bill_payment == false) {
        //tax and bill unqualify reward
        ineligble_rewards.push({
            reward_id: reward_id,
            reason: INELIGIBLE_REASON.BILL_PAYMENT,
            limits: -1,
            eligible: false,
            qualification_spend: 0
        })
    }

    if (rewards[reward_id].qualify_mcc.indexOf(target_mcc) == -1 && rewards[reward_id].qualify_mcc.length > 0) {
        //if the transaction does not matches the merchant code
        //if the merchant code list is not empty
        qualified = false;
        //console.log("Merchant code not in list")
        return ({
            reward_id: reward_id,
            reason: INELIGIBLE_REASON.MCC_NOT_IN_LIST,
            limits: -1,
            eligible: false,
            qualification_spend: 0
        })
    }


    if (rewards[reward_id].payment_method.length > 0) {
        //if there are payment method requirement
        if (rewards[reward_id].payment_method.indexOf(user_payment_method) == -1) {
            //user payment method not match
            qualified = false
            //console.log("Payment method not in list")
            return ({
                reward_id: reward_id,
                reason: INELIGIBLE_REASON.PAYMENT_METHOD,
                limits: -1,
                eligible: false,
                qualification_spend: 0
            })
        }
    }

    if (spend_amount < rewards[reward_id].minimum_bill_size && rewards[reward_id].minimum_bill_size > 0) {
        //Not qulified due to bill too small
        qualified = false;
        //console.log("Bill size small")
        return ({
            reward_id: reward_id,
            reason: INELIGIBLE_REASON.BILL_SIZE_SMALL,
            limits: -1,
            eligible: false,
            qualification_spend: 0
        })
    }
    let bill_limit = -1;
    if (spend_amount > rewards[reward_id].maximum_bill_size && rewards[reward_id].maximum_bill_size > 0) {
        //Bill size over
        //qualified=false;
        //console.log("Bill size over")
        /*ineligble_rewards.push({
            reward_id:reward_id,
            reason:INELIGIBLE_REASON.BILL_SIZE_LARGE
        })*/
        bill_limit = rewards[reward_id].maximum_bill_size
        //continue;
    }
    if (rewards[reward_id].charge_currency_requirement.length > 0 && (rewards[reward_id].charge_currency_requirement.indexOf(spend_currency) == -1 || rewards[reward_id].charge_currency_requirement.indexOf("-" + spend_currency) > -1)) {
        //Currency Requirement
        // Either currency is not found (eg: jpy) or currency is excluded (-hkd -mop => exclude HKD and MOP)
        qualified = false;
        return ({
            reward_id: reward_id,
            reason: INELIGIBLE_REASON.BILL_CURRENCY,
            limits: -1,
            eligible: false,
            qualification_spend: 0
        })
    }
/*
    if( rewards[reward_id].require_premium && !userData.card_owned[card_id].user_has_premium_banking){
        qualified = false;
        return ({
            reward_id: reward_id,
            reason: INELIGIBLE_REASON.PREMIUM_BANKING_ONLY,
            limits: -1,
            eligible: false,
            qualification_spend: 0
        })
    }
    if( rewards[reward_id].require_private && !userData.card_owned[card_id].user_has_private_banking){
        qualified = false;
        return ({
            reward_id: reward_id,
            reason: INELIGIBLE_REASON.PRIVATE_BANKING_ONLY,
            limits: -1,
            eligible: false,
            qualification_spend: 0
        })
    }
    */
   
    if( rewards[reward_id].banking_level > (userData.card_owned[card_id]?.user_banking_level||0)){
        qualified = false;
        let reason=INELIGIBLE_REASON.BANKING_ONLY;
        if(rewards[reward_id].banking_level==2){
            reason=INELIGIBLE_REASON.PREMIUM_BANKING_ONLY
        }
        if(rewards[reward_id].banking_level==3){
            reason=INELIGIBLE_REASON.PRIVATE_BANKING_ONLY
        }
        return ({
            reward_id: reward_id,
            reason: reason,
            limits: -1,
            eligible: false,
            qualification_spend: 0
        })
    }
    if( rewards[reward_id].day_of_week.length ){
        if( rewards[reward_id].day_of_week.indexOf(new Date(time*1000).getDay())==-1 ){
            //week of day not found
            qualified = false;
            return ({
                reward_id: reward_id,
                reason: INELIGIBLE_REASON.DAY_OF_WEEK,
                limits: -1,
                eligible: false,
                qualification_spend: 0
            })
        }
    }
    if( rewards[reward_id].day_of_month.length ){
        if( rewards[reward_id].day_of_month.indexOf(new Date(time*1000).getDate())==-1 ){
            //week of day not found
            qualified = false;
            return ({
                reward_id: reward_id,
                reason: INELIGIBLE_REASON.DAY_OF_MONTH,
                limits: -1,
                eligible: false,
                qualification_spend: 0
            })
        }
    }
    if (rewards[reward_id].maximum_qualifacation_spend > 0 || rewards[reward_id].minimum_qualification_spend > 0) {
        //Qualification requirement applies, loop through
        let qualification_period=getQualificationPeriod(rewards[reward_id].reset_interval,rewards[reward_id].offer_time,userData.card_owned[card_id].billing_date)

        if (calculate_limits) {

            let eligible_spent = 0;

            let qualification_ref_reward_id=reward_id;
            if(rewards[reward_id].qualification_spend_ref){
                //Qulification requirement is referenced to another reward_id
                qualification_ref_reward_id=rewards[reward_id].qualification_spend_ref;
            }
            
            //TODO: Quota Translation - 600 * 2% on ref = 300 on 4% this

            //TODO: Shareed quota: reward_a + reward_b => reward_master quota

            //Loop user spending history
            for (var i = 0; i < userData.spending_history.length; i++) {
                let item: PaymentHistory = userData.spending_history[i]
                if(qualification_period[0]<item.time&&item.time<qualification_period[1]){
                    //Filter out tx that are out of time
                    let result = EligibilityCalc(qualification_ref_reward_id, item.card_id, item.mcc_query, item.query_id, item.spend_amount, item.spend_currency, item.user_payment_method, item.time, false)
                    if (result) {
                        if (result.eligible) {
                            if(result.limits>0){
                                eligible_spent += result.limits
                            }else{
                                eligible_spent += item.spend_amount
                            }
                        }
                    }
                }

            }


            //limit for maximum
            // warn for less than min eligible
            qualification_spend=spend_amount + eligible_spent

            if (spend_amount + eligible_spent > rewards[reward_id].maximum_qualifacation_spend) {
                //Can only earn partial
                bill_limit = Math.max(0,rewards[reward_id].maximum_qualifacation_spend - (eligible_spent)) 

                if(bill_limit==0){
                    qualified = false;
                    return ({
                        reward_id: reward_id,
                        reason: INELIGIBLE_REASON.USED_UP_QUOTA,
                        limits: 0,
                        eligible: false,
                        qualification_spend: qualification_spend
                    })                   
                }
            }

        }


    }

    if (userData.opt_out_offers.indexOf(String(reward_id)) > -1) {
        //Reward only available at certain day of month
        // today is not the day
        qualified = false;
        //console.log("Not day of month")
        return ({
            reward_id: reward_id,
            reason: INELIGIBLE_REASON.USER_OPT_OUT,
            limits: -1,
            eligible: false,
            qualification_spend: 0
        })
    }
    if (qualified) {
        return ({
            reward_id: reward_id,
            reason: -1,
            limits: bill_limit,
            eligible: true,
            qualification_spend: qualification_spend
        })
    } else {
        console.error("UNCAUGHT CASE FOR ELIGIBILITY");
        return false
    }

    function getQualificationPeriod(reset_interval,offer_time,user_billing_date){
        let interval_time=[0,999999999999999999]
        let active_offer_time=[0,0]
        
        if(reset_interval="day"){
            interval_time=[new Date().setUTCHours(0,0,0,0)/1000, new Date().setUTCHours(23,59,59,0)/1000, ]
        }
        if(reset_interval="week"){
            var curr = new Date; // get current date
            var first = curr.getDate() - curr.getDay() +1; // First day is the day of the month - the day of the week
            var last = first + 6; // last day is the first day + 6

            var firstday = new Date(curr.setDate(first)).getTime()/1000;
            var lastday = new Date(curr.setDate(last)).getTime()/1000;
            interval_time=[firstday, lastday]
        }
        if(reset_interval="month"){
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getTime()/1000;
            const lastDay = (new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime()-1000)/1000;
            interval_time=[firstday, lastday]
        }
        if(reset_interval="year"){
            const now = new Date();
            const firstDay = new Date(now.getFullYear(),1, 1).getTime()/1000;
            const lastDay = (new Date(now.getFullYear()+1, 1, 1).getTime()-1000)/1000;
            interval_time=[firstday, lastday]
        }
        if(reset_interval="billmonth"){
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), new Date(user_billing_date*1000).getDate()).getTime()/1000;
            const lastDay = (new Date(now.getFullYear(), now.getMonth() + 1,  new Date(user_billing_date*1000).getDate()).getTime()-1000)/1000;
            interval_time=[firstday, lastday]
        }
        if(reset_interval="billyear"){
            const now = new Date();
            const firstDay = new Date(now.getFullYear()   , new Date(user_billing_date*1000).getMonth(),  new Date(user_billing_date*1000).getDate()).getTime()/1000;
            const lastDay = (new Date(now.getFullYear()+1,  new Date(user_billing_date*1000).getMonth(),  new Date(user_billing_date*1000).getDate()).getTime()-1000)/1000;
            interval_time=[firstday, lastday]
        }

        for(var i=0;i<offer_time.length;i++){
            if(offer_time[i][0]<new Date().getTime()/1000 && new Date().getTime()/1000<offer_time[i][1] ){
                active_offer_time=offer_time[i]
            }
        }
        let result = [Math.max(interval_time[0],active_offer_time[0]),Math.min(interval_time[1],active_offer_time[1])]
        console.log(result)
        console.log(new Date(result[0]*1000))
        console.log(new Date(result[1]*1000))
        return result
    }
}