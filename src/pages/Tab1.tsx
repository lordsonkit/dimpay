import { IonButton, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSearchbar, IonSlide, IonSlides, IonTitle, IonToolbar } from '@ionic/react';
import { add, cog, pencil, search } from 'ionicons/icons';
import { useHistory } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import MyCards from '../components/MyCards';
import './Tab1.css';
const cards=[
  {cardName:'hsbcvs', cardImage:"/assets/images/hsbcvs.webp", cardId:"123"}
]
const Tab1: React.FC = () => {
    const history=useHistory();
  return (
    <IonPage>
      <IonHeader>
          <IonToolbar>
            <IonSearchbar className='home_searchbar' onIonFocus={e=>history.push("/findMerchant")}></IonSearchbar>
          </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSlides pager options={{speed:500, autoplay:{delay:10000}}}>
          <IonSlide> 
            <img src="https://ionic-docs-demo.herokuapp.com/assets/card-top-img.png"></img>
          </IonSlide>
          <IonSlide>
          <img src="https://ionic-docs-demo.herokuapp.com/assets/card-top-img.png"></img>
          </IonSlide>
        </IonSlides>
        
        <div>
          <IonList>
          <IonListHeader>
            < IonLabel>我的信用卡</IonLabel>
          </IonListHeader>
          </IonList>
          <MyCards></MyCards>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton expand='block' routerDirection='forward' routerLink='/findMerchant' color="primary" >
                  <IonLabel>
                    <IonIcon icon={search}></IonIcon> 查找簽帳回贈
                  </IonLabel>
                </IonButton>                
              </IonCol>
              <IonCol>
                <IonButton expand='block' routerDirection='forward' routerLink='/addCard' color="light" >
                  <IonLabel><IonIcon icon={cog}></IonIcon> 管理我的信用卡</IonLabel>
                </IonButton>                
              </IonCol>
            </IonRow>
          </IonGrid>
          

        </div>

        <IonList style={{display:"none"}}>
          <IonListHeader>
            < IonLabel>近期紀錄的交易</IonLabel>
          </IonListHeader>
          <IonItem>Item 1</IonItem>
          <IonItem>Item 2</IonItem>
          <IonItem>Item 1</IonItem>
          <IonItem>Item 2</IonItem>
        </IonList>
        <IonFab vertical='bottom' horizontal='end' slot='fixed'>
          <IonFabButton routerDirection='forward' routerLink='/findMerchant'>
            <IonIcon icon={search} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
    
  );
};

export default Tab1;
