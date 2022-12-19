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
export const EligibilityCalc = (reward_id: string, card_id: number, mcc_query, query_id: string, spend_amount: number, spend_currency: string = "hkd", user_payment_method, time, calculate_limits = false, top_level_query=true) => {
    card_id = parseInt(String(card_id))
    const { cardData } = useContext(CardContext)
    const { merchantData } = useContext(MerchantListContext)
    const { rewardData } = useContext(RewardsContext);
    const { userData } = useContext(UserContext);

    let rewards = rewardData.rewards.data;
    let ineligble_rewards = [];
    var qualified = true;
    var target_merchant_id = "0";
    var target_mcc = query_id;

    let aux_reward_id = reward_id
    let qualification_spend = 0;
    let reward_quota=rewards[reward_id].maximum_qualification_spend
    let reward_quota_used=0;
    
    if (top_level_query && rewards[reward_id].aux){
        //aux not considered on top level query
        return false;
    }
    if (rewards[reward_id].target_cards.indexOf(card_id) === -1) {
        return false;
    }

    let offer_running = false
    for (var j = 0; j < rewards[reward_id].offer_time.length; j++) {

        if ((rewards[reward_id].offer_time[j][0] < time) && (time < rewards[reward_id].offer_time[j][1])) {
            offer_running = true;
            break;
        }
    }
    if (offer_running === false) {
        //console.error(rewards[reward_id].offer_time,time)
        return false;
    }


    if (!mcc_query) {
        // For merchant query, get the MCC data
        target_merchant_id = query_id
        target_mcc = merchantData.merchants.data[query_id].mcc;
    }

    if ((!mcc_query && rewards[reward_id].qualify_merchant.indexOf(target_merchant_id) == -1 && rewards[reward_id].qualify_merchant.length > 0)
    || (mcc_query&& rewards[reward_id].qualify_merchant.length > 0 )) {
        // For merchant query, if the merchant is not in list of qualifying merchants, and the list is not empty
        qualified = false;
        //console.log("Merchant not in list")
        return ({
            reward_id: reward_id,
            reason: INELIGIBLE_REASON.MERCHANT_NOT_IN_LIST,
            limits: -1,
            eligible: false,
            aux_reward_id: aux_reward_id,
            user_defined_multiplier:1,
qualification_spend: 0,
            reward_quota: reward_quota, reward_quota_used: reward_quota_used
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
            aux_reward_id: aux_reward_id,
            user_defined_multiplier:1,
qualification_spend: 0,
            reward_quota: reward_quota, reward_quota_used: reward_quota_used
        })
    }

    if (mcc_query && ["tax", "bill"].indexOf(target_mcc) > -1 && rewards[reward_id].bill_payment == false) {
        //tax and bill unqualify reward
        ineligble_rewards.push({
            reward_id: reward_id,
            reason: INELIGIBLE_REASON.BILL_PAYMENT,
            limits: -1,
            eligible: false,
            aux_reward_id: aux_reward_id,
            user_defined_multiplier:1,
qualification_spend: 0,
            reward_quota: reward_quota, reward_quota_used: reward_quota_used
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
            aux_reward_id: aux_reward_id,
            user_defined_multiplier:1,
qualification_spend: 0,
            reward_quota: reward_quota, reward_quota_used: reward_quota_used
        })
    }

    if (rewards[reward_id].payment_method.length > 0) {
        let only_method_exclusion = true
        for (var k = 0; k < rewards[reward_id].payment_method.length; k++) {
            if (rewards[reward_id].payment_method[k].indexOf('-') === -1) {
                only_method_exclusion = false;
                break
            }
        }
        if (only_method_exclusion) {

            if (rewards[reward_id].payment_method.indexOf("-" + user_payment_method) > -1) {
                qualified = false
            }
        } else {
            if (rewards[reward_id].payment_method.indexOf(user_payment_method) === -1 ||
                rewards[reward_id].payment_method.indexOf("-" + user_payment_method) > -1) {
                qualified = false
            }
        }

        if (!qualified) {
            return ({
                reward_id: reward_id,
                reason: INELIGIBLE_REASON.PAYMENT_METHOD,
                limits: -1,
                eligible: false,
                aux_reward_id: aux_reward_id,
                user_defined_multiplier:1,
qualification_spend: 0,
            reward_quota: reward_quota, reward_quota_used: reward_quota_used
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
            aux_reward_id: aux_reward_id,
            user_defined_multiplier:1,
qualification_spend: 0,
            reward_quota: reward_quota, reward_quota_used: reward_quota_used
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
    if (rewards[reward_id].charge_currency_requirement.length > 0) {
        let only_currency_exclusion = true
        for (var k = 0; k < rewards[reward_id].charge_currency_requirement.length; k++) {
            if (rewards[reward_id].charge_currency_requirement[k].indexOf('-') === -1) {
                only_currency_exclusion = false;
                break
            }
        }
        if (only_currency_exclusion) {

            if (rewards[reward_id].charge_currency_requirement.indexOf("-" + spend_currency) > -1) {
                qualified = false
            }
        } else {
            if (rewards[reward_id].charge_currency_requirement.indexOf(spend_currency) === -1 ||
                rewards[reward_id].charge_currency_requirement.indexOf("-" + spend_currency) > -1) {
                qualified = false
            }
        }

        if (!qualified) {
            return ({
                reward_id: reward_id,
                reason: INELIGIBLE_REASON.BILL_CURRENCY,
                limits: -1,
                eligible: false,
                aux_reward_id: aux_reward_id,
                user_defined_multiplier:1,
qualification_spend: 0,
            reward_quota: reward_quota, reward_quota_used: reward_quota_used
            })
        }

    }
    /*
        if( rewards[reward_id].require_premium && !userData.card_owned[card_id].user_has_premium_banking){
            qualified = false;
            return ({
                reward_id: reward_id,
                reason: INELIGIBLE_REASON.PREMIUM_BANKING_ONLY,
                limits: -1,
                eligible: false,
aux_reward_id:aux_reward_id,
                user_defined_multiplier:1,
qualification_spend: 0,
            reward_quota: reward_quota, reward_quota_used: reward_quota_used
            })
        }
        if( rewards[reward_id].require_private && !userData.card_owned[card_id].user_has_private_banking){
            qualified = false;
            return ({
                reward_id: reward_id,
                reason: INELIGIBLE_REASON.PRIVATE_BANKING_ONLY,
                limits: -1,
                eligible: false,
aux_reward_id:aux_reward_id,
                user_defined_multiplier:1,
qualification_spend: 0,
            reward_quota: reward_quota, reward_quota_used: reward_quota_used
            })
        }
        */

    if (rewards[reward_id].banking_level > (userData.card_owned[card_id]?.user_banking_level || 0)) {
        qualified = false;
        let reason = INELIGIBLE_REASON.BANKING_ONLY;
        if (rewards[reward_id].banking_level == 2) {
            reason = INELIGIBLE_REASON.PREMIUM_BANKING_ONLY
        }
        if (rewards[reward_id].banking_level == 3) {
            reason = INELIGIBLE_REASON.PRIVATE_BANKING_ONLY
        }
        return ({
            reward_id: reward_id,
            reason: reason,
            limits: -1,
            eligible: false,
            aux_reward_id: aux_reward_id,
            user_defined_multiplier:1,
qualification_spend: 0,
            reward_quota: reward_quota, reward_quota_used: reward_quota_used
        })
    }
    if (rewards[reward_id].day_of_week.length) {
        if (rewards[reward_id].day_of_week.indexOf(new Date(time * 1000).getDay()) == -1) {
            //week of day not found
            qualified = false;
            return ({
                reward_id: reward_id,
                reason: INELIGIBLE_REASON.DAY_OF_WEEK,
                limits: -1,
                eligible: false,
                aux_reward_id: aux_reward_id,
                user_defined_multiplier:1,
qualification_spend: 0,
            reward_quota: reward_quota, reward_quota_used: reward_quota_used
            })
        }
    }
    if (rewards[reward_id].day_of_month.length) {
        if (rewards[reward_id].day_of_month.indexOf(new Date(time * 1000).getDate()) == -1) {
            //week of day not found
            qualified = false;
            return ({
                reward_id: reward_id,
                reason: INELIGIBLE_REASON.DAY_OF_MONTH,
                limits: -1,
                eligible: false,
                aux_reward_id: aux_reward_id,
                user_defined_multiplier:1,
qualification_spend: 0,
            reward_quota: reward_quota, reward_quota_used: reward_quota_used
            })
        }
    }
    let user_defined_multiplier=1;
    if (rewards[reward_id].eligibility_ref.length > 0) {
        //find eligibility from aux reward entry
        // Qualifcation logic: this.qualification && (aux1.qualification || aux2.qualification || ...)
        // Quota logic: this.quota (mark untrackable if reward_ratio is variable)
        // Reward logic: this.reward_ratio 
        let ineligible_reason: INELIGIBLE_REASON;
        var eligibility_ref_qualify=false;
        for (var i = 0; i < rewards[reward_id].eligibility_ref.length; i++) {
            let result = EligibilityCalc(
                rewards[reward_id].eligibility_ref[i], card_id, mcc_query, query_id, spend_amount, spend_currency, user_payment_method, time, calculate_limits, false
            )            
            if (result) {
                if (result.eligible) {
                    //One of the refernece item is eligible
                    qualified = true;
                    eligibility_ref_qualify=true;
                    aux_reward_id = rewards[reward_id].eligibility_ref[i];
                    if(rewards[reward_id].default_user_multiplier_value.length>0&&rewards[reward_id].default_user_multiplier_value.length===rewards[reward_id].eligibility_ref.length){
                        //user defined multiplier
                        user_defined_multiplier=getUserRewardMultiplier(reward_id,i)
                    }
                    break;
                } else {
                    //return the last item as ineligible reason
                    ineligible_reason = result.reason
                }
            }

        }
        if (!eligibility_ref_qualify) {
            return ({
                reward_id: reward_id,
                reason: ineligible_reason,
                limits: -1,
                eligible: false,
                aux_reward_id: aux_reward_id,
                user_defined_multiplier:1,
qualification_spend: 0,
            reward_quota: reward_quota, reward_quota_used: reward_quota_used
            })
        }
    }
    if (rewards[reward_id].maximum_qualifacation_spend > 0 || rewards[reward_id].minimum_qualification_spend > 0) {
        //Qualification requirement applies, loop through
        let qualification_period = getQualificationPeriod(
            rewards[reward_id].reset_interval,
            rewards[reward_id].offer_time, 
            userData.card_owned?.[card_id]?.billing_date || 0
        )

        if (calculate_limits) {

            let eligible_spent = 0;
            let eligible_reward_acquired=0;

            //TODO: Quota Translation - 600 * 2% on ref = 300 on 4% this

            //TODO: Shareed quota: reward_a + reward_b => reward_master quota

            //Loop user spending history
            for (var i = 0; i < userData.spending_history.length; i++) {
                let item: PaymentHistory = userData.spending_history[i]
                
                if (qualification_period[0] < item.time && item.time < qualification_period[1]) {
                    //Filter out tx that are out of time
                    let result = EligibilityCalc(reward_id, item.card_id, item.mcc_query, item.query_id, item.spend_amount, item.spend_currency, item.user_payment_method, item.time, false, false)
                    console.error(result)
                    if (result) {
                        if (result.eligible) {
                                let tx_spend=item.spend_amount
                                eligible_spent += tx_spend
                                let reward_history_user_defined_multiplier=1;
                                    //multicategory reward
                                    /*
                                    if(rewards[reward_id].default_user_multiplier_value.length>0&&rewards[reward_id].default_user_multiplier_value.length===rewards[reward_id].eligibility_ref.length){
                                        //user defined multiplier
                                        reward_history_user_defined_multiplier=getUserRewardMultiplier(reward_id,rewards[reward_id].eligibility_ref.indexOf(result.aux_reward_id))
                                    }*/
                                    if(rewards[result.aux_reward_id].earn_miles===true){
                                        eligible_reward_acquired += tx_spend / rewards[result.aux_reward_id].reward_ratio * reward_history_user_defined_multiplier;
                                    }else{
                                        eligible_reward_acquired += tx_spend * rewards[result.aux_reward_id].reward_ratio * reward_history_user_defined_multiplier;
                                    }
                                
                    }
                }
                }
            }

            //limit for maximum
            // warn for less than min eligible
            // all spending including this transaction
            qualification_spend = spend_amount + eligible_spent

            let variable_aux_rate_reward=false;
            if(rewards[reward_id].eligibility_ref.length>0){
                for(var j=0;j<rewards[reward_id].eligibility_ref.length;j++){
                    if(rewards[reward_id].reward_ratio!=rewards[rewards[reward_id].eligibility_ref[j]].reward_ratio){
                        variable_aux_rate_reward=true
                        //console.error('variable rate reward')
                    }
                }
            }


            if(variable_aux_rate_reward){
                //TODO
                //aux case, breakup using reward acquired
                console.error(eligible_reward_acquired)
                let master_reward_quota=rewards[reward_id].maximum_qualifacation_spend*(rewards[reward_id].earn_miles?(1/rewards[reward_id].reward_ratio):(rewards[reward_id].reward_ratio))
                let quota_remaining = master_reward_quota - eligible_reward_acquired
                let current_transaction_reward = spend_amount *(rewards[aux_reward_id].earn_miles?(1/rewards[aux_reward_id].reward_ratio):(rewards[aux_reward_id].reward_ratio)) * user_defined_multiplier
                bill_limit=spend_amount * Math.max(0,quota_remaining/current_transaction_reward)
                //console.warn("Special Qualification")
                //console.warn(current_transaction_reward,quota_remaining,master_reward_quota)
                reward_quota=rewards[reward_id].maximum_qualifacation_spend*(rewards[reward_id].earn_miles?(rewards[aux_reward_id].reward_ratio/rewards[reward_id].reward_ratio):(rewards[reward_id].reward_ratio/rewards[aux_reward_id].reward_ratio))
                
                reward_quota_used=(reward_quota-bill_limit)
            }else{
                if (qualification_spend > rewards[reward_id].maximum_qualifacation_spend) {
                    //Can only earn partial
                    bill_limit = Math.max(0, rewards[reward_id].maximum_qualifacation_spend - (eligible_spent))
                }
                if(bill_limit>0){
                    reward_quota=Math.min(bill_limit,rewards[reward_id].maximum_bill_size)
                }
                reward_quota=rewards[reward_id].maximum_qualifacation_spend;
                reward_quota_used=qualification_spend
            }

            
            if (bill_limit === 0) {
                qualified = false;
                return ({
                    reward_id: reward_id,
                    reason: INELIGIBLE_REASON.USED_UP_QUOTA,
                    limits: 0,
                    eligible: false,
                    aux_reward_id: aux_reward_id,
                    user_defined_multiplier:user_defined_multiplier,
qualification_spend: qualification_spend,
                    reward_quota: reward_quota, reward_quota_used: reward_quota_used
                })
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
            aux_reward_id: aux_reward_id,
            user_defined_multiplier:1,
qualification_spend: 0,
            reward_quota: reward_quota, reward_quota_used: reward_quota_used
        })
    }
    if (qualified) {

        return ({
            reward_id: reward_id,
            reason: -1,
            limits: bill_limit,
            eligible: true,
            aux_reward_id: aux_reward_id,
            user_defined_multiplier:user_defined_multiplier,
qualification_spend: qualification_spend,
            reward_quota: reward_quota, reward_quota_used: reward_quota_used
        })
    } else {
        console.error("UNCAUGHT CASE FOR ELIGIBILITY");
        return false
    }

    function getQualificationPeriod(reset_interval, offer_time, user_billing_date) {
        let interval_time = [0, 999999999999999999]
        let active_offer_time = [0, 0]

        if (reset_interval == "day") {
            interval_time = [new Date().setUTCHours(0, 0, 0, 0) / 1000, new Date().setUTCHours(23, 59, 59, 0) / 1000,]
        }
        if (reset_interval == "week") {
            var curr = new Date; // get current date
            var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
            var last = first + 6; // last day is the first day + 6

            var firstday = new Date(curr.setDate(first)).getTime() / 1000;
            var lastday = new Date(curr.setDate(last)).getTime() / 1000;
            interval_time = [firstday, lastday]
        }
        if (reset_interval == "month") {
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000;
            const lastDay = (new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime() - 1000) / 1000;
            interval_time = [firstday, lastday]
        }
        if (reset_interval == "year") {
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), 1, 1).getTime() / 1000;
            const lastDay = (new Date(now.getFullYear() + 1, 1, 1).getTime() - 1000) / 1000;
            interval_time = [firstday, lastday]
        }
        if (reset_interval == "billmonth") {
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), new Date(user_billing_date * 1000).getDate()).getTime() / 1000;
            const lastDay = (new Date(now.getFullYear(), now.getMonth() + 1, new Date(user_billing_date * 1000).getDate()).getTime() - 1000) / 1000;
            interval_time = [firstday, lastday]
        }
        if (reset_interval == "billyear") {
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), new Date(user_billing_date * 1000).getMonth(), new Date(user_billing_date * 1000).getDate()).getTime() / 1000;
            const lastDay = (new Date(now.getFullYear() + 1, new Date(user_billing_date * 1000).getMonth(), new Date(user_billing_date * 1000).getDate()).getTime() - 1000) / 1000;
            interval_time = [firstday, lastday]
        }

        for (var i = 0; i < offer_time.length; i++) {
            if (offer_time[i][0] < new Date().getTime() / 1000 && new Date().getTime() / 1000 < offer_time[i][1]) {
                active_offer_time = offer_time[i]
            }
        }
        let result = [Math.max(interval_time[0], active_offer_time[0]), Math.min(interval_time[1], active_offer_time[1])]
        return result
    }
    function getUserRewardMultiplier(reward_id,index){
        var temp=[]
          if(!(reward_id in userData.reward_settings)){
            temp=rewardData.rewards.data[reward_id].default_user_multiplier_value;
          }else{
            temp=userData.reward_settings[reward_id]
          }
          console.warn(reward_id,temp,index)
        return temp[index] || 1
      }
}