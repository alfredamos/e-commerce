import { UserType } from "@prisma/client";

export class CustomerResponse{
    id!: string;
    name!: string;
    userType!: UserType;
    message?: string;
    token?: string;
}