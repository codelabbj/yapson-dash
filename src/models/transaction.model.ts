import { UserJson } from "@/interfaces/user.interface";
import User from "./user.model";
import { TransactionJson } from "@/interfaces/transaction.interface";
import App from "./app.model";

class Transaction {
  id?: string;
  amount: number;
  user: User;
  reference: string;
  typeTrans: string;
  status: string;
  counntryCode?: string;
  phoneNumber: string;
  country: string;
  mobileReference: string;
  app?: App;
  userAppId?: string;
  createdAt?: Date;
  withdrawalCode?: string;
  error_message?: string;

  constructor(
    amount: number,
    user: User,
    reference: string,
    typeTrans: string,
    status: string,
    phoneNumber: string,
    country: string,
    mobileReference: string,
    createdAt: Date,
    countryCode?: string,
    app?: App,
    userAppId?: string,
    withdrawalCode?: string,
    id?: string,
    error_message?: string,
  ) {
    this.amount = amount;
    this.user = user;
    this.reference = reference;
    this.typeTrans = typeTrans;
    this.status = status;
    this.phoneNumber = phoneNumber;
    this.country = country;
    (this.counntryCode = countryCode), (this.app = app);
    this.userAppId = userAppId;
    this.mobileReference = mobileReference;
    this.withdrawalCode = withdrawalCode;
    this.createdAt = createdAt;
    this.id = id;
    this.error_message = error_message;
  }

  static fromJson(json: TransactionJson): Transaction {
    console.log(`json => `, json, json.network?.name);
    return new Transaction(
      Number.parseInt(json.amount),
      User.fromJson(json.user),
      json.reference,
      json.type_trans,
      json.status,
      json.phone_number,
      json.country,
      json.network?.name ?? "Inconnu",
      new Date(json.created_at),
      undefined,
      json.app != null ? App.fromJson(json.app!) : undefined,
      json.user_app_id,
      json.withdrawal_code,
      json.id,
      json.error_message,
    );
  }

  toJson(): TransactionJson {
    return {
      id: this.id,
      amount: this.amount.toString(),
      user: this.user.toJson(),
      reference: this.reference,
      type_trans: this.typeTrans,
      status: this.status,
      indication: this.counntryCode,
      phone_number: this.phoneNumber,
      country: this.country,
      app: this.app?.toJson(),
      transaction_reference: this.reference,
      app_id: this.app?.id,
      user_app_id: this.userAppId,
      mobile_reference: this.mobileReference,
      withdrawal_code: this.withdrawalCode,
      created_at: this.createdAt?.toISOString() ?? new Date().toISOString(),
      error_message: this.error_message,
    };
  }
}

export default Transaction;
