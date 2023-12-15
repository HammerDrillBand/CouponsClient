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
    // let maxCouponPrice: number = useSelector((state: AppState) => state.maxPrice);
    let isLoading: boolean = useSelector((state: AppState) => state.isLoading);

    let [minPrice, setMinPrice] = useState<number>(0);
    let [maxPrice, setMaxPrice] = useState<number>(0);
    let [filteredMinPrice, setFilteredMinPrice] = useState<number>(0);
    let [filteredMaxPrice, setFilteredMaxPrice] = useState<number>(0);

    let [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    let [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);

    let location = useLocation();
    let isCouponsRoute: boolean = location.pathname === '/';
    let isUsersRoute: boolean = location.pathname === '/users';
    let isCompaniesRoute: boolean = location.pathname === '/companies';
    let isCategoriesRoute: boolean = location.pathname === '/categories';

    useEffect(() => {
        getUserType();
        getPrices();
    }, [maxPrice, companies]);

    if (categories.length === 0 || companies.length === 0) {
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

    async function getPrices() {
        try {
            let minPriceValue = await getMinPrice();
            let maxPriceValue = await getMaxPrice();

            setMinPrice(minPriceValue);
            setFilteredMinPrice(minPriceValue);
            setMaxPrice(maxPriceValue);
            setFilteredMaxPrice(maxPriceValue);

        } catch (error) {
            console.error('Error fetching min and max prices:', error);
        }
    };

    function minPriceChanged(newMinPrice: number) {
        setFilteredMinPrice(newMinPrice);
        dispatch({ type: ActionType.FilterByMinPrice, payload: { minPrice: newMinPrice } });
    };

    function maxPriceChanged(newMaxPrice: number) {
        setFilteredMaxPrice(newMaxPrice);
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

    async function getMinPrice() {
        let responseMinPrice = await axios.get('http://localhost:8080/coupons/minPrice');
        let minPrice: number = responseMinPrice.data;
        return minPrice;
    };

    async function getMaxPrice() {
        let responseMaxPrice = await axios.get('http://localhost:8080/coupons/maxPrice');
        let maxPrice: number = responseMaxPrice.data;
        return maxPrice;
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
        debugger;
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
                            <span>Current Lowest: {minPrice}</span>
                            <br />
                            <span>Current Highest: {maxPrice}</span>
                            <br />
                            <span>From: </span>
                            <input
                                type="number"
                                min={minPrice}
                                max={maxPrice}
                                value={filteredMinPrice}
                                onChange={event => minPriceChanged(+event.target.value)}
                            />
                            <br />
                            <span>To: </span>
                            <input
                                type="number"
                                min={minPrice}
                                max={maxPrice}
                                value={filteredMaxPrice}
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

