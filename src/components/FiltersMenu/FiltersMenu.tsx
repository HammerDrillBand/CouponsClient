import { useDispatch, useSelector } from 'react-redux';
import './FiltersMenu.css'
import { AppState } from '../../redux/app-state';
import { useEffect, useState } from 'react';
import { ActionType } from '../../redux/action-type';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import jwt_decode from 'jwt-decode'

function FiltersMenu() {

    let dispatch = useDispatch();
    let categories = useSelector((state: AppState) => state.categories);
    let companies = useSelector((state: AppState) => state.companies);
    let maxCouponPrice = useSelector((state: AppState) => state.maxPrice);
    let isLoading = useSelector((state: AppState) => state.isLoading);

    let [minPrice, setMinPrice] = useState(0);
    let [maxPrice, setMaxPrice] = useState(0);
    let [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    let [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);

    let location = useLocation();
    let isCouponsRoute = location.pathname === '/';
    let isUserEditorRoute = location.pathname === '/users';

    useEffect(() => {
        if (maxCouponPrice > 0) {
            setMaxPrice(maxCouponPrice);
        }
        getUserType();
    }, [maxCouponPrice, companies]);

    if (categories.length === 0 || companies.length === 0 || maxCouponPrice === 0) {
        return <div>Loading...</div>;
    }

    function categorySelectionChanged(categoryId: number) {
        let updatedSelectedCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(option => option !== categoryId)
            : [...selectedCategories, categoryId];

        setSelectedCategories(updatedSelectedCategories);
        dispatch({ type: ActionType.FilterByCategoryIds, payload: { selectedCategories: updatedSelectedCategories } });
    }

    function companySelectionChanged(companyId: number) {
        let updatedSelectedCompanies = selectedCompanies.includes(companyId)
            ? selectedCompanies.filter(option => option !== companyId)
            : [...selectedCompanies, companyId];

        setSelectedCompanies(updatedSelectedCompanies);
        dispatch({ type: ActionType.FilterByCompanyIds, payload: { selectedCompanies: updatedSelectedCompanies } });
    }

    function minPriceChanged(newMinPrice: number) {
        setMinPrice(newMinPrice);
        dispatch({ type: ActionType.FilterByMinPrice, payload: { minPrice: newMinPrice } });
    }

    function maxPriceChanged(newMaxPrice: number) {
        setMaxPrice(newMaxPrice);
        dispatch({ type: ActionType.FilterByMaxPrice, payload: { maxPrice: newMaxPrice } });
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    function getUserType(): string | null {
        let storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            axios.defaults.headers.common['Authorization'] = storedToken;
            let decodedToken: any = jwt_decode(storedToken);
            let decodedTokenData = JSON.parse(decodedToken.sub);
            let userTypeFromToken = decodedTokenData.userType;
            return userTypeFromToken;
        }
        return null;
    }

    return (
        <div>
            {!isUserEditorRoute && (
                <>
                    <h2>Select Category</h2>
                    {categories.map(category => (
                        <div key={category.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={category.name}
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => categorySelectionChanged(category.id)}
                                />
                                {category.name}
                            </label>
                        </div>
                    ))}
                </>
            )}

            {getUserType() !== 'COMPANY' && (
                <>
                    <h2>Select Provider</h2>
                    {Array.isArray(companies) && companies.map(company => (
                        <div key={company.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={company.name}
                                    checked={selectedCompanies.includes(company.id)}
                                    onChange={() => companySelectionChanged(company.id)}
                                />
                                {company.name}
                            </label>
                        </div>
                    ))}
                </>
            )}

            {isCouponsRoute && (
                <div>
                    <h2>Select Price</h2>
                    <div className="range-slider-container">
                        <div className="slider">
                            <span>Min: {minPrice}</span>
                            <input
                                type="range"
                                min="0"
                                max={maxCouponPrice}
                                value={minPrice}
                                onChange={event => minPriceChanged(+event.target.value)}
                            />
                            <span>Max: {maxPrice}</span>
                            <input
                                type="range"
                                min="0"
                                max={maxCouponPrice}
                                value={maxPrice}
                                onChange={event => maxPriceChanged(+event.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FiltersMenu;

