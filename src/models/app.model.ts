import { AppJson } from "@/interfaces/app.interface";

class App {
  id?: string;
  name: string;
  image: string;
  hash: string;
  cashdeskid: string;
  cashierpass: string;
  deposit_tuto_content: string;
  deposit_link: string;
  withdrawal_tuto_content: string;
  withdrawal_link: string;
  order: string;
  city: string;
  street: string;

  constructor(name: string, image: string, hash: string, cashdeskid: string, cashierpass: string, deposit_tuto_content: string, deposit_link: string, withdrawal_tuto_content: string, withdrawal_link: string, order: string, city: string, street: string, id?: string) {
    this.name = name;
    this.image = image;
    this.id = id;
    this.hash = hash;
    this.cashdeskid = cashdeskid;
    this.cashierpass = cashierpass;
    this.deposit_tuto_content = deposit_tuto_content;
    this.deposit_link = deposit_link;
    this.withdrawal_tuto_content = withdrawal_tuto_content;
    this.withdrawal_link = withdrawal_link;
    this.order = order;
    this.city = city;
    this.street = street;

  }

  static fromJson(json: AppJson): App {
    return new App(json.name, json.image, json.hash, json.cashdeskid, json.cashierpass, json.deposit_tuto_content, json.deposit_link, json.withdrawal_tuto_content, json.withdrawal_link, json.order, json.city, json.street, json.id);
  }

  toJson(): AppJson {
    return {
      id: this.id,
      name: this.name,
      image: this.image,
      hash : this.hash,
      cashdeskid : this.cashdeskid,
      cashierpass : this.cashierpass,
      deposit_tuto_content : this.deposit_tuto_content,
      deposit_link : this.deposit_link,
      withdrawal_tuto_content : this.withdrawal_tuto_content,
      withdrawal_link : this.withdrawal_link,
      order : "",
      city : this.city,
      street : this.street
    };
  }
}

export default App;
