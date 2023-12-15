import { IPurchase } from "./IPurchase";

export interface IPurchasePageResult {
    purchases: IPurchase[];
    totalPages: number;
}
