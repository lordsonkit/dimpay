import { IonRadio } from '@ionic/core/components';
import { IonAvatar, IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemGroup, IonItemOption, IonLabel, IonList, IonListHeader, IonModal, IonNote, IonPage, IonProgressBar, IonRadioGroup, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonText, IonTextarea, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { add, pin, pulse, removeCircleOutline, trashBinOutline } from 'ionicons/icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { CardContext, MerchantListContext } from '../App';
import ExploreContainer from '../components/ExploreContainer';
import UserDataReducerProvider, { UserContext } from '../reducer/UserDataReducer';
import './RewardResults.css';

const client_remark=[
    "須登記",
    "特選客戶",
    "個人化目標",
    "個人化額度",
    "基本回贈"
]
const banking_level=[
    "沒有銀行帳戶",
    "持有銀行帳戶",
    "優越銀行客戶",
    "私人銀行客戶"
]
const AddMerchant: React.FC = () => {
    const history = useHistory();
    const { userData, addCustomReward, addCustomMerchant} = useContext(UserContext);
    const { merchantData, setMerchantData } = useContext(MerchantListContext);
    const [cardType, setCardType] = useState('cash');
    const [mccQuery, setMccQuery] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalMode, setModalMode] = useState('merchant');
    const [mcclist, setMcclist] = useState<string[]>([])
    const [merchantlist, setMerchantlist] = useState<string[]>([])
    const [dqmerchantlist, setDqmerchantlist] = useState<string[]>([])
    const [searchResults, setSearchResults] = useState([])
    const [offer_time0, setOfferTime0] = useState(new Date().toISOString())
    const [offer_time1, setOfferTime1] = useState(new Date().toISOString())
    const {register, handleSubmit} = useForm()

    const { cardData, setCardData } = useContext(CardContext)

    const modal = useRef<HTMLIonModalElement>(null);
    const input = useRef<HTMLIonInputElement>(null);

    const [message, setMessage] = useState(
        'This modal example uses triggers to automatically open a modal when the button is clicked.'
    );

    function confirm() {
        modal.current?.dismiss(input.current?.value, 'confirm');
    }

    function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
        if (ev.detail.role === 'confirm') {
            setMessage(`Hello, ${ev.detail.data}!`);
        }
    }

    function addReward(data) {
        //offertime0 offertime1 modalmode cardtype, mccquery,mcclist, merchantlist, dqmerchantlist
        

        data={...data,
            "id":0,
            "payment_channel":[],
            "locations":[],
            "is_category": false,
            "importance":1,
            "mcc":mccQuery
        }
        
        addCustomMerchant(data)
        
        history.goBack()
        return false
    }


    useEffect(() => {
        // filter here
        let processedTerm = searchTerm.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@ ]/g, '');
        let tempSearchResult = []
        if (modalMode == 'mcc') {
            for (let key in merchantData.merchant_code) {
                if (
                    merchantData.merchant_code[key].name.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@] /g, '').includes(processedTerm) ||
                    merchantData.merchant_code[key].description.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@] /g, '').includes(processedTerm)
                ) {
                    tempSearchResult.push({
                        ...merchantData.merchant_code[key],
                        mcc: key
                    })
                }
            }
            
        } else {

            for (let key in merchantData.merchants.data) {
                if (
                    merchantData.merchants.data[key].name.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@] /g, '').includes(processedTerm) ||
                    merchantData.merchants.data[key].search_keywords.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@] /g, '').includes(processedTerm) ||
                    merchantData.merchants.data[key].description.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@] /g, '').includes(processedTerm)
                ) {
                    tempSearchResult.push({
                        ...merchantData.merchants.data[key],
                        mcc: key
                    })
                }
            }
        }
        console.log(tempSearchResult)
        setSearchResults([...tempSearchResult.slice(0, 30)]);
    }, [searchTerm, merchantData, modalMode]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>添加自訂義優惠</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

                <form onSubmit={handleSubmit((data)=> addReward(data))}>
                    <IonList>
                        <IonItem>
                            <IonLabel>
                                <h3>優惠名稱</h3>
                            </IonLabel>
                            <IonInput required={true} className='ion-text-end' type='text' slot='end'{...register("name")}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <h3>description</h3>
                            </IonLabel>
                            <IonInput required={true} className='ion-text-end' type='text' slot='end'{...register("reward_name")}></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>search keyword</h3>
                            </IonLabel>
                            <IonInput required={true} className='ion-text-end' type='text' slot='end'{...register("search_keyword")}></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>image link</h3>
                            </IonLabel>
                            <IonInput required={true} className='ion-text-end' type='text' slot='end'{...register("image")}></IonInput>
                        </IonItem>


                            <IonItem>
                                <IonLabel>
                                    <h3>商戶類別</h3>
                                </IonLabel>
                                <IonInput className='ion-text-end' {...register("mcc")} type='text' hidden={true}></IonInput>
                                <IonButton id="open-modal" slot="end" onClick={e => setModalMode("mcc")}>選擇商戶類別</IonButton>
                            </IonItem>
                            <IonItem className='ion-text-wrap'>
                                <div>
                                {mcclist.map((item)=>(
                                    <IonBadge class="badge-margin">{merchantData.merchant_code[item].name}</IonBadge> 
                                ))}
                                </div>
                            </IonItem>
                       

                    </IonList>
                    <IonButton expand='block' type='submit'>確認添加</IonButton>
                </form>
                <IonModal ref={modal} trigger="open-modal" onWillDismiss={(ev) => onWillDismiss(ev)}>
                    <IonHeader>
                        <IonToolbar className='ion-text-center'>
                            <IonTitle>{modalMode == "mcc" ? "選擇商戶類別" : "選擇商戶"}</IonTitle>
                            <IonButtons slot="end">
                                <IonButton strong={true} onClick={() => confirm()}>
                                    完成
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonSearchbar
                            animated={true}
                            value={searchTerm}
                            onIonChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="搜尋"
                        ></IonSearchbar>
                        <IonList>
                            <IonListHeader>
                                <IonLabel>搜尋結果</IonLabel>
                            </IonListHeader>
                            {searchResults.map((item) => (

                                <IonItem key={item.id}>
                                    <IonAvatar slot="start">
                                        <img src={item.image} alt="logo" />
                                    </IonAvatar>
                                    <IonLabel>
                                        <h3>{item.name}</h3>
                                        <p color="muted">{item.description}</p>
                                    </IonLabel>
                                    <IonLabel slot="end">
                                        {itemInList(item.id)?
                                            <IonButton color={"danger"} onClick={e => removeItem(item.id)}><IonIcon icon={trashBinOutline}></IonIcon> </IonButton>:
                                            <IonButton color={"success"} onClick={e => addItem(item.id)}>+</IonButton>
                                        }
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );

    function sumbitNewReward(event) {
        console.warn(event)
        //if card type mixed, reject

    }
    function addItem(id){
        if(modalMode=="mcc"){
            mcclist.push(id);
            setMcclist([...mcclist])
        }
        if(modalMode=="merchant"){
            merchantlist.push(id);
            setMerchantlist([...merchantlist])
        }
        if(modalMode=="dqmerchant"){
            dqmerchantlist.push(id);
            setDqmerchantlist([...dqmerchantlist])
        }
    }
    function removeItem(id){
        if(modalMode=="mcc"){
            let temp=mcclist
            temp.splice(mcclist.indexOf(id),1)
            setMcclist([...temp])
        }
        if(modalMode=="merchant"){
            let temp=merchantlist
            temp.splice(merchantlist.indexOf(id),1)
            setMerchantlist([...temp])
        }
        if(modalMode=="dqmerchant"){
            let temp=dqmerchantlist
            temp.splice(dqmerchantlist.indexOf(id),1)
            setDqmerchantlist([...temp])
        }
    }
    function itemInList(id){
        let currentList=[]
        if(modalMode=="mcc"){
            currentList=mcclist
        }
        if(modalMode=="merchant"){
            currentList=merchantlist; 
        }
        if(modalMode=="dqmerchant"){
            currentList=dqmerchantlist; 
        }
        return currentList.indexOf(id)>-1
    }
};

export default AddMerchant;
