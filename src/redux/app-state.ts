import { ICategory } from "../models/ICategory";
import { ICompany } from "../models/ICompany";
import { ICoupon } from "../models/ICoupon";

export class AppState {
    public companies: ICompany[] = [];
    public categories: ICategory[] = [];
    public coupons: ICoupon[] = [];
    public isLoggedIn: boolean = false;
    public FilteredByCompanyId: number[] = [];
    public FilteredByMinPrice: number = 0;
    public FilteredByMaxPrice: number = 999999;
    public FilteredByCategoryId: number[] = [];
}