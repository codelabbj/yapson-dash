import { FaqJson } from "@/interfaces/faq.interface";

class Faq {
  id?: string;
  title: string;
  contents: string;
  lastMessage?: string;

  constructor(
    title: string,
    contents: string,
    lastMessage?: string,
    id?: string,
  ) {
    this.id = id;
    this.title = title;
    this.contents = contents;
    this.lastMessage = lastMessage;
  }

  static fromJson(json: FaqJson): Faq {
    return new Faq(json.title, json.contents, json.last_message, json.id);
  }

  toJson(): FaqJson {
    return {
      id: this.id!,
      title: this.title,
      contents: this.contents,
      last_message: this.lastMessage,
    };
  }
}

export default Faq;
