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
      // Build query parameters
    const params = new URLSearchParams();
    
    // Add search field if provided
    if (searchField) {
      params.append('search_fields', searchField);
    }

    // Add filter parameters if provided
    if (filter) {
      if (filter.reference) params.append('reference', filter.reference);
      if (filter.status) params.append('status', filter.status);
      if (filter.type) params.append('type', filter.type);
      if (filter.type_trans) params.append('type_trans', filter.type_trans);
      if (filter.countryCodeCode) params.append('country_code', filter.countryCodeCode);
      if (filter.phoneNumber) params.append('phone_number', filter.phoneNumber);
      if (filter.userAppId) params.append('user_app_id', filter.userAppId);
      if (filter.mobileReference) params.append('mobile_reference', filter.mobileReference);
      if (filter.network) params.append('network', filter.network);
      if (filter.withdriwalCode) params.append('withdriwal_code', filter.withdriwalCode);
      if (filter.userEmail) params.append('user__email', filter.userEmail);
      if (filter.app) params.append('app', filter.app);
      if (filter.service) params.append('service', filter.service);
      if (filter.start_date) params.append('start_date', filter.start_date);
      if (filter.end_date) params.append('end_date', filter.end_date);
    }

    // Add pagination
    params.append('page', (page ?? 1).toString());
    params.append('page_size', (pageSize ?? 20).toString());

      const response = await api.get<PaginatedTransactionJson<T>>(
        `${this.route}?${params.toString()}`
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
