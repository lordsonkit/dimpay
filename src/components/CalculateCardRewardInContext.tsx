import { useContext } from "react";
import { CardContext, MerchantListContext, RewardsContext } from "../App";
import { UserContext } from "../reducer/UserDataReducer";
import { EligibilityCalc } from "./EligibilityCalc";
import { INELIGIBLE_REASON } from "./IneligibleReason";



export const CalculateCardRewardInContext = (card_id:number,mcc_query,query_id:string,spend_amount:number,spend_currency:string="hkd",user_payment_method) => {
    //Hack to a bug that idk why string would sneak through
    card_id=parseInt(String(card_id))
    const {cardData}=useContext(CardContext)
    const {rewardData}=useContext(RewardsContext);
    const {userData,removeCard,addCard}=useContext(UserContext);
    let card=cardData.cards[card_id];
    let rewards=rewardData.rewards.data;
    let eligible_rewards=[];
    let ineligble_rewards=[];
    let payment_method=[]
    if(!spend_amount){
        spend_amount=100
    }

    for(var i in rewards){
        let eligibility_result=EligibilityCalc(i,card_id,mcc_query,query_id,spend_amount,spend_currency,user_payment_method,new Date().getTime()/1000,true)
        if(eligibility_result){
            if(eligibility_result.eligible){
                eligible_rewards.push(eligibility_result)
            }else{
                ineligble_rewards.push(eligibility_result)
            }
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
            applicable_reward_amount=eligible_rewards[i].limits>0?Math.min(applicable_reward_amount,eligible_rewards[i].limits):applicable_reward_amount;
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
            //clamp by max bill size
            applicable_reward_amount=(rewards[eligible_rewards[i].reward_id].maximum_bill_size>0?Math.min(rewards[eligible_rewards[i].reward_id].maximum_bill_size,spend_amount):spend_amount)
            applicable_reward_amount=eligible_rewards[i].limits>0?Math.min(applicable_reward_amount,eligible_rewards[i].limits):applicable_reward_amount;
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
            if((userData.miles_value[miles_currency_incontext]||0)*miles_reward_incontext*0.9999999 > cash_reward_incontext || cardData.cards.data[card_id].earn_miles==true){ // *.9999 to prioritize cash over miles
                best_return_choice="miles"
                best_return_ratio=(userData.miles_value[miles_currency_incontext]||0.1)*miles_reward_incontext/spend_amount*100
            }else{
                best_return_ratio=cash_reward_incontext/spend_amount*100
            }
            
        }else{
            best_return_ratio=cash_reward_incontext/spend_amount*100;
            best_return_choice="cash"
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
        "best_return_ratio_miles":(spend_amount/miles_reward_incontext)||0,
        "best_return_choice":best_return_choice,
        "cash_reward_incontext":cash_reward_incontext,
        "miles_reward_incontext":miles_reward_incontext||0,
        "reward_breakdown":eligible_rewards,
        "payment_method_limit":payment_method,
        "miles_currency_in_context":miles_currency_incontext||"asiamiles",
        "ineligible_rewards":ineligble_rewards,
        "best_item":false,
        "bill_size":spend_amount,
        "spend_currency":spend_currency,
        "spend_method":payment_method
    }
    return manipulation_results;
};

var findOne = function (haystack, arr) {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};

