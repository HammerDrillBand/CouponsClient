import { useDispatch, useSelector } from 'react-redux';
import './FiltersMenu.css'
import { AppState } from '../../redux/app-state';
import { useEffect, useState } from 'react';
import { ActionType } from '../../redux/action-type';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import { ICategory } from '../../models/ICategory';
import { ICompany } from '../../models/ICompany';

function FiltersMenu() {

    let dispatch = useDispatch();
    const navigate = useNavigate();
    let categories: ICategory[] = useSelector((state: AppState) => state.categories);
    let companies: ICompany[] = useSelector((state: AppState) => state.companies);
    let maxCouponPrice: number = useSelector((state: AppState) => state.maxPrice);
    let isLoading: boolean = useSelector((state: AppState) => state.isLoading);

    let [minPrice, setMinPrice] = useState<number>(0);
    let [maxPrice, setMaxPrice] = useState<number>(0);
    let [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    let [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);

    let location = useLocation();
    let isCouponsRoute: boolean = location.pathname === '/';
    // let isCouponEditorRoute: boolean = location.pathname === '/coupon_editor';
    let isUsersRoute: boolean = location.pathname === '/users';
    // let isUserEditorRoute: boolean = location.pathname === '/user_editor';
    let isCompaniesRoute: boolean = location.pathname === '/companies';
    // let isCompanyEditorRoute: boolean = location.pathname === '/comapny_editor';
    let isCategoriesRoute: boolean = location.pathname === '/categories';
    // let isCategoryEditorRoute: boolean = location.pathname === '/category_editor';


    useEffect(() => {
        if (maxCouponPrice > 0) {
            setMaxPrice(maxCouponPrice);
        }
        getUserType();
    }, [maxCouponPrice, companies]);

    if (categories.length === 0 || companies.length === 0 || maxCouponPrice === 0) {
        return <div>Loading...</div>;
    };

    function categorySelectionChanged(categoryId: number) {
        let updatedSelectedCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(option => option !== categoryId)
            : [...selectedCategories, categoryId];

        setSelectedCategories(updatedSelectedCategories);
        dispatch({ type: ActionType.FilterByCategoryIds, payload: { selectedCategories: updatedSelectedCategories } });
    };

    function companySelectionChanged(companyId: number) {
        let updatedSelectedCompanies = selectedCompanies.includes(companyId)
            ? selectedCompanies.filter(option => option !== companyId)
            : [...selectedCompanies, companyId];

        setSelectedCompanies(updatedSelectedCompanies);
        dispatch({ type: ActionType.FilterByCompanyIds, payload: { selectedCompanies: updatedSelectedCompanies } });
    };

    function minPriceChanged(newMinPrice: number) {
        setMinPrice(newMinPrice);
        dispatch({ type: ActionType.FilterByMinPrice, payload: { minPrice: newMinPrice } });
    };

    function maxPriceChanged(newMaxPrice: number) {
        setMaxPrice(newMaxPrice);
        dispatch({ type: ActionType.FilterByMaxPrice, payload: { maxPrice: newMaxPrice } });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    };

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
    };

    function goToCouponCreator() {
        dispatch({ type: ActionType.resetEditedCoupon });
        navigate('/coupon_editor');
    };

    function goToUserCreator() {
        dispatch({ type: ActionType.resetEditedUser });
        navigate('/user_editor');
    };

    function goToCompanyCreator() {
        dispatch({ type: ActionType.resetEditedCompany });
        navigate('/company_editor');
    };

    function goToCategoryCreator() {
        dispatch({ type: ActionType.resetEditedCategory });
        navigate('/category_editor');
    };

    return (
        <>
            {(getUserType() == "ADMIN" || getUserType() == "COMPANY") && (
                isCouponsRoute && (
                    <button onClick={goToCouponCreator}>Add New Coupon</button>
                )
            )}
            {(getUserType() == "ADMIN" || getUserType() == "COMPANY") && (
                isUsersRoute && (
                    <button onClick={goToUserCreator}>Add New User</button>
                )
            )}
            {(getUserType() == "ADMIN" || getUserType() == "COMPANY") && (
                isCompaniesRoute && (
                    <button onClick={goToCompanyCreator}>Add New Company</button>
                )
            )}
            {(getUserType() == "ADMIN" || getUserType() == "COMPANY") && (
                isCategoriesRoute && (
                    <button onClick={goToCategoryCreator}>Add New Category</button>
                )
            )}

            {/* {!isUserEditorRoute && (
                <> */}
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
                {/* </>
            )} */}

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
                <>
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
                </>
            )}
        </>
    );
};

export default FiltersMenu;

