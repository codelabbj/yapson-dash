import api from "@/utils/api.util";
import ComplaintResponse from "@/models/complaint_response.model";
import PaginatedComplaintResponse, {
  PaginatedComplaintResponseJson,
} from "@/models/paginated_complaint_response.model";
import { ComplaintResponseJson } from "@/interfaces/complaint_response.interface";

class ComplaintResponseApi {
  private static route: string = "/response_reclamation";

  static async findMany(
    searchField?: string,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedComplaintResponse> {
    try {
      const response = await api.get<PaginatedComplaintResponseJson>(
        `${this.route}?search_fields=${searchField ?? ""}&page=${page ?? 1}&page_size=${pageSize ?? 20}`,
      );
      return PaginatedComplaintResponse.fromJson(response);
    } catch (error) {
      console.error("Error fetching complaintResponses:", error);
      throw error;
    }
  }

  static async findUnique(
    complaintResponseId: string,
  ): Promise<ComplaintResponse> {
    try {
      const response = await api.get<ComplaintResponseJson>(
        `${this.route}/${complaintResponseId}`,
      );
      return ComplaintResponse.fromJson(response);
    } catch (error) {
      console.error(
        `Error fetching complaintResponse with ID ${complaintResponseId}:`,
        error,
      );
      throw error;
    }
  }

  static async add(
    complaintResponse: ComplaintResponse,
  ): Promise<ComplaintResponse> {
    try {
      const complaintResponseJson = complaintResponse.toJson();
      const response = await api.post<ComplaintResponseJson>(
        this.route,
        complaintResponseJson,
      );
      return ComplaintResponse.fromJson(response);
    } catch (error) {
      console.error("Error creating complaintResponse:", error);
      throw error;
    }
  }

  static async update(
    complaintResponse: ComplaintResponse,
  ): Promise<ComplaintResponse> {
    try {
      const complaintResponseJson = complaintResponse.toJson();
      const response = await api.put<ComplaintResponseJson>(
        `${this.route}/${complaintResponse.id}`,
        complaintResponseJson,
      );
      return ComplaintResponse.fromJson(response);
    } catch (error) {
      console.error(
        `Error updating complaintResponse with ID ${complaintResponse.id}:`,
        error,
      );
      throw error;
    }
  }

  static async remove(complaintResponseId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${complaintResponseId}`);
    } catch (error) {
      console.error(
        `Error deleting complaintResponse with ID ${complaintResponseId}:`,
        error,
      );
      throw error;
    }
  }
}

export default ComplaintResponseApi;
