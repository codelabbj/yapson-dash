import { DepositFormData, DepositJson } from "@/interfaces/deposit.interface";
import Deposit from "@/models/deposit.model";
import PaginatedDeposit, {
  PaginatedDepositJson,
} from "@/models/paginated_deposit.model";
import api from "@/utils/api.util";

class DepositApi {
  private static route: string = "/deposit";

  static async findMany(
    searchField?: string,
    status?: string,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedDeposit> {
    try {
      const response = await api.get<PaginatedDepositJson>(
        `${this.route}?search_fields=${searchField ?? ""}&status=${status}&page=${page ?? 1}&page_size=${pageSize ?? 20}`,
      );

      return PaginatedDeposit.fromJson(response);
    } catch (error) {
      console.error("Error fetching Deposits:", error);
      throw error;
    }
  }

  static async findUnique(depositId: string): Promise<Deposit> {
    try {
      const response = await api.get<DepositJson>(
        `${this.route}/${depositId}/`,
      );
      return Deposit.fromJson(response);
    } catch (error) {
      console.error(`Error fetching Deposit with ID ${depositId}:`, error);
      throw error;
    }
  }

  static async add(deposit: Deposit, appid: string): Promise<Deposit> {
    console.log("this is deposit ", deposit);
    try {
      const response = await api.post<DepositJson>(`${this.route}`, {
        amount: deposit.amount,
        bet_app_id: appid,
      });

      return Deposit.fromJson(response);
    } catch (error) {
      console.error("Error creating Deposit:", error);
      throw error;
    }
  }

  static async addXbet(deposit: Deposit): Promise<Deposit> {
    try {
      console.log(" ========>", deposit);
      const response = await api.post<DepositJson>("/add/cash/caisse", {
        amount: deposit.amount,
      });

      return Deposit.fromJson(response);
    } catch (error) {
      console.error("Error creating Deposit:", error);
      throw error;
    }
  }

  static async update(deposit: Deposit, bet_app_id: string): Promise<Deposit> {
    try {
      const response = await api.patch<DepositJson>(
        `${this.route}/${deposit.id}`,
        { amount: deposit.amount, bet_app_id: bet_app_id },
      );

      return Deposit.fromJson(response);
    } catch (error) {
      console.error(`Error updating Deposit with ID ${deposit.id}:`, error);
      throw error;
    }
  }

  static async remove(depositId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${depositId}`);
    } catch (error) {
      console.error(`Error deleting Deposit with ID ${depositId}:`, error);
      throw error;
    }
  }
}

export default DepositApi;
