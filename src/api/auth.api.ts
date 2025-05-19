import { UserJson } from "@/interfaces/user.interface";
import AuthSetting from "@/models/auth_setting.model";
import api from "@/utils/api.util";
import { extractAxiosError, toggleModal } from "@/utils/functions.util";
import axios from "axios";

interface AuthPromiseResponse {
  data?: UserJson;
  refresh?: string;
  access?: string;
  success?: boolean;
  exp?: string;
  message?: string;
  errors?: {
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
  };
}

interface AuthData {
  email: string;
  password: string;
}

class AuthAPI {
  static async login(data: AuthData): Promise<AuthPromiseResponse | undefined> {
    let promiseResponse: AuthPromiseResponse | undefined = undefined;

    await axios
      .post(
        `https://api.blaffa.net/auth/login`,
        {
          email_or_phone: data.email,
          password: data.password,
        },
        {
          headers: { "Accept-Language": "fr" },
        },
      )
      .then((response) => {
        promiseResponse = response?.data;
      })
      .catch((error) => {
        promiseResponse = error.response.data;
        console.error(error);
      });

    return promiseResponse;
  }

  static async setting(
    data: AuthSetting,
  ): Promise<AuthPromiseResponse | string | undefined> {
    let promiseResponse: AuthPromiseResponse | string | undefined = undefined;

    try {
      await api.post<AuthPromiseResponse>(
        `https://api.yapson.net/auth/change_password`,
        data.toJson(),
      );

      promiseResponse = { success: true };
    } catch (error: any) {
      console.log(`Error when updating password`);

      return extractAxiosError(error);
    }

    return promiseResponse;
  }

  static async logout(modalId: string): Promise<boolean | undefined> {
    localStorage.clear();
    toggleModal(modalId);
    window.location.href = "auth/signin";

    return true;
  }
}

export default AuthAPI;
