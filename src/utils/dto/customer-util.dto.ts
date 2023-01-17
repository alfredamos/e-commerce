import { Gender } from "@prisma/client";

export class Customer {
  name: string;
  email: string;
  phone: string;
  gender: Gender;
}
