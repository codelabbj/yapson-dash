import { UserJson } from "@/interfaces/user.interface";

class User {
  id?: string;
  firstname?: string;
  lastname?: string;
  fullname?: string;
  email?: string;
  phoneIndicative?: string;
  phone?: string;
  dateJoined?: Date;
  isBlock?: boolean;
  preferenceNotification?: string;
  lastLogin?: Date;
  userAppId?: string;
  referralCode?: string;
  referralLink?: string;
  access?: string;
  refresh?: string;
  isStaff? : boolean;

  constructor(
    firstname?: string,
    lastname?: string,
    fullname?: string,
    email?: string,
    phoneIndicative?: string,
    phone?: string,
    dateJoined?: Date,
    isBlock?: boolean,
    preferenceNotification?: string,
    lastLogin?: Date,
    userAppId?: string,
    referralCode?: string,
    referralLink?: string,
    access?: string,
    refresh?: string,
    id?: string,
    isStaff? : boolean,
  ) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.fullname = fullname;
    this.email = email;
    this.phoneIndicative = phoneIndicative;
    this.phone = phone;
    this.dateJoined = dateJoined;
    this.isBlock = isBlock;
    this.preferenceNotification = preferenceNotification;
    this.lastLogin = lastLogin;
    this.userAppId = userAppId;
    this.referralCode = referralCode;
    this.referralLink = referralLink;
    access = access;
    refresh = refresh;
    this.id = id;
    this.isStaff = isStaff;
  }

  *[Symbol.iterator]() {
    yield this.id;
    yield this.firstname;
    yield this.lastname;
    yield this.email;
    yield this.phoneIndicative;
    yield this.phone;
    yield this.dateJoined;
    yield this.isBlock;
    yield this.preferenceNotification;
    yield this.lastLogin;
    yield this.userAppId;
    yield this.referralCode;
    yield this.referralLink;
    yield this.isStaff
  }

  static fromJson(json: UserJson): User {
    console.log(json);
    return new User(
      json.first_name,
      json.last_name,
      json.fullname,
      json.email,
      json.phone_indicative,
      json.phone,
      json.date_joined != null ? new Date(json.date_joined) : undefined,
      json.is_block,
      json.preference_notification,
      json.last_login != null ? new Date(json.last_login!) : undefined,
      json.user_app_id,
      json.referral_code,
      json.referral_link,
      json.access,
      json.refresh,
      json.id,
      json.is_staff != null ? json.is_staff : false
    );
  }

  toJson(): UserJson {
    return {
      id: this.id,
      first_name: this.firstname,
      last_name: this.lastname,
      fullname: this.fullname,
      email: this.email,
      phone_indicative: this.phoneIndicative,
      phone: this.phone,
      date_joined: this.dateJoined?.toISOString(),
      is_block: this.isBlock,
      preference_notification: this.preferenceNotification,
      last_login:
        this.lastLogin != null ? this.lastLogin.toISOString() : undefined,
      user_app_id: this.userAppId,
      referral_link: this.referralLink,
      is_staff: this.isStaff ?? false
    };
  }
}

export default User;
