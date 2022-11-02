import React  from "react";
import userdata_template_json from '../app_data/user_data.json';
import { Userdata } from "../interface/UserdataInterface";

export const UserContext = React.createContext({
    userData:userdata_template_json,
    addCard:null,
    removeCard:null,
    setUserData:null
  });

const userDataReducer = (state:Userdata, action) => {
    // 判斷指令
    let temp=null
    switch (action.type) {
        case 'ADD_CARD':{
            let new_cardlist=state.card_owned;
            new_cardlist.push(action.payload);
            new_cardlist=[...new Set(new_cardlist)]
            temp={
              ...state,
              card_owned:new_cardlist
            }
            break;
        }
        case 'REMOVE_CARD':{
            let new_cardlist=state.card_owned;
            let index = new_cardlist.indexOf(action.payload)
            if(index>-1){
                new_cardlist.splice(index,1)
            }
            console.log('Splice target'+ action.payload)
            console.log('Splice target index'+ index)
            temp= {
              ...state,
              card_owned:new_cardlist
            }
            break;
        }
        case "NEW_USERDATA":{
            temp= action.payload;
            break;
        }
        default:{
            temp=state
        }
    }
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
    console.log(state as Userdata)
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
      }
    };
    return (
      <UserContext.Provider value={value}>
        {children}
      </UserContext.Provider>
    );
};

export default UserDataReducerProvider