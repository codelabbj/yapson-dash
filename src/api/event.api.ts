import { EventJson } from "@/interfaces/event.interface";
import Event from "@/models/event.model";
import PaginatedEvent, {
  PaginatedEventJson,
} from "@/models/paginated_event.model";
import api from "@/utils/api.util";

class EventApi {
  private static route: string = "/events";

  static async findMany(
    searchField?: string,
    filter?: string,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedEvent> {
    try {
      const response = await api.get<PaginatedEventJson>(
        `${this.route}?search_fields=${searchField ?? ""}&filter_field=${filter ?? ""}&page=${page ?? 1}&page_size=${pageSize ?? 20}`,
      );
      return PaginatedEvent.fromJson(response);
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  static async findUnique(eventId: string): Promise<Event> {
    try {
      const response = await api.get<EventJson>(`${this.route}/${eventId}`);
      return Event.fromJson(response);
    } catch (error) {
      console.error(`Error fetching Event with ID ${eventId}:`, error);
      throw error;
    }
  }

  static async add(event: Event): Promise<Event> {
    try {
      const eventJson = event.toJson();
      const response = await api.post<EventJson>(this.route, eventJson);
      return Event.fromJson(response);
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  static async update(event: Event): Promise<Event> {
    try {
      const eventJson = event.toJson();
      const response = await api.put<EventJson>(
        `${this.route}/${event.id}`,
        eventJson,
      );
      return Event.fromJson(response);
    } catch (error) {
      console.error(`Error updating event with ID ${event.id}:`, error);
      throw error;
    }
  }

  static async remove(eventId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${eventId}`);
    } catch (error) {
      console.error(`Error deleting Event with ID ${eventId}:`, error);
      throw error;
    }
  }
}

export default EventApi;
