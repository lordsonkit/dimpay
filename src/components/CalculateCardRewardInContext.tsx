import { useContext } from "react";
import { CardContext, MerchantListContext, RewardsContext } from "../App";
import { UserContext } from "../reducer/UserDataReducer";
import { INELIGIBLE_REASON } from "./IneligibleReason";



export const CalculateCardRewardInContext = (card_id:number,mcc_query,query_id:string,spend_amount:number,spend_currency:string=null) => {
    //Hack to a bug that idk why string would sneak through
    card_id=parseInt(String(card_id))
    const {cardData}=useContext(CardContext)
    const {merchantData}=useContext(MerchantListContext)
    const {rewardData}=useContext(RewardsContext);
    const {userData,removeCard,addCard}=useContext(UserContext);
    let card=cardData.cards[card_id];
    let rewards=rewardData.rewards.data;
    let eligible_rewards=[];
    let ineligble_rewards=[];
    let reward_breakdown=[];
    let payment_method=[]
    if(spend_amount<=0){
        spend_amount=100
    }

    for(var i=0; i< rewards.length; i++){
        var qualified = true;
        var target_merchant_id="0";
        var target_mcc=query_id;
        var caution_message=""
        
        if(rewards[i].target_cards.indexOf(card_id)==-1){
            continue;
        }

        if(!mcc_query){
            // For merchant query, get the MCC data
            target_merchant_id=query_id
            target_mcc=merchantData.merchants.data[query_id].mcc;
        }

        if(!mcc_query && rewards[i].qualify_merchant.indexOf(target_merchant_id)==-1 && rewards[i].qualify_merchant.length >0) {
            // For merchant query, if the merchant is not in list of qualifying merchants, and the list is not empty
            qualified=false;
            //console.log("Merchant not in list")
            ineligble_rewards.push({
                reward_id:i,
                reason:INELIGIBLE_REASON.MERCHANT_NOT_IN_LIST,
                limits:-1
            })
            continue;
        }
        if(rewards[i].disqualified_merchants.indexOf(target_merchant_id)!=-1 && rewards[i].disqualified_merchants.length >0) {
            // For merchant query, if the merchant is not in list of qualifying merchants, and the list is not empty
            qualified=false;
            //console.log("Merchant not in list")
            ineligble_rewards.push({
                reward_id:i,
                reason:INELIGIBLE_REASON.DISQUALIFIED_MERCHANT
            })
            continue;
        }

        if(mcc_query && ["tax","bill"].indexOf(target_mcc)>-1 && rewards[i].bill_payment==false ){
            //tax and bill unqualify reward
            ineligble_rewards.push({
                reward_id:i,
                reason:INELIGIBLE_REASON.BILL_PAYMENT
            })
            continue;
        }

        if(rewards[i].qualify_mcc.indexOf(target_mcc)==-1 && rewards[i].qualify_mcc.length>0){
            //if the transaction does not matches the merchant code
            //if the merchant code list is not empty
            qualified=false;
            //console.log("Merchant code not in list")
            ineligble_rewards.push({
                reward_id:i,
                reason:INELIGIBLE_REASON.MCC_NOT_IN_LIST
            })
            continue;
        }
        
        let offer_running=false
        for(var j=0;j<rewards[i].offer_time.length; j++){
            let now=new Date().getTime()/1000;
            if(rewards[i].offer_time[j][0]<now && now<rewards[i].offer_time[j][1]){
                offer_running=true;
                break;
            }
        }
        if(offer_running==false){
            continue;
        }
        

        if(rewards[i].payment_method.length>0&&!mcc_query){
            //if there are payment method requirement
            //if this is a merchat specific query
            if(!findOne(rewards[i].payment_method,merchantData.merchants.data[target_merchant_id].payment_channel )){
                //matching both array, there are no payment method crossover
                qualified=false
                //console.log("Payment method not in list")
                ineligble_rewards.push({
                    reward_id:i,
                    reason:INELIGIBLE_REASON.PAYMENT_METHOD
                })
                continue;
            }
        }

        if(spend_amount<rewards[i].minimum_bill_size && rewards[i].minimum_bill_size>0 ){
            //Not qulified due to bill too small
            qualified=false;
            //console.log("Bill size small")
            ineligble_rewards.push({
                reward_id:i,
                reason:INELIGIBLE_REASON.BILL_SIZE_SMALL
            })
            continue;
        }
        let bill_limit=-1;
        if(spend_amount>rewards[i].maximum_bill_size && rewards[i].maximum_bill_size>0){
            //Bill size over
            //qualified=false;
            //console.log("Bill size over")
            /*ineligble_rewards.push({
                reward_id:i,
                reason:INELIGIBLE_REASON.BILL_SIZE_LARGE
            })*/
            bill_limit=rewards[i].maximum_bill_size
            //continue;
        }
        if(rewards[i].charge_currency_requirement.length>0 && rewards[i].charge_currency_requirement.indexOf(spend_currency)>-1){
            //Currency Requirement
            qualified=false;
            ineligble_rewards.push({
                reward_id:i,
                reason:INELIGIBLE_REASON.BILL_CURRENCY
            })
            continue;
        }
        if(spend_amount>rewards[i].maximum_qualifacation_spend && rewards[i].maximum_qualifacation_spend>0){
            //Can only earn partial
            caution_message="Spending amount: "+spend_amount+" is larger than the maximum for this award "+rewards[i].maximum_qualifacation_spend
            bill_limit=rewards[i].maximum_qualifacation_spend

        }
        if(rewards[i].day_of_week.length>0 && rewards[i].day_of_week.indexOf(new Date().getDay()) > -1){
            //Reward only available at certain weekday
            //today is not the day
            qualified=false;
            //console.log("Not day of week")
            ineligble_rewards.push({
                reward_id:i,
                reason:INELIGIBLE_REASON.DAY_OF_WEEK
            })
            continue;
        }
        if(rewards[i].day_of_month.length>0 && rewards[i].day_of_month.indexOf(new Date().getDate()) > -1){
            //Reward only available at certain day of month
            // today is not the day
            qualified=false;
            //console.log("Not day of month")
            ineligble_rewards.push({
                reward_id:i,
                reason:INELIGIBLE_REASON.DAY_OF_MONTH
            })
            continue;
        }
        if(userData.opt_out_offers.indexOf(String(i))>-1){
            //Reward only available at certain day of month
            // today is not the day
            qualified=false;
            //console.log("Not day of month")
            ineligble_rewards.push({
                reward_id:i,
                reason:INELIGIBLE_REASON.USER_OPT_OUT
            })
            continue;
        }
        if(qualified){
            eligible_rewards.push({
                reward_id:i,
                reason:-1,
                limits:bill_limit
            })
        }
    }

    
    //Calculate total reward with eligible reward list
    let cash_reward_incontext=0,
    miles_reward_incontext=0,
    miles_currency_incontext="",
    best_return_choice="cash",
    best_return_ratio=0;
    // if card only earn miles, then cards[].earn_miles == true
    if(cardData.cards.data[card_id].earn_miles==true){
        best_return_choice="miles";
        //miles only card, derive miles earned
        for(let i=0;i<eligible_rewards.length;i++){
            let applicable_reward_amount=spend_amount;
            applicable_reward_amount=(rewards[eligible_rewards[i].reward_id].maximum_bill_size>0?Math.min(rewards[eligible_rewards[i].reward_id].maximum_bill_size,spend_amount):spend_amount)
            miles_reward_incontext+=applicable_reward_amount/rewards[eligible_rewards[i].reward_id].reward_ratio
        }
        //Convert miles to cash value
        let miles_value=0;
        try{
            miles_value=userData.miles_value[cardData.cards.data[card_id]?.miles_card_currency]
            miles_currency_incontext = cardData.cards.data[card_id].miles_card_currency
        }catch(e){
            console.error(e)
        }
        cash_reward_incontext= miles_reward_incontext * miles_value;
        best_return_ratio=cash_reward_incontext/spend_amount*100;
    }else{
        //point or cash based card, derive cash value
        for(let i=0;i<eligible_rewards.length;i++){
            let applicable_reward_amount=spend_amount;
            applicable_reward_amount=(rewards[eligible_rewards[i].reward_id].maximum_bill_size>0?Math.min(rewards[eligible_rewards[i].reward_id].maximum_bill_size,spend_amount):spend_amount)
            cash_reward_incontext+=applicable_reward_amount*rewards[eligible_rewards[i].reward_id].reward_ratio
        }
        
        //check card milage program 
        if(cardData.cards.data[card_id].has_mileage_programme){
            let milage=cardData.cards.data[card_id].mileage_programme
            if(Object.keys(userData.card_owned[card_id]?.mileage_program_override||{}).length){
                //override values for milage program
                for(var k in userData.card_owned[card_id]?.mileage_program_override){
                    milage[k]=userData.card_owned[card_id]?.mileage_program_override[k]
                }
            }
            //Select best milage program
            //eg: max(card.milelage * userdata.milesavlue)
            let best_miles_per_dollar_value=0;
            for(var k in milage){
                let milage_value=userData.miles_value?.[k] || 0.1;
                if( milage[k] * milage_value >best_miles_per_dollar_value ){
                    best_miles_per_dollar_value= milage[k] * milage_value;
                    miles_currency_incontext=k;
                }
            }

            miles_reward_incontext=cash_reward_incontext * milage[miles_currency_incontext];
            if((userData.miles_value[miles_currency_incontext]||0.1)*miles_reward_incontext*0.9999 > cash_reward_incontext || cardData.cards.data[card_id].earn_miles==true){ // *.9999 to prioritize cash over miles
                best_return_choice="miles"
                best_return_ratio=(userData.miles_value[miles_currency_incontext]||0.1)*miles_reward_incontext/spend_amount*100
            }else{
                best_return_ratio=cash_reward_incontext/spend_amount*100
            }
            
        }
        
    }

    //Apply blanket bonus according to user preference
    if(parseInt(userData.card_owned[card_id]?.card_reward_multiplier||100)!=100){
        let user_defined_multiplier=parseInt(userData.card_owned[card_id].card_reward_multiplier)/100;
        best_return_ratio*=user_defined_multiplier;
        cash_reward_incontext*=user_defined_multiplier;
        miles_reward_incontext=user_defined_multiplier;
    }


    let manipulation_results={
        "best_return_ratio":best_return_ratio,
        "best_return_ratio_miles":spend_amount/miles_reward_incontext,
        "best_return_choice":best_return_choice,
        "cash_reward_incontext":cash_reward_incontext,
        "miles_reward_incontext":miles_reward_incontext,
        "reward_breakdown":eligible_rewards,
        "payment_method_limit":payment_method,
        "miles_currency_in_context":miles_currency_incontext,
        "ineligible_rewards":ineligble_rewards,
        "best_item":false,
        "bill_size":spend_amount,
        "spend_currency":spend_currency,
        "spend_method":"swipe"
    }
    return manipulation_results;
};

var findOne = function (haystack, arr) {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};

