import { ICategory } from "../models/ICategory";
import { ICompany } from "../models/ICompany";
import { ICoupon } from "../models/ICoupon";
import { EmptyPurchase, IPurchase } from "../models/IPurchase";

export class AppState {
    public companies: ICompany[] = [];
    public categories: ICategory[] = [];
    public coupons: ICoupon[] = [];
    public isLoggedIn: boolean = false;
    public FilteredByCategoryId: number[] = [];
    public FilteredByCompanyId: number[] = [];
    public maxPrice: number = 0;
    public FilteredByMinPrice: number = 0;
    public FilteredByMaxPrice: number = 0;
    public purchase: IPurchase | EmptyPurchase = {};
}