export interface IPurchase {
    id: number;
    userId: number;
    username: string;
    amount: number;
    date: string;
    couponId: number;
    couponName: string;
    couponDescription: string;
    categoryId: number;
    categoryName: string;
    companyId: number;
    companyName: string;
}

export interface EmptyPurchase { }

