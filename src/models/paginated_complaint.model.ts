import { ComplaintJson } from "@/interfaces/complaint.interface";
import Complaint from "./complaint.model";

export interface PaginatedComplaintJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: ComplaintJson[];
}

class PaginatedComplaint {
  count: number;
  next: string | null;
  previous: string | null;
  results: Complaint[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: Complaint[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedComplaintJson): PaginatedComplaint {
    return new PaginatedComplaint(
      json.count,
      json.next,
      json.previous,
      json.results.map(Complaint.fromJson),
    );
  }

  toJson(): PaginatedComplaintJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((complaintComplaint) =>
        complaintComplaint.toJson(),
      ),
    };
  }
}

export default PaginatedComplaint;
