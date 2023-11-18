import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./action-type";

const appStateInitialValue = new AppState();

export function reduce(oldAppState: AppState = appStateInitialValue, action: Action): AppState {
    const newAppState = { ...oldAppState };

    switch (action.type) {
        case ActionType.PageLoaded:
            newAppState.coupons = action.payload.coupons;
            newAppState.companies = action.payload.companies;
            newAppState.categories = action.payload.categories;
            newAppState.maxPrice = action.payload.maxPrice;
            newAppState.FilteredByMaxPrice = action.payload.maxPrice;
            newAppState.isLoading = false;
            break;
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
        case ActionType.UpdateCoupons:
            newAppState.coupons = action.payload.coupons;
            break;
        case ActionType.UpdateUsers:
            newAppState.coupons = action.payload.users;
            break;
        case ActionType.EditCoupon:
            newAppState.editedCoupon = action.payload.editedCoupon;
            break;
        case ActionType.EditUser:
            newAppState.editedUser = action.payload.editedUser;
            break;
        case ActionType.resetEditedCoupon:
            return {
                ...oldAppState,
                editedCoupon: {
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
                },
            };
            break;
    }

    return newAppState;
}