import { IonRadio } from '@ionic/core/components';
import { IonAvatar, IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemGroup, IonItemOption, IonLabel, IonList, IonListHeader, IonModal, IonNote, IonPage, IonProgressBar, IonRadioGroup, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonText, IonTextarea, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { add, pin, pulse, removeCircleOutline, trashBinOutline } from 'ionicons/icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { CardContext, MerchantListContext } from '../App';
import ExploreContainer from '../components/ExploreContainer';
import UserDataReducerProvider, { UserContext } from '../reducer/UserDataReducer';
import './RewardResults.css';

const client_remark=[
    "須登記",
    "特選客戶",
    "個人化目標",
    "個人化額度"
]
const banking_level=[
    "沒有銀行帳戶",
    "持有銀行帳戶",
    "優越銀行客戶",
    "私人銀行客戶"
]
const AddCustomReward: React.FC = () => {
    const { userData, addCustomReward} = useContext(UserContext);
    const { merchantData } = useContext(MerchantListContext);
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
        data.reward_banners=[data.reward_banners];
        data.reward_id= "custom_"+ String( (Math.random() + 1).toString(36).substring(3) );
        data.target_cards = data.target_cards?data.target_cards.map(Number):[];
        data.reward_ratio = parseFloat(data.reward_ratio)||0;
        data.bill_discount = parseFloat(data.bill_discount)||0;
        data.card_age_bonus=[];
        data.day_of_week = data.day_of_week?data.day_of_week.map(Number):[];
        data.day_of_month = data.day_of_month?data.day_of_month.map(Number):[];
        data.bill_payment = false;
        data.qualify_mcc= mcclist;
        data.qualify_merchant= merchantlist;
        data.disqualified_merchants= dqmerchantlist;
        data.offer_time= [new Date(offer_time0).getTime()/1000,new Date(offer_time1).getTime()/1000];
        data.minimum_bill_size=parseFloat(data.minimum_bill_size)||0
        data.maximum_bill_size=parseFloat(data.maximum_bill_size)||0
        data.minimum_qualification_spend=parseFloat(data.minimum_qualification_spend)||0
        data.maximum_qualification_spend=parseFloat(data.maximum_qualification_spend)||0
        data.client_remark=data.client_remark?data.client_remark.map(Number):[];
        /*
        data.require_banking=data.require_banking=="on"
        data.require_premium=data.require_premium=="on"
        data.require_private=data.require_private=="on";*/

        data.reset_interval = data.reset_interval?data.reset_interval:"";
        data.banking_level = data.banking_level?parseInt(data.banking_level):0;
        data.payment_method = data.payment_method?data.payment_method.map(String):[];
        data={...data,
            "qualification_spend_ref":"",
            "quota_share":"",
            "translate_quota_value":false,
            "aux":false
        }
        
        if(!data.reward_ratio){
            alert("回贈比例");
            return false
        }
        if(!data.target_cards.length){
            alert("選擇信用卡");
            return false
        }
        addCustomReward(data)

        
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
            tempSearchResult.slice(0, 30);
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
        setSearchResults([...tempSearchResult]);
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
                            <IonInput required={true} className='ion-text-end' type='text' slot='end'{...register("reward_name")}></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>優惠描述</h3>
                            </IonLabel>
                            <IonTextarea className='ion-text-end' slot='end' {...register("reward_description")}></IonTextarea>
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>優惠圖片URL</h3>
                            </IonLabel>
                            <IonInput className='ion-text-end' type='text' slot='end' {...register("reward_banners")}></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>登記鏈接</h3>
                            </IonLabel>
                            <IonInput className='ion-text-end' type='text' slot='end' {...register("reg_link")}></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>優惠類別</h3>
                            </IonLabel>
                            <IonSelect slot={"end"} value={cardType} onIonChange={e=>setCardType(e.detail.value)} {...register("reward_type")}>
                                <IonSelectOption value="cash">現金 / 積分</IonSelectOption>
                                <IonSelectOption value="miles">里數</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>適用的信用卡</h3>
                            </IonLabel>
                            <IonSelect multiple={true} slot={"end"} required={true} {...register("target_cards")}>
                                {Object.keys(userData.card_owned).map((item) => (
                                    (cardData.cards.data[item].earn_cash?"cash":"miles")==cardType && <IonSelectOption slot='end' value={item}>{cardData.issuers[cardData.cards.data[item].issuer].name + " " + cardData.cards.data[item].card_name}</IonSelectOption>
                                ))}

                            </IonSelect>
                        </IonItem>



                        <IonItem>
                            <IonLabel>
                                <h3>回贈比例 ({cardType=='cash' ? "%" : "每$/里"})</h3>
                            </IonLabel>
                            <IonInput {...register("reward_ratio")} required={true} className='ion-text-end' type='number' slot='end' {...register("reward_ratio")}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <h3>帳單優惠 (%)</h3>
                            </IonLabel>
                            <IonInput defaultValue={0} className='ion-text-end' type='number' slot='end' {...register("bill_discount")}></IonInput>
                        </IonItem>
                    </IonList>

                    <IonList><IonListHeader className='ion-margin-left'><h1 className=''>回贈規則</h1></IonListHeader>

                        <IonItem>
                            <IonLabel>
                                <h3>優惠開始時間</h3>
                            </IonLabel>
                            <IonDatetimeButton className='ion-text-end'  slot='end' datetime='fromtime' ></IonDatetimeButton>
                            <IonModal keepContentsMounted={true}>
                                <IonDatetime id="fromtime" value={offer_time0} onIonChange={e=>setOfferTime0(String(e.detail.value))}></IonDatetime>
                            </IonModal>
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>優惠結束時間</h3>
                            </IonLabel>
                            <IonDatetimeButton className='ion-text-end' slot='end' datetime='totime' ></IonDatetimeButton>
                            <IonModal keepContentsMounted={true}>
                                <IonDatetime id="totime" value={offer_time1} onIonChange={e=>setOfferTime1(String(e.detail.value))}></IonDatetime>
                            </IonModal>
                        </IonItem>


                        <IonItem>
                            <IonLabel>
                                <h3>支付貨幣</h3>
                            </IonLabel>

                            <IonSelect multiple={true} slot={"end"}{...register("charge_currency_requirement")}>
                                {Object.keys(cardData.currencies).map((item) => (
                                    <IonSelectOption slot='end' value={item}>{cardData.currencies[item].name}</IonSelectOption>

                                ))}
                                {Object.keys(cardData.currencies).map((item) => (
                                    <IonSelectOption slot='end' value={"-" + item}>{cardData.currencies[item].name} 除外</IonSelectOption>

                                ))}


                            </IonSelect>

                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>支付方式</h3>
                            </IonLabel>

                            <IonSelect multiple={true} slot={"end"} {...register("payment_method")}>
                                {Object.keys(cardData.payment_method).map((item) => (
                                    <IonSelectOption value={item}>{cardData.payment_method[item]}</IonSelectOption>
                                ))}
                            </IonSelect>

                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>星期</h3>
                            </IonLabel>
                            <IonSelect multiple={true} slot={"end"} {...register("day_of_week")}>
                                <IonSelectOption value={0}>星期一</IonSelectOption>
                                <IonSelectOption value={1}>星期二</IonSelectOption>
                                <IonSelectOption value={2}>星期三</IonSelectOption>
                                <IonSelectOption value={3}>星期四</IonSelectOption>
                                <IonSelectOption value={4}>星期五</IonSelectOption>
                                <IonSelectOption value={5}>星期六</IonSelectOption>
                                <IonSelectOption value={6}>星期日</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>每月第幾日</h3>
                            </IonLabel>

                            <IonSelect multiple={true} slot={"end"} {...register("day_of_month")}>
                                {[...Array(31).keys()].map((item) => (
                                    <IonSelectOption value={item + 1}>{item + 1}</IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>帳單分類</h3>
                            </IonLabel>

                            <IonSelect slot={"end"} {...register("mcc_query")} value={mccQuery} onIonChange={event => setMccQuery(event?.detail.value)}>
                                <IonSelectOption value={false}>商戶</IonSelectOption>
                                <IonSelectOption value={true}>商戶類別</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        {mccQuery ? <>
                            <IonItem>
                                <IonLabel>
                                    <h3>商戶類別</h3>
                                </IonLabel>
                                <IonInput className='ion-text-end' {...register("qualify_mcc")} type='text' hidden={true}></IonInput>
                                <IonButton id="open-modal" slot="end" onClick={e => setModalMode("mcc")}>選擇商戶類別</IonButton>
                            </IonItem>
                            <IonItem className='ion-text-wrap'>
                                <div>
                                {mcclist.map((item)=>(
                                    <IonBadge class="badge-margin">{merchantData.merchant_code[item].name}</IonBadge> 
                                ))}
                                </div>
                            </IonItem>
                            <IonItem>
                                <IonLabel>
                                    <h3>不合資格商戶</h3>
                                </IonLabel>
                                <IonInput className='ion-text-end'{...register("disqualified_merchants")} type='text' hidden={true}></IonInput>
                                <IonButton id="open-modal" slot='end' onClick={e => { setModalMode("dqmerchant"); modal.current.present() }}>選擇括免商戶</IonButton>
                            </IonItem>
                            <IonItem className='ion-text-wrap'>
                                <div>
                                {dqmerchantlist.map((item)=>(
                                    <IonBadge class="badge-margin">{merchantData.merchants.data[item].name}</IonBadge> 
                                ))}
                                </div>
                            </IonItem>
                        </> : <>
                            <IonItem>
                                <IonLabel>
                                    <h3>商戶</h3>
                                </IonLabel>
                                <IonInput className='ion-text-end'{...register("qualify_merchant")} type='text' hidden={true}></IonInput>
                                <IonButton id="open-modal" slot='end' onClick={e => setModalMode("merchant")}>選擇商戶</IonButton>
                            </IonItem>
                            <IonItem className='ion-text-wrap' >
                                <div>
                                {merchantlist.map((item)=>(
                                    <IonBadge class="badge-margin">{merchantData.merchants.data[item].name}</IonBadge> 
                                ))}
                                </div>
                            </IonItem>
                        </>
                        }


                        <IonItem>
                            <IonLabel>
                                <h3>每筆簽帳最低要求</h3>
                            </IonLabel>
                            <IonInput className='ion-text-end' type='number'{...register("minimum_bill_size")} slot='end' value={0} ></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>每筆簽帳最大有效額度</h3>
                            </IonLabel>
                            <IonInput className='ion-text-end' type='number'{...register("maximum_bill_size")}  slot='end' value={0} ></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>週期內消費要求</h3>
                            </IonLabel>
                            <IonInput className='ion-text-end' type='number'{...register("minimum_qualification_spend")}  slot='end' value={0} ></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>週期有效消費額度</h3>
                            </IonLabel>
                            <IonInput className='ion-text-end' type='number'{...register("maximum_qualification_spend")}  slot='end' value={0} ></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                <h3>額度重設週期</h3>
                            </IonLabel>
                            
                            <IonSelect slot={"end"}{...register("reset_interval")}>
                                <IonSelectOption value={"none"}>不重設</IonSelectOption>
                                <IonSelectOption value={"day"}>每日</IonSelectOption>
                                <IonSelectOption value={"week"}>每週</IonSelectOption>
                                <IonSelectOption value={"month"}>每月</IonSelectOption>
                                <IonSelectOption value={"quarter"}>每季度</IonSelectOption>
                                <IonSelectOption value={"year"}>每年</IonSelectOption>
                                <IonSelectOption value={"billmonth"}>每帳單月</IonSelectOption>
                                <IonSelectOption value={"billyear"}>每帳單年度</IonSelectOption>
                            </IonSelect>

                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <h3>銀行關係</h3>
                            </IonLabel>
                            <IonSelect slot={"end"}{...register("banking_level")}>
                            {[...Array(banking_level.length).keys()].map((item) => (
                                    <IonSelectOption value={item}>{banking_level[item]}</IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <h3>備註</h3>
                            </IonLabel>
                            <IonSelect multiple={true} slot={"end"}{...register("client_remarks")}>
                            {[...Array(client_remark.length).keys()].map((item) => (
                                    <IonSelectOption value={item}>{client_remark[item]}</IonSelectOption>
                                ))}
                            </IonSelect>
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

export default AddCustomReward;
