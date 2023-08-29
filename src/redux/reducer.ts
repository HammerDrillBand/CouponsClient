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
            break;
        case ActionType.Login:
            newAppState.isLoggedIn = action.payload.isLoggedIn;
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
    }

    return newAppState;
}