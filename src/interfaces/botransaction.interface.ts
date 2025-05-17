export interface BotTransactionJson {
  id: number; // Identifiant de la transaction
  network_id: string; // ID du réseau
  network: string; // Nom du réseau
  bot_user: number; // ID de l'utilisateur du bot
  amount: string; // Montant de la transaction (en string)
  created_at: string; // Date et heure de création de la transaction
  plateforme: string; // Plateforme associée à la transaction
  type_transaction: "deposit" | "withdrawal"; // Type de transaction (dépôt ou retrait)
  phone: string; // Numéro de téléphone associé à la transaction
  reference: string; // Référence unique de la transaction
  transaction_link: string | null; // Lien vers la transaction (peut être null)
  status: "pending" | "completed" | "failed"; // Statut de la transaction
  user_app_id: string; // ID de l'utilisateur dans l'application
  withdriwal_code: string | null; // Code de retrait (peut être null)
  disbursements_reference: string | null; // Référence des paiements effectués (peut être null)
  disbursements: boolean; // Indique si des paiements ont été effectués
}
