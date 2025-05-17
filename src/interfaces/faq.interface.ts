export interface FaqJson {
  id: string;
  title: string;
  contents: string;
  last_message?: string; // champ optionnel
}

export interface FaqFormData {
  id?: string; // peut être absent à la création
  title: string;
  contents: string; // liste de paragraphes, comme dans Flutter
  last_message?: string;
}

export interface FaqFormErrors {
  title: string | null;
  contents: string | null; // tu peux valider chaque contenu individuellement si tu veux
  last_message?: string | null;
}
