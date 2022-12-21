import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { navigateOutline } from "ionicons/icons";
import { useContext, useEffect, useRef, useState } from "react";
import { MerchantListContext } from "../App";

const FindMerchantPage: React.FC = () => {
  const { merchantData, setMerchantData } = useContext(MerchantListContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [gpsResults, setGpsResults] = useState([]);
  const [merchantTypeResults, setMerchantTypeResults] = useState([]);
  const [gpsSearchMode, setGPSSearchMode] = useState(false)
  const [waitingGPS, setWaitingGPS] = useState(false)
  const [GPSTarget, setGPSTarget] = useState([0,0])
  const [presentAlert] = useIonAlert();
  const searchbarRef = useRef(null);

  useEffect(() => {
    setTimeout(function(){
      searchbarRef.current.setFocus()
    },500)
  },[])

  
  useEffect(() => {
    // filter here

        // filter here
    if(searchTerm.length>0){
      setGPSSearchMode(false)
    }
    let processedTerm=searchTerm.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@ ]/g, '');
    
    let tempSearchResult = []
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
    setSearchResults([...tempSearchResult]);
  }, [searchTerm, merchantData]);

  
  useEffect(() => {
    // filter here
    const min_distance_to_locations = (locations:number[][],target_location:number[]) => {
      let distance=9999999999;
      for(var i=0;i<locations.length;i++){
        let item_distance=getDistanceFromLatLonInMeters(locations[i][0],locations[i][1],target_location[0],target_location[1]);
        if (item_distance < distance){
          distance=item_distance
        }
      }
      return distance
    }
    function getDistanceFromLatLonInMeters(lat1,lon1,lat2,lon2) {
      var R = 6371*1000; // Radius of the earth in m
      var dLat = deg2rad(lat2-lat1);
      var dLon = deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in m
      return d;
    }
    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }
    function dynamicSort(property) {
      var sortOrder = 1;
      if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
      }
      return function (a,b) {
          /* next line works with strings and numbers, 
           * and you may want to customize it to your needs
           */
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
      }
    }

    let tempSearchResult = []
    for(var i in merchantData.merchants.data){
      if(merchantData.merchants.data[i].locations.length>0){
        tempSearchResult.push(
          {
            ...merchantData.merchants.data[i],
            distance:min_distance_to_locations(merchantData.merchants.data[i].locations,GPSTarget)
          }
        )
      }
    }
/*
    merchantData.merchants.data.filter(
      (ele) =>
        ele.name.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@] /g, '').includes(processedTerm) ||
        ele.description.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@ ]/g, '').includes(processedTerm) ||
        ele.search_keywords.toLocaleLowerCase().replace(/[&\/\\#^+()$~%.'":*?<>{}!@ ]/g, '').includes(processedTerm)
    );
    */
    tempSearchResult.sort(dynamicSort("distance")).slice(0, 30);
    setGpsResults([...tempSearchResult]);
  }, [GPSTarget, merchantData]);
    
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
    ;
    setMerchantTypeResults([...tempSearchResult.slice(0, 30)]);
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
          <IonTitle>選擇商戶</IonTitle>

          <IonButtons slot="end">
            <IonButton onClick={findByGPS}>
              {!waitingGPS && <>附近 <IonIcon icon={navigateOutline}></IonIcon></>}
              {waitingGPS && <IonSpinner></IonSpinner>}
              
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar
          animated={true}
          value={searchTerm}
          ref={searchbarRef}
          onIonChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜尋"
        ></IonSearchbar>
        <IonList>
          <IonListHeader>
            <IonLabel>搜尋結果</IonLabel>
          </IonListHeader>

          { (!searchTerm&&!gpsSearchMode) && <IonItem key="requestGPS">
            <IonLabel className="ion-text-center">
              <h3>請輸入商家名稱或開啟定位功能</h3>
            </IonLabel>
          </IonItem>}

          { (searchTerm && !gpsSearchMode) && searchResults.map(({ name, description, id, image }) => (
            <IonItem routerDirection="forward" routerLink={"/rewardResults/"+id} key={"search"+id}>
              <IonAvatar slot="start">
                <img src={image} alt="logo" />
              </IonAvatar>
              <IonLabel>
                <h3>{name}</h3>
                <p color="muted">{description}</p>
              </IonLabel>
            </IonItem>
          ))}

          { (gpsSearchMode) && gpsResults.map(({ name, description, id, image, distance }) => (
            <IonItem routerDirection="forward" routerLink={"/rewardResults/"+id} key={"gps"+id}>
              <IonAvatar slot="start">
                <img src={image} alt="logo" />
              </IonAvatar>
              <IonLabel>
                <h3>{name}</h3>
                <p color="muted">{description}</p>
              </IonLabel>
              <IonLabel slot="end" color="muted">
                {(distance<1000) && String(parseInt(distance))+" m"}
                {!(distance<1000) && String((parseInt(distance)/1000).toFixed(2))+" km"}
              </IonLabel>
            </IonItem>
          ))}
        
          
        </IonList>
        <IonList>
          <IonListHeader>
            <IonLabel>綜合消費</IonLabel>
          </IonListHeader>
          {merchantTypeResults.map(({name,description,mcc,image}) => (
            <IonItem routerDirection="forward" routerLink={"/rewardResults/mcc"+mcc} key={"mcc"+mcc}>
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
