import Complaint from "./complaint.model";
import { ComplaintResponseJson } from "@/interfaces/complaint_response.interface";

class ComplaintResponse {
  id?: string;
  complaintId: string;
  response: string;
  createdAt: Date;

  constructor(
    complaintId: string,
    response: string,
    createdAt: Date,
    id?: string,
  ) {
    this.complaintId = complaintId;

    this.response = response;
    this.createdAt = createdAt;
    this.id = id;
  }

  static fromJson(json: ComplaintResponseJson): ComplaintResponse {
    return new ComplaintResponse(
      json.reclamation,
      json.response,
      new Date(json.created_at),

      json.id,
    );
  }

  toJson(): ComplaintResponseJson {
    return {
      id: this.id,
      response: this.response,
      reclamation: this.complaintId,
      reclamation_id: this.complaintId,
      created_at: this.createdAt.toISOString(),
    };
  }
}

export default ComplaintResponse;
