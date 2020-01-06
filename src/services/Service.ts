import { Colony } from "Colony";

export interface Service {
  name: string;
  creeps: Creep[];
  colony: Colony;
}
