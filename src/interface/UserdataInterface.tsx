
    export interface Reward {
        reward_name: string;
        reward_type: string;
        reward_id: number;
        target_cards: number[];
        reward_ratio: number;
        charge_currency_requirement: string;
        charge_category_requirement: number[];
        payment_method: number[];
        card_age_bonus: number[][];
        day_of_week?: any;
        day_of_month?: any;
        online_only: boolean;
        bill_payment: boolean;
        offer_time: number[][];
        minimum_bill_size: number;
        maximum_bill_size: number;
        minimum_qualification_spend: number;
        maximum_qualifacation_spend: number;
    }

    export interface CustomRewards {
        data: Reward[];
    }

    export interface Userdata {
        username: string;
        card_owned: UserCardOptions;
        milelage_value: number[][];
        has_premium_baking: any[][];
        has_private_banking: any[][];
        custom_rewards: CustomRewards;
    }

    export interface UserCardOptions {
        expiry:number,
        user_has_premium_banking:boolean,
        user_has_private_banking:false,
        billing_date:number       
    }



