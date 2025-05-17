export interface AuthSettingJson {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export interface AuthSettingFormData {
  oldPassword: string | null;
  newPassword: string | null;
  confirmNewPassword: string | null;
}

export interface AuthSettingFormErrors {
  oldPassword: string | null;
  newPassword: string | null;
  confirmNewPassword: string | null;
}
