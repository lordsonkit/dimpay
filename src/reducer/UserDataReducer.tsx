import React, { useContext, useMemo, useState }  from "react";
import { CardContext, RewardsContext } from "../App";
import userdata_template_json from '../app_data/user_data.json';
import { Userdata } from "../interface/UserdataInterface";

export const UserContext = React.createContext({
    userData:userdata_template_json,
    addCard:null,
    removeCard:null,
    setUserData:null,
    setUserCardOptions:null,
    setUserOptions:null,
    toggleUserRewardExemption:null,
    addTransactionHistory:null,
    addCustomReward:null,
    removeCustomReward:null,
    setUserRewardMultiplier:null
  });

  
const userDataReducer = (state:Userdata, action) => {
  if(state && Object.keys(state).length === 0){
    return false
  }
  
    // 判斷指令
    let temp=null
    switch (action.type) {
        case 'ADD_CARD':{
            let new_cardlist=(state.card_owned);
            new_cardlist[action.payload]={
              "expiry":0,
              "user_banking_level":0,
              "billing_date":1,
              "card_reward_multiplier":100,
              "mileage_program_override":{

              }
            };
            temp={
              ...state,
              card_owned:new_cardlist
            }
            break;
        }
        case 'REMOVE_CARD':{
            let new_cardlist:Object=(state.card_owned)
            let index = new_cardlist.hasOwnProperty(action.payload)
            if(index){
                delete new_cardlist[action.payload]
            }
            temp= {
              ...state,
              card_owned:new_cardlist
            }
            break;
        }
        case "NEW_USERDATA":{
            let payload= action.payload;
            temp= {
              ...state,
              card_owned:payload
            }
            break;
        }
        case "SET_USER_CARD_OPTIONS":{
          temp= {
            ...state,
          }
          if(action.field.length==3){
            //layer3
            temp.card_owned[action.card_id][action.field[0]][action.field[1]][action.field[2]]=action.payload
          }
          if(action.field.length==2){
            temp.card_owned[action.card_id][action.field[0]][action.field[1]]=action.payload
          }
          if(action.field.length==1){
            temp.card_owned[action.card_id][action.field[0]]=action.payload
          
          }
            break;
        }
        case "SET_USER_OPTIONS":{
          temp= {
            ...state,
          }
          if(action.payload){
            //Prevent updating empty data
            if(action.field.length==3){
              //layer3
              temp[action.field[0]][action.field[1]][action.field[2]]=action.payload
            }
            if(action.field.length==2){
              temp[action.field[0]][action.field[1]]=action.payload
            }
            if(action.field.length==1){
              temp[action.field[0]]=action.payload
            
            }
          }
          
            break;
        }
        case "TOGGLE_REWARD_EXEMPTION":{
          temp= {
            ...state,
          }
          if(!action.add_drop){
            temp.opt_out_offers=temp.opt_out_offers.splice(temp.opt_out_offers.indexOf(action.payload),1)
          }else{
            if(temp.opt_out_offers.indexOf(action.payload)==-1){
              temp.opt_out_offers.push(action.payload)
            }
            
          }
          
            break;
        }
        case "ADD_TRANSACTION_HISTORY":{
          temp= {
            ...state,
          }
          temp.spending_history.push(action.payload);
          console.log('Add user transaction history')
          
            break;
        }
        case "ADD_CUSTOM_REWARD":{
          temp= {
            ...state,
          }
          temp.custom_rewards[action.payload.reward_id]=(action.payload);
          console.log('Add user custom reward ')
          
            break;
        }

        case "REMOVE_CUSTOM_REWARD":{
          temp= {
            ...state,
          }
          delete temp.custom_rewards[action.payload.reward_id]
          console.log('Remove user custom reward ')
          
            break;
        }
        case "SET_REWARD_MULTIPLIER":{
          temp= {
            ...state,
          }
          if(!(action.reward_id in temp.reward_settings)){
            temp.reward_settings[action.reward_id]=action.default_value;
          }
          temp.reward_settings[action.reward_id][action.reward_item]=parseFloat(action.value)||0
            
            break;
        }
        case "GET_REWARD_MULTIPLIER":{
          temp= {
            ...state,
          }
          if('reward_settings' in state){
            if(!(action.reward_id in state.reward_settings)){
              state.reward_settings[action.reward_id]=action.default_value;
            }
          }
          console.log(state)
          return temp.reward_settings[action.reward_id][action.reward_item]
        }
        case "GET_TRANSACTION_HISTORY":{
          return temp.spending_history
        }
        default:{
            temp=state
        }
    }
    console.log(temp)
    localStorage.setItem("userdata",JSON.stringify(temp))
    return temp;
  }


const UserDataReducerProvider = ({ children }) => {
    const {rewardData,setRewardData} = useContext(RewardsContext);
    const rewardDataMemo = useMemo( () => {
      return ({rewardData})
    }, [rewardData])
    //Detect Userdata, setup user if first time
    if(!localStorage.getItem("userdata")){
        //User data not set, user is here for the first time
        localStorage.setItem("userdata",JSON.stringify(userdata_template_json))
        console.log("Initialize local storage")
    }
    const temp =  JSON.parse(localStorage.getItem("userdata")) as Userdata;
    if(!('reward_settings' in temp)){
      temp.reward_settings={}
    }
    let new_rewards=rewardDataMemo.rewardData

    new_rewards.rewards.data={...new_rewards.rewards.data,...temp.custom_rewards}

    setRewardData(new_rewards)


    const [state, dispatch] = React.useReducer(userDataReducer, temp||userdata_template_json);
    const value = {
      userData:state,
      addCard: (card_id) => {
        dispatch({type: "ADD_CARD", payload: card_id})
      },
      removeCard: (card_id) => {
        dispatch({type: "REMOVE_CARD", payload: card_id})
      },
      setUserData: (newUserData) => {
        dispatch({type: "NEW_USERDATA", payload: newUserData})
      },
      setUserCardOptions: (card_id, field, payload) => {
        dispatch({type: "SET_USER_CARD_OPTIONS", payload: payload,card_id:card_id, field:field })
      },
      setUserOptions: ( field, payload) => {
        dispatch({type: "SET_USER_OPTIONS", field:field, payload: payload })
      },
      toggleUserRewardExemption: ( payload,add_drop) => {
        dispatch({type: "TOGGLE_REWARD_EXEMPTION",  payload: payload, add_drop:add_drop })
      },
      addTransactionHistory: ( payload) => {
        dispatch({type: "ADD_TRANSACTION_HISTORY",  payload: payload })
      },
      addCustomReward: ( payload) => {
        dispatch({type: "ADD_CUSTOM_REWARD",  payload: payload })
      },
      removeCustomReward: ( payload) => {
        dispatch({type: "REMOVE_CUSTOM_REWARD",  payload: payload })
      },
      getSpendingHistory:() => {
        dispatch({type:"GET_SPENDING_HISTORY"})
      },
      setUserRewardMultiplier:(reward_id,reward_item,value:string) => {
        dispatch({type:"SET_REWARD_MULTIPLIER", reward_id:reward_id, reward_item:reward_item,value:value, default_value:rewardData.rewards.data[reward_id].default_user_multiplier_value})
      }

    };
    return (
      <UserContext.Provider value={value}>
        {children}
      </UserContext.Provider>
    );
};

export default UserDataReducerProvider