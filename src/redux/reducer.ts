import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./action-type";

const appStateInitialValue = new AppState();

export function reduce(oldAppState: AppState = appStateInitialValue, action: Action): AppState {
    let newAppState = { ...oldAppState };

    switch (action.type) {
        case ActionType.Login:
            newAppState.isLoggedIn = true;
            break;
        case ActionType.Logout:
            newAppState.isLoggedIn = false;
            break;
        case ActionType.FilterByCategoryIds:
            newAppState.FilteredByCategoryId = action.payload.selectedCategories;
            break;
        case ActionType.FilterByCompanyIds:
            newAppState.FilteredByCompanyId = action.payload.selectedCompanies;
            break;
        case ActionType.FilterByMinPrice:
            newAppState.FilteredByMinPrice = action.payload.minPrice;
            break;
        case ActionType.FilterByMaxPrice:
            newAppState.FilteredByMaxPrice = action.payload.maxPrice;
            break;
        case ActionType.UpdateCompanies:
            newAppState.companies = action.payload.companies;
            break;
        case ActionType.UpdateCategories:
            newAppState.categories = action.payload.categories;
            break;
        case ActionType.EditCoupon:
            newAppState.editedCoupon = action.payload.editedCoupon;
            break;
        case ActionType.EditUser:
            newAppState.editedUser = action.payload.editedUser;
            break;
        case ActionType.EditCompany:
            newAppState.editedCompany = action.payload.editedCompany;
            break;
        case ActionType.EditCategory:
            newAppState.editedCategory = action.payload.editedCategory;
            break;
        case ActionType.resetEditedCoupon:
            newAppState.editedCoupon =
            {
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
            break;
        case ActionType.resetEditedUser:
            newAppState.editedUser = {
                id: -1,
                username: "",
                password: "",
                userType: "",
                companyId: -1
            };
            break;
        case ActionType.resetEditedCompany:
            newAppState.editedCompany = {
                id: -1,
                name: "",
                companyType: "",
                registryNumber: -1,
                address: "",
                contactEmail: ""
            };
            break;
        case ActionType.resetEditedCategory:
            newAppState.editedCategory = {
                id: -1,
                name: ""
            };
            break;
        case ActionType.filterByText:
            newAppState.searchText = action.payload.searchText;
            break;
        case ActionType.resetFilters:
            newAppState.isFiltersReset = true;
            newAppState.FilteredByCategoryId = [];
            newAppState.FilteredByCompanyId = [];
            newAppState.FilteredByMinPrice = 0;
            newAppState.FilteredByMaxPrice = 0;
            newAppState.searchText = "";
            newAppState.isFiltersReset = true;
            break;
        case ActionType.setIsFiltersReset:
            newAppState.isFiltersReset = false;
            break;
    }
    return newAppState;
}