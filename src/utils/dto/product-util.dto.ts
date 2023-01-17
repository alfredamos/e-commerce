import { Prisma } from "@prisma/client";
import { Category } from "./category-util.dto";

export class Product {
  name: string;
  price: Prisma.Decimal; 
  description: string;
  category?: Category;
}