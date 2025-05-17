import { TicketJson } from "@/interfaces/ticket.interface";

import api from "@/utils/api.util";
import PaginatedTicket, {
  PaginatedTicketJson,
} from "@/models/paginated_ticket.model";
import Ticket from "@/models/ticket.model";
import BetApp from "@/models/betapp.model";
import { BetAppJson } from "@/interfaces/betapp.interface";

class TicketApi {
  private static route: string = "/coupon";

  static async findMany(
    searchField?: string,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedTicket> {
    try {
      const response = await api.get<PaginatedTicketJson>(
        `${this.route}?search_fields=${searchField ?? ""}&page=${page ?? 1}&page_size=${pageSize ?? 20}`,
      );
      return PaginatedTicket.fromJson(response);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
  }

  static async findUnique(ticketId: string): Promise<Ticket> {
    try {
      const response = await api.get<TicketJson>(`${this.route}/${ticketId}`);
      return Ticket.fromJson(response);
    } catch (error) {
      console.error(`Error fetching ticket with ID ${ticketId}:`, error);
      throw error;
    }
  }

  static async add(ticket: Ticket): Promise<Ticket> {
    try {
      const ticketJson = ticket.toJson();
      const response = await api.post<TicketJson>(`${this.route}`, ticketJson);
      return Ticket.fromJson(response);
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  }

  static async update(ticket: Ticket): Promise<Ticket> {
    try {
      const ticketJson = ticket.toJson();
      const response = await api.put<TicketJson>(
        `${this.route}/${ticket.id}`,
        ticketJson,
      );
      return Ticket.fromJson(response);
    } catch (error) {
      console.error(`Error updating ticket with ID ${ticket.id}:`, error);
      throw error;
    }
  }

  static async remove(ticketId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${ticketId}`);
    } catch (error) {
      console.error(`Error deleting ticket with ID ${ticketId}:`, error);
      throw error;
    }
  }

  static async getApps() : Promise<BetApp[]> {
    try {
      const response = await api.get<BetAppJson[]>("/betpay/app_name");
      return response.map((e) => BetApp.fromJson(e));
    } catch(e) {
      return [];
    }
  }
}

export default TicketApi;
