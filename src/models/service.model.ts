import { ServiceJson } from "@/interfaces/service.interface";

class Service {
  id?: string;
  name: string;
  email: string;
  phone: string;
  phoneIndication: string;
  secretKey: string;
  isActive: boolean;

  constructor(
    name: string,
    email: string,
    phone: string,
    phoneIndication: string,
    secretKey: string,
    isActive: boolean,
    id?: string,
  ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.phoneIndication = phoneIndication;
    this.secretKey = secretKey;
    this.isActive = isActive;
    this.id = id;
  }

  static fromJson(json: ServiceJson): Service {
    return new Service(
      json.name,
      json.email,
      json.phone,
      json.phone_indication,
      json.secret_key,
      json.is_active,
      json.id,
    );
  }

  toJson(): ServiceJson {
    return {
      id: this.id ?? "",
      name: this.name,
      email: this.email,
      phone: this.phone,
      phone_indication: this.phoneIndication,
      secret_key: this.secretKey,
      is_active: this.isActive,
    };
  }
}

export default Service;
