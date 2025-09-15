export interface TransactionCharg {
  percent: string;
  country_indication: string;
  slug?: string;
}

export interface SettingJson {
  id: string | null;
  minimum_deposit: string | null;
  minimum_withdrawal: string | null;
  bonus_percent: string | null;
  moov_password: string | null;
  mtn_password: string | null;
  sbin_password: string | null;
  card_password: string | null;
  mtn_url: string | null;
  moov_url: string | null;
  card_url: string | null;
  sbin_url: string | null;
  hash: string | null;
  cash_desk_id: string | null;
  cashierpass: string | null;
  moov_customer: string | null;
  mtn_customer: string | null;
  card_customer: string | null;
  sbin_customer: string | null;
  moov_dis_url: string | null;
  mtn_dis_url: string | null;
  reward_mini_withdrawal: string | null;
  qosic_username: string | null;
  whatsapp_phone_indi: string | null;
  whatsapp_phone: string | null;
  subscription_price: string | null;
  transaction_charges: TransactionCharg[];
  referral_bonus: boolean | null;
  deposit_reward: boolean | null;
  deposit_reward_percent: number | null;
  min_version: number | null; // New field
  last_version: number | null; // New field
  dowload_apk_link: string | null; // New field
  pal_secret_key: string | null;
  pal_public_key: string | null;
  wave_default_link: string | null;
  orange_default_link: string | null; // New field
  mtn_default_link: string | null; // New field
  dgs_secret_key: string | null; // New field
  dgs_public_key: string | null; // New field
  connect_pro_password?: string | null;
  connect_pro_email: string | null;
}

export interface SettingFormData {
  id?: string | undefined;
  minimumDeposit: string | null;
  minimumWithdrawal: string | null;
  bonusPercent: string | null;
  moovPassword: string | null;
  mtnPassword: string | null;
  sbinPassword: string | null;
  cardPassword: string | null;
  mtnUrl: string | null;
  moovUrl: string | null;
  cardUrl: string | null;
  sbinUrl: string | null;
  hash: string | null;
  cashDeskId: string | null;
  cashierPass: string | null;
  moovCustomer: string | null;
  mtnCustomer: string | null;
  cardCustomer: string | null;
  sbinCustomer: string | null;
  moovDisUrl: string | null;
  mtnDisUrl: string | null;
  rewardMiniWithdrawal: string | null;
  qosicUsername: string | null;
  whatsappPhoneIndi: string | null;
  whatsappPhone: string | null;
  subscriptionPrice: string | null;
  transactionCharges: TransactionCharg[];
  referral_bonus: boolean | null;
  deposit_reward: boolean | null;
  deposit_reward_percent: number | null;
  min_version: number | null; // New field
  last_version: number | null; // New field
  dowload_apk_link: string | null; // New field
  pal_secret_key: string | null;
  pal_public_key: string | null;
  wave_default_link: string | null;
  orange_default_link: string | null; // New field
  mtn_default_link: string | null; // New field
  dgs_secret_key: string | null; // New field
  dgs_public_key: string | null; // New field
  connect_pro_password: string | null;
  connect_pro_email: string | null;
}

export interface SettingFormErrors {
  minimumDeposit: string | null;
  minimumWithdrawal: string | null;
  bonusPercent: string | null;
  moovPassword: string | null;
  mtnPassword: string | null;
  sbinPassword: string | null;
  cardPassword: string | null;
  mtnUrl: string | null;
  moovUrl: string | null;
  cardUrl: string | null;
  sbinUrl: string | null;
  hash: string | null;
  cashDeskId: string | null;
  cashierPass: string | null;
  moovCustomer: string | null;
  mtnCustomer: string | null;
  cardCustomer: string | null;
  sbinCustomer: string | null;
  moovDisUrl: string | null;
  mtnDisUrl: string | null;
  rewardMiniWithdrawal: string | null;
  qosicUsername: string | null;
  whatsappPhoneIndi: string | null;
  whatsappPhone: string | null;
  subscriptionPrice: string | null;
  transactionCharges: string | null;
  referral_bonus: boolean | null;
  deposit_reward: boolean | null;
  deposit_reward_percent: number | null;
  min_version: number | null; // New field
  last_version: number | null; // New field
  dowload_apk_link: string | null; // New field
  pal_secret_key: string | null;
  pal_public_key: string | null;
  wave_default_link: string | null;
  orange_default_link: string | null; // New field
  mtn_default_link: string | null; // New field
  dgs_secret_key: string | null; // New field
  dgs_public_key: string | null; // New field
  connect_pro_password: string | null;
  connect_pro_email: string | null;
}
