import { ComplaintResponseJson } from "./complaint_response.interface";
import { UserJson } from "./user.interface";

export interface ComplaintJson {
  id?: string;
  email: string;
  fullname: string;
  message: string;
  user: UserJson;
  response_reclamation: ComplaintResponseJson | null;
}
