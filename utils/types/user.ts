import { Address } from "./Address";
import { Role } from "./Role";

export type User = {
  id: string;
  uid: string;
  firstName: string;
  phone: string;
  photo: string;
  lastName: string;
  email: string;
  adress: Address;
  role: Role;
};
