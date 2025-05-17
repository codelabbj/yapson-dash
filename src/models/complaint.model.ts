import { UserJson } from "@/interfaces/user.interface";
import User from "./user.model";
import { ComplaintJson } from "@/interfaces/complaint.interface";
import ComplaintResponse from "./complaint_response.model";

class Complaint {
  id?: string;
  email: string;
  fullname: string;
  message: string;
  user: User;
  response?: ComplaintResponse;

  constructor(
    email: string,
    fullname: string,
    message: string,
    user: User,
    response: ComplaintResponse | undefined,
    id?: string,
  ) {
    this.email = email;
    this.fullname = fullname;
    this.message = message;
    this.user = user;
    this.response = response;
    this.id = id;
  }

  static fromJson(json: ComplaintJson): Complaint {
    return new Complaint(
      json.email,
      json.fullname,
      json.message,
      User.fromJson(json.user),
      json.response_reclamation != null
        ? ComplaintResponse.fromJson(json.response_reclamation)
        : undefined,
      json.id,
    );
  }

  toJson(): ComplaintJson {
    return {
      id: this.id,
      email: this.email,
      fullname: this.fullname,
      message: this.message,
      response_reclamation: this.response?.toJson() ?? null,
      user: this.user.toJson(),
    };
  }
}

export default Complaint;
