import { Address } from "./Address";
import { Config } from "./Config";
import { OpeningTime } from "./openingTime";

export type Variant = {
  type: string;
  name: string;
  value: string;
};

export type Shop = {
  id: string;
  openingTimes: OpeningTime[];
  name: string;
  description: string;
  image: string;
  logo: string;
  address: Address;
  disabled: boolean;

  owner: string;
  type: string;
  Config: Config;

  variants: Variant[];

  messagingToken: string;
};
