interface ContainerProps {
  name: string;
}

interface Card {
    card_name: string,
    issuer: Issuer,
    card_id: number,
    earn_miles: boolean,
    earn_cash: boolean,
    card_reward_type: "cash" | "miles" | "points",
    card_network: "visa" | "mastercard" | "amex",
    registration_link: string,
    base_reward_cash: number,
    base_reward_miles: number,
    has_mileage_programme:boolean,
    mileage_programme: {
        loyalty: MileageProgramme,
        conversion_ratio: string
    },
    annual_fee: number,
    annual_salary: number,
    fx_fee:number,

    
}

interface UserSettings {
    active_cards: {
        card: Card,
        relation_age: number,
        has_premium_banking: boolean,
        has_private_banking: boolean,

    }
}

interface MileageProgramme {
    name: string,
    abbreviation: string,
}

interface Issuer {
    name: string;
    issuer_id: string;
}

interface CardAdvert {
    card: Card,
    advert_text: string,
    advert_link: string,
}

interface Reward {
    reward_name: string,
    reward_type: "cash"|"discount"|"miles"|"credit", 
    reward_id: string,
    target_cards: Card[],
    reward_ratio: number,
    charge_currency_requirement: "hkd"|"cny"|"fx"|"any",
    charge_category_requirement: any[],
    payment_method: PaymentMethod[],
    card_age_bonus: [number,number][], //[age,bonus_multiplier]
    day_of_week: number[],
    day_of_month: number[],
    online_only: boolean,
    bill_payment: boolean,
    offer_time:[number,number][],
    minimum_bill_size:number,
    maximum_bill_size:number,
    minimum_qualification_spend:number,
    maximum_qualifacation_spend:number
}
enum PaymentMethod {
    
}
interface ContainerProps {
    name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div className="container">
      <strong>{name}</strong>
      <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
    </div>
  );
};

export default ExploreContainer;
