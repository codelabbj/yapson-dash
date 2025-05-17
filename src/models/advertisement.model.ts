import { AdvertisementJson } from "@/interfaces/advertisement.interface";

class Advertisement {
  id?: string;
  content: string;
  image: string;
  enable: boolean;
  createdAt: Date;

  constructor(
    content: string,
    image: string,
    enable: boolean,
    createdAt: Date,
    id?: string,
  ) {
    this.content = content;
    this.image = image;
    this.enable = enable;
    this.createdAt = createdAt;
    this.id = id;
  }

  static fromJson(json: AdvertisementJson): Advertisement {
    return new Advertisement(
      json.content,
      json.image,
      json.enable,
      new Date(json.created_at),
      json.id,
    );
  }

  toJson(): AdvertisementJson {
    return {
      id: this.id,
      content: this.content,
      image: this.image,
      enable: this.enable,
      created_at:
        typeof this.createdAt === "string"
          ? this.createdAt
          : this.createdAt?.toISOString(),
    };
  }
}

export default Advertisement;
