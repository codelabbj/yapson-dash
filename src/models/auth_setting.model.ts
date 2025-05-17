import { AuthSettingJson } from "@/interfaces/auth_setting.interface";

class AuthSetting {
  oldPassword: string | null;
  newPassword: string | null;
  confirmNewPassword: string | null;

  constructor(
    oldPassword: string | null,
    newPassword: string | null,
    confirmNewPassword: string | null,
  ) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
    this.confirmNewPassword = confirmNewPassword;
  }

  static fromJson(json: AuthSettingJson): AuthSetting {
    return new AuthSetting(
      json.old_password,
      json.new_password,
      json.confirm_new_password,
    );
  }

  toJson(): AuthSettingJson {
    return {
      old_password: this.oldPassword ?? "",
      new_password: this.newPassword ?? "",
      confirm_new_password: this.confirmNewPassword ?? "",
    };
  }
}

export default AuthSetting;
