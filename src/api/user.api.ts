import api from "@/utils/api.util";
import User from "../models/user.model";
import PaginatedUser, {
  PaginatedUsersJson,
} from "@/models/paginated_user.model";
import { UserJson } from "@/interfaces/user.interface";
import axios from "axios";

class UserApi {
  private static route: string = "/users";

  static async findMany(
    searchField?: string,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedUser> {
    try {
      const token = localStorage.getItem("access");

      const response = await axios.get<PaginatedUsersJson>(
        `https://api.yapson.net/auth/users?search_fields=${searchField ?? ""}&page=${page ?? 1}&page_size=${pageSize ?? 20}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language": "fr",
          },
        },
      );
      return PaginatedUser.fromJson(response.data);
    } catch (error) {
      console.error("Error fetching paginated users:", error);
      throw error;
    }
  }

  static async findUnique(userId: string): Promise<User> {
    try {
      const response = await api.get<UserJson>(`${this.route}/${userId}`);
      return User.fromJson(response);
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      throw error;
    }
  }

  static async add(user: User): Promise<User> {
    try {
      const userJson = user.toJson();
      const response = await api.post<UserJson>("${this.route}", userJson);
      return User.fromJson(response);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async update(user: User): Promise<User> {
    try {
      const userJson = user.toJson();
      const response = await api.put<UserJson>(
        `${this.route}/${user.id}`,
        userJson,
      );
      return User.fromJson(response);
    } catch (error) {
      console.error(`Error updating user with ID ${user.id}:`, error);
      throw error;
    }
  }

  static async block(user: User): Promise<void> {
    try {
      await api.post<void>(`block/${user.isBlock ? "deblock" : "block"}`, {
        user_id: user.id,
      });
    } catch (error) {
      console.error(`Error blocking user with ID ${user.id}:`, error);
      throw error;
    }
  }

  static async remove(userId: string, adminPassword: string): Promise<void> {
    const token = localStorage.getItem("access");
    try {
      await axios.post(
        "https://api.yapson.net/auth/admin/user/delete",
        { password: adminPassword, user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "fr",
          },
        },
      );
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      throw error;
    }
  }
}

export default UserApi;
