import React  from "react";
import userdata_template_json from '../app_data/user_data.json';
import { Userdata } from "../interface/UserdataInterface";

export const UserContext = React.createContext({
    userData:userdata_template_json,
    addCard:null,
    removeCard:null,
    setUserData:null,
    setUserCardOptions:null,
    setUserOptions:null
  });

const userDataReducer = (state:Userdata, action) => {
    // 判斷指令
    let temp=null
    switch (action.type) {
        case 'ADD_CARD':{
            let new_cardlist=(state.card_owned);
            new_cardlist[action.payload]={
              "expiry":0,
              "user_has_premium_banking":false,
              "user_has_private_banking":false,
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
            break;
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

    //Detect Userdata, setup user if first time
    if(!localStorage.getItem("userdata")){
        //User data not set, user is here for the first time
        localStorage.setItem("userdata",JSON.stringify(userdata_template_json))
        console.log("Initialize local storage")
    }
    
    const temp =  JSON.parse(localStorage.getItem("userdata")) as Userdata;
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
      }
    };
    return (
      <UserContext.Provider value={value}>
        {children}
      </UserContext.Provider>
    );
};

export default UserDataReducerProvider