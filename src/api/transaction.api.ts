import api from "@/utils/api.util";
import Transaction from "@/models/transaction.model";
import PaginatedTransaction, {
  DefaultSerializable,
  PaginatedTransactionJson,
} from "@/models/paginated_transaction.model";
import { TransactionJson } from "@/interfaces/transaction.interface";
import { TransactionFiterFormData } from "../interfaces/transaction.interface";

class TransactionApi {
  private static route: string = "/transaction";

  /**
   * "reference",
        "type_trans",
        "status",
        "phone_number",
        "user_app_id",
        "mobile_reference",
        "withdriwal_code",
        "user__email",

   */

  static async findMany<T extends DefaultSerializable = Transaction>(
    ctor: { new (...params: any[]): T; fromJson(json: any): T },
    searchField?: string,
    filter?: TransactionFiterFormData,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedTransaction<T>> {
    try {
      const response = await api.get<PaginatedTransactionJson<T>>(
        `${this.route}?search_fields=${searchField ?? ""}&reference=${filter?.reference ?? ""}&status=${filter?.status ?? ""}&phone_number=${filter?.phoneNumber ?? ""}&user_app_id=${filter?.userAppId ?? ""}&mobile_reference=${filter?.mobileReference ?? ""}&withdriwal_code=${filter?.withdriwalCode ?? ""}&user__email=${filter?.userEmail ?? ""}&app=${filter?.app ?? ""}&service=${filter?.service ?? ""}&page=${page ?? 1}&page_size=${pageSize ?? 20}`
      );

      return PaginatedTransaction.fromJson<T>(response, ctor);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  static async findUnique(transactionId: string): Promise<Transaction> {
    try {
      const response = await api.get<TransactionJson>(
        `${this.route}/${transactionId}`,
      );
      return Transaction.fromJson(response);
    } catch (error) {
      console.error(
        `Error fetching transaction with ID ${transactionId}:`,
        error,
      );
      throw error;
    }
  }

  static async findBizaoUnique(reference: string): Promise<any> {
    try {
      const response = await api.get<any>(
        `https://api.yapson.net/yapson/status?reference=${reference}`,
      );
      return response;
    } catch (error) {
      console.error(`Error fetching reference with ID ${reference}:`, error);
      throw error;
    }
  }

  static async add<T extends DefaultSerializable = Transaction>(
    transaction: T,
    ctor: { new (...params: any[]): T; fromJson(json: any): T },
  ): Promise<T> {
    try {
      const transactionJson = transaction.toJson();
      const response = await api.post<TransactionJson>(
        this.route,
        transactionJson,
      );
      return ctor.fromJson(response);
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  static async update<T extends DefaultSerializable = Transaction>(
    transaction: T,
    ctor: { new (...params: any[]): T; fromJson(json: any): T },
  ): Promise<T> {
    try {
      const transactionJson = transaction.toJson();
      const response = await api.put<TransactionJson>(
        `${this.route}/${(transaction as any).id}`,
        transactionJson,
      );

      return ctor.fromJson(response);
    } catch (error) {
      console.error(
        `Error updating transaction with ID ${(transaction as any).id}:`,
        error,
      );
      throw error;
    }
  }

  static async remove(transactionId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${transactionId}`);
    } catch (error) {
      console.error(
        `Error deleting transaction with ID ${transactionId}:`,
        error,
      );
      throw error;
    }
  }
}

export default TransactionApi;
