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
            break;
        case ActionType.Login:
            newAppState.isLoggedIn = action.payload.isLoggedIn;
            break;
        case ActionType.FilterByCompanyIds:
            newAppState.FilteredByCompanyId = action.payload.selectedCompanies;
            break;
        case ActionType.FilterByPrice:
            newAppState.FilteredByMinPrice = action.payload.MinPrice;
            newAppState.FilteredByMaxPrice = action.payload.MaxPrice;
            break;
        case ActionType.FilterByCategoryIds:
            newAppState.FilteredByCategoryId = action.payload.selectedCategories;
            break;
    }

    return newAppState;
}