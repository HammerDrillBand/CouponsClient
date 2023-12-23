import { useDispatch } from 'react-redux';
import './FiltersMenu.css'
import { useEffect, useState } from 'react';
import { ActionType } from '../../redux/action-type';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import { ICategory } from '../../models/ICategory';
import { ICompany } from '../../models/ICompany';

function FiltersMenu() {

    let dispatch = useDispatch();

    let [categories, setCategories] = useState<ICategory[]>()
    let [companies, setCompanies] = useState<ICompany[]>()
    let [minPrice, setMinPrice] = useState<number>(0);
    let [maxPrice, setMaxPrice] = useState<number>(0);
    let [filteredMinPrice, setFilteredMinPrice] = useState<number>(0);
    let [filteredMaxPrice, setFilteredMaxPrice] = useState<number>(0);
    let [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    let [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);

    let location = useLocation();
    let isCouponsRoute: boolean = location.pathname === '/';
    let isUsersRoute: boolean = location.pathname === '/users';

    useEffect(() => {
        getCategories();
        getCompanies();
        getUserType();
        getPrices();
        setFilteredMaxPrice(maxPrice);
        setFilteredMinPrice(minPrice);
        setSelectedCategories([]);
        setSelectedCompanies([]);
    }, [location.pathname]);

    async function getCategories() {
        try {
            let responseCategories = await axios.get('http://localhost:8080/categories');
            setCategories(responseCategories.data);
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        }
    };

    async function getCompanies() {
        try {
            let responseCompanies;
            if (getUserType() == 'COMPANY') {
                responseCompanies = await axios.get(`http://localhost:8080/companies/${getCompanyId()}`);
            } else {
                responseCompanies = await axios.get('http://localhost:8080/companies');
            }
            setCompanies(responseCompanies.data);
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        }
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

    function getCompanyId(): number | null {
        let storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            axios.defaults.headers.common['Authorization'] = storedToken;
            let decodedToken: any = jwt_decode(storedToken);
            let decodedTokenData = JSON.parse(decodedToken.sub);
            let companyIdFromToken = decodedTokenData.companyId;
            return companyIdFromToken;
        }
        return null;
    }

    function resetFilters() {
        dispatch({ type: ActionType.resetFilters });
        setSelectedCategories([]);
        setSelectedCompanies([]);
    };

    return (
        <div className='FiltersMenu'>
            {!isUsersRoute &&
                <div className='categories'>
                    <h2>Select Category</h2>
                    {Array.isArray(categories) && categories.map(category => (
                        <div key={category.id} className='checkbox'>
                            <label className='container'>
                                <input
                                    type="checkbox"
                                    value={category.name}
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => categorySelectionChanged(category.id)}
                                />
                                <div className="checkmark"></div>
                                {category.name}
                            </label>
                        </div>
                    ))}
                </div>
            }

            <div>
                {getUserType() !== 'COMPANY' && (
                    <div className='companies'>
                        <h2>Select Provider</h2>
                        {Array.isArray(companies) && companies.map(company => (
                            <div key={company.id} className='checkbox'>
                                <label className='container'>
                                    <input
                                        type="checkbox"
                                        value={company.name}
                                        checked={selectedCompanies.includes(company.id)}
                                        onChange={() => companySelectionChanged(company.id)}
                                    />
                                    <div className="checkmark"></div>
                                    {company.name}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isCouponsRoute && (
                <div className='prices'>
                    <h2>Select Price</h2>

                    <span>From: </span><br/>
                    <input
                        className='numberInput'
                        type="number"
                        min={minPrice}
                        max={maxPrice}
                        value={filteredMinPrice}
                        onChange={event => minPriceChanged(+event.target.value)}
                    />
                    <br />
                    <span>To: </span><br/>
                    <input
                        className='numberInput'
                        type="number"
                        min={minPrice}
                        max={maxPrice}
                        value={filteredMaxPrice}
                        onChange={event => maxPriceChanged(+event.target.value)}
                    />
                </div>
            )}
            <button onClick={resetFilters} className='resetButton'>Reset</button>
        </div>
    );
};

export default FiltersMenu;

