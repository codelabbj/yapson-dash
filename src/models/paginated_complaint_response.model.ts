import { ComplaintResponseJson } from "@/interfaces/complaint_response.interface";
import ComplaintResponse from "./complaint_response.model";

export interface PaginatedComplaintResponseJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: ComplaintResponseJson[];
}

class PaginatedComplaintResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ComplaintResponse[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: ComplaintResponse[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(
    json: PaginatedComplaintResponseJson,
  ): PaginatedComplaintResponse {
    return new PaginatedComplaintResponse(
      json.count,
      json.next,
      json.previous,
      json.results.map(ComplaintResponse.fromJson),
    );
  }

  toJson(): PaginatedComplaintResponseJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((complaintResponse) =>
        complaintResponse.toJson(),
      ),
    };
  }
}

export default PaginatedComplaintResponse;
