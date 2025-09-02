
import { NetworkJson } from "@/interfaces/network.interface";

class Network {
  id?: string;
  name: string;
  placeholder: string;
  publicName: string;
  countryCode: string;
  indication: string;
  image: File | string;
  messageInit?: string;
  createdAt: Date;
  deposit_api?: string;
  withdrawal_api?: string;
  deposit_message?: string;
  withdrawal_message?: string;
  otp_required: boolean; // New field
  enable: boolean; // New field

  constructor(
    name: string,
    image: File | string,
    createdAt: Date,
    placeholder: string,
    publicName: string,
    countryCode: string,
    indication: string,
    otp_required: boolean, // New field
    enable: boolean, // New field
    id?: string,
    deposit_api?: string,
    withdrawal_api?: string,
    messageInit?: string,
    deposit_message?: string,
    withdrawal_message?: string,
  ) {
    this.name = name;
    this.id = id;
    this.countryCode = countryCode;
    this.indication = indication;
    this.publicName = publicName;
    this.image = image;
    this.placeholder = placeholder;
    this.createdAt = createdAt;
    this.messageInit = messageInit;
    this.deposit_api = deposit_api;
    this.withdrawal_api = withdrawal_api;
    this.deposit_message = deposit_message;
    this.withdrawal_message = withdrawal_message;
    this.otp_required = otp_required; // New field
    this.enable = enable; // New field
  }

  static fromJson(json: NetworkJson): Network {
    return new Network(
      json.name,
      json.image,
      new Date(json.created_at),
      json.placeholder,
      json.public_name,
      json.country_code,
      json.indication,
      json.otp_required ?? false, // New field
      json.enable ?? false, // New field
      json.id,
      json.deposit_api,
      json.withdrawal_api,
      json.messageInit,
      json.deposit_message,
      json.withdrawal_message,
    );
  }

  toJson(): NetworkJson {
    return {
      id: this.id,
      name: this.name,
      image: this.image,
      created_at: this.createdAt?.toISOString(),
      placeholder: this.placeholder,
      public_name: this.publicName,
      country_code: this.countryCode,
      indication: this.indication,
      messageInit: this.messageInit,
      deposit_api: this.deposit_api,
      withdrawal_api: this.withdrawal_api,
      deposit_message: this.deposit_message,
      withdrawal_message: this.withdrawal_message,
      otp_required: this.otp_required, // New field
      enable: this.enable, // New field
    };
  }
}

export default Network;