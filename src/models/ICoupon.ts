export interface ICoupon {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    amount: number;
    price: number;
    categoryId: number;
    categoryName: string;
    companyId: number;
    companyName: string;
    isAvailable: boolean;
    imageData: string;
}