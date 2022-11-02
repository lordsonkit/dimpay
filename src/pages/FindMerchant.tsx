import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRow,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { add, pin } from "ionicons/icons";
import { useContext, useEffect, useState } from "react";
import { MerchantListContext } from "../App";

const FindMerchantPage: React.FC = () => {
  const { merchantData, setMerchantData } = useContext(MerchantListContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [merchantTypeResults, setMerchantTypeResults] = useState([]);
  const [gpsSearchMode, setGPSSearchMode] = useState(false)
  const [waitingGPS, setWaitingGPS] = useState(false)
  const [GPSTarget, setGPSTarget] = useState([0,0])
  const [presentAlert] = useIonAlert();

  
  useEffect(() => {
    // filter here

    setGPSSearchMode(false)
    let processedTerm=searchTerm.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@ ]/g, '');
    let tempSearchResult = merchantData.merchants.data.filter(
      (ele) =>
        ele.name.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@] /g, '').includes(processedTerm) ||
        ele.description.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@ ]/g, '').includes(processedTerm) ||
        ele.search_keywords.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@ ]/g, '').includes(processedTerm)
    ).slice(0, 30);
    setSearchResults([...tempSearchResult]);
  }, [searchTerm, merchantData]);

    
  useEffect(() => {
    // filter here
    let processedTerm=searchTerm.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@ ]/g, '');
    let tempSearchResult = []
    for(let key in merchantData.merchant_code){
      if(
        merchantData.merchant_code[key].name.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@] /g, '').includes(processedTerm) ||
        merchantData.merchant_code[key].description.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@] /g, '').includes(processedTerm) 
        ){
          tempSearchResult.push({
            ...merchantData.merchant_code[key],
            mcc: key
          })
        }
    }
    tempSearchResult.slice(0, 30);
    setMerchantTypeResults([...tempSearchResult]);
  }, [searchTerm, merchantData]);

  function findByGPS(){
    setWaitingGPS(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(gpsLocated,gpsFailed,{
        enableHighAccuracy: true,
        timeout: 15000,
      });
    } else {
      gpsFailed()
    }
  }
  function gpsLocated(position){
    setWaitingGPS(false)
    setGPSSearchMode(true)
    console.log(position)
    setGPSTarget([position.coords.latitude,position.coords.longitude])
  }
  function gpsFailed(){
    setWaitingGPS(false)
    presentAlert({
      header: 'Alert',
      subHeader: 'Failed to get your location',
      message: 'Please enable geolocation permission for the app',
      buttons: ['OK'],
    })
    setGPSSearchMode(false)
  }


  //gps search logic

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Select Merchant</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard className="ion-text-center" onClick={findByGPS}>
                <IonCardHeader>
                  <IonTitle>
                    <h1>
                      {!waitingGPS && <IonIcon icon={pin}></IonIcon>}
                      {waitingGPS && <IonSpinner></IonSpinner>}
                    </h1>
                  </IonTitle>
                </IonCardHeader>
                <h2>附近</h2>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard className="ion-text-center">
                <IonCardHeader>
                  <IonTitle>
                    <h1>
                      <IonIcon icon={add}></IonIcon>
                    </h1>
                  </IonTitle>
                </IonCardHeader>
                <h2>Add your own</h2>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
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

          { (!searchTerm&&!gpsSearchMode) && <IonItem>
            <IonLabel className="ion-text-center">
              <h3>請輸入商家名稱或開啟定位功能</h3>
            </IonLabel>
          </IonItem>}

          { (searchTerm && !gpsSearchMode) && searchResults.map(({ name, description, id, image }) => (
            <IonItem routerDirection="forward" routerLink={"/rewardResults/"+id}>
              <IonAvatar slot="start">
                <img src={image} alt="logo" />
              </IonAvatar>
              <IonLabel>
                <h3>{name}</h3>
                <p color="muted">{description}</p>
              </IonLabel>
            </IonItem>
          ))}
        
          
        </IonList>
        <IonList>
          <IonListHeader>
            <IonLabel>綜合消費</IonLabel>
          </IonListHeader>
          {merchantTypeResults.map(({name,description,mcc,image}) => (
            <IonItem routerDirection="forward" routerLink={"/rewardResults/mcc"+mcc}>
            <IonAvatar slot="start">
              <img src={image} alt="logo" />
            </IonAvatar>
            <IonLabel>
              <h3>{name}</h3>
              <p color="muted">{description}</p>
            </IonLabel>
          </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};


export default FindMerchantPage;
