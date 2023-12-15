import { ICompany } from "./ICompany";

export interface ICompanyPageResult {
    companies: ICompany[];
    totalPages: number;
}
