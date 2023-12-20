import { ICategory } from "../models/ICategory";
import { ICompany } from "../models/ICompany";
import { ICoupon } from "../models/ICoupon";
import { IPurchase } from "../models/IPurchase";
import { IUser } from "../models/IUser";

export class AppState {
    public companies: ICompany[] = [];
    public categories: ICategory[] = [];
    public isLoggedIn: boolean = false;
    public FilteredByCategoryId: number[] = [];
    public FilteredByCompanyId: number[] = [];
    public FilteredByMinPrice: number = 0;
    public FilteredByMaxPrice: number = 0;
    public purchase: IPurchase = {
        id: -1,
        userId: -1,
        username: "",
        amount: -1,
        date: "",
        couponId: -1,
        couponName: "",
        couponDescription: "",
        categoryId: -1,
        categoryName: "",
        companyId: -1,
        companyName: ""
    };
    public isLoading: boolean = true;
    public editedCoupon: ICoupon = {
        id: -1,
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        amount: -1,
        price: -1,
        categoryId: -1,
        categoryName: "",
        companyId: -1,
        companyName: "",
        isAvailable: false,
        imageData: ""
    };
    public editedUser: IUser = {
        id: -1,
        username: "",
        password: "",
        userType: "",
        companyId: -1
    };
    public editedCompany: ICompany = {
        id: -1,
        name: "",
        companyType: "",
        registryNumber: -1,
        address: "",
        contactEmail: ""
    };
    public editedCategory: ICategory = {
        id: -1,
        name: ""
    };
    public searchText: string = "";
}