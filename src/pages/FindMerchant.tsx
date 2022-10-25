import { IonAvatar, IonBackButton, IonButtons, IonCard, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { add, pin } from 'ionicons/icons';
import ExploreContainer from '../components/ExploreContainer';

const FindMerchantPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton/>
          </IonButtons>
          <IonTitle>Select Merchant</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard className='ion-text-center'>
                <IonCardHeader>
                  <IonTitle>
                    <h1><IonIcon icon={pin}></IonIcon></h1>
                  </IonTitle>
                </IonCardHeader>
                <h2>Near Me</h2>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard className='ion-text-center'>
              <IonCardHeader>
                  <IonTitle>
                    <h1><IonIcon icon={add}></IonIcon></h1>
                  </IonTitle>
                </IonCardHeader>
                <h2>Add your own</h2>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonSearchbar animated={true} placeholder="Animated"></IonSearchbar>
        <IonList>
        <IonListHeader>
            <IonLabel>搜尋結果</IonLabel>
          </IonListHeader>
          <IonItem routerDirection='forward' routerLink='/rewardResults/15932'>
            <IonAvatar slot='start'>
              <img src="/assets/images/merchants/donki.png" />
            </IonAvatar>
            <IonLabel>
              <h3>Donki Central</h3>
              <p color='muted'>Central, Hong Kong</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel className='ion-text-center'>
              <h3>請輸入商家名稱或開啟定位功能</h3>
            </IonLabel>
          </IonItem>
        </IonList>
        <IonList>
          <IonListHeader>
            <IonLabel>綜合消費</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonAvatar slot='start'>
              <img src="/assets/images/merchants/donki.png" />
            </IonAvatar>
            <IonLabel>
              <h3>網購（港幣）</h3>
              <p color='muted'>以港幣於網上商戶購物</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar slot='start'>
              <img src="/assets/images/merchants/donki.png" />
            </IonAvatar>
            <IonLabel>
              <h3>網購（人民幣）</h3>
              <p color='muted'>以人民幣於網上商戶購物</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar slot='start'>
              <img src="/assets/images/merchants/donki.png" />
            </IonAvatar>
            <IonLabel>
              <h3>網購（外幣）</h3>
              <p color='muted'>以外幣於網上商戶購物</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar slot='start'>
              <img src="/assets/images/merchants/donki.png" />
            </IonAvatar>
            <IonLabel>
              <h3>繳費</h3>
              <p color='muted'>繳交各種費用，如管理費，學費等</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar slot='start'>
              <img src="/assets/images/merchants/donki.png" />
            </IonAvatar>
            <IonLabel>
              <h3>繳交租金</h3>
              <p color='muted'>透過信用卡交租予業主</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar slot='start'>
              <img src="/assets/images/merchants/donki.png" />
            </IonAvatar>
            <IonLabel>
              <h3>交稅</h3>
              <p color='muted'>香港政府</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonAvatar slot='start'>
              <img src="/assets/images/merchants/plus.png" />
            </IonAvatar>
            <IonLabel>
              <h3>找不到商家？</h3>
              <p>按此要求我們團隊添加</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default FindMerchantPage;
