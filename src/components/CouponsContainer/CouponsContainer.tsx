import './CouponsContainer.css'
import CouponCard from '../CouponCard/CouponCard';
import moment from 'moment';
import { AppState } from '../../redux/app-state';
import { useDispatch, useSelector } from 'react-redux';
import { ICoupon } from '../../models/ICoupon';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ICategory } from '../../models/ICategory';
import { ICompany } from '../../models/ICompany';
import { ActionType } from '../../redux/action-type';
import { ICouponPageResult } from '../../models/ICouponPageResult';
import { useNavigate } from 'react-router-dom';

function CouponsContainer() {
    // let dispatch = useDispatch();
    const navigate = useNavigate();

    // let coupons = useSelector<AppState, ICoupon[]>((state: AppState) => state.coupons);
    let selectedCategoryIds: number[] = useSelector<AppState, number[]>((state: AppState) => state.FilteredByCategoryId);
    let selectedCompanyIds: number[] = useSelector<AppState, number[]>((state: AppState) => state.FilteredByCompanyId);
    let selectedMinPrice: number = useSelector<AppState, number>((state: AppState) => state.FilteredByMinPrice);
    let selectedMaxPrice: number = useSelector<AppState, number>((state: AppState) => state.FilteredByMaxPrice);
    let [coupons, setCoupons] = useState<ICoupon[]>([]);
    let [currentPage, setCurrentPage] = useState<number>(1);
    let [totalPages, setTotalPages] = useState<number>(1);

    // let [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCoupons();
        // setIsLoading(false);
    }, [selectedCategoryIds, selectedCompanyIds, currentPage, selectedMinPrice, selectedMaxPrice]);
    // }, [coupons, selectedCategoryIds, selectedCompanyIds, selectedMinPrice, selectedMaxPrice, currentPage]);

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    async function getCoupons() {
        try {
            let categoryIds: number[] = await getCategoryIds();
            let companyIds: number[] = await getCompanyIds();
            let minPrice: number = await getMinPrice();
            let maxPrice: number = await getMaxPrice();

            if (minPrice > maxPrice) {
                let temp = minPrice;
                minPrice = maxPrice;
                maxPrice = temp;
            }

            let response = await axios.get(`http://localhost:8080/coupons/byFilters?page=${currentPage}
            &categoryIds=${categoryIds}
            &companyIds=${companyIds}
            &minPrice=${minPrice}
            &maxPrice=${maxPrice}`);

            let { coupons, totalPages }: ICouponPageResult = response.data;
            // let coupons: ICoupon[] = responseCoupons.coupons;
            setCoupons(coupons || []);
            setTotalPages(totalPages || 0);

            setCurrentPage((prevPage) => Math.max(1, Math.min(prevPage, totalPages)));
            navigate(`?page=${currentPage}`);

        } catch (error: any) {
            alert(error.response.data.errorMessage);
        }
    }

    // if (selectedCategoryIds.length > 0) {
    //     filteredCoupons = filteredCoupons.filter(coupon => selectedCategoryIds.includes(coupon.categoryId));
    // }

    // if (selectedCompanyIds.length > 0) {
    //     filteredCoupons = filteredCoupons.filter(coupon => selectedCompanyIds.includes(coupon.companyId));
    // }

    // filteredCoupons = filteredCoupons.filter(coupon => coupon.price >= selectedMinPrice && coupon.price <= selectedMaxPrice);

    async function getCategoryIds() {
        if (selectedCategoryIds.length == 0) {
            let responseCategories = await axios.get('http://localhost:8080/categories');
            let categories: ICategory[] = responseCategories.data;
            let categoryIds: number[] = categories.map(category => category.id);
            return categoryIds;
        }
        return selectedCategoryIds;
    };

    async function getCompanyIds() {
        if (selectedCompanyIds.length == 0) {
            let responseCompanies = await axios.get('http://localhost:8080/companies');
            let companies: ICompany[] = responseCompanies.data;
            let companyIds: number[] = companies.map(company => company.id);
            return companyIds;
        }
        return selectedCompanyIds;
    };

    async function getMinPrice() {
        if (selectedMinPrice == 0) {
            let responseMinPrice = await axios.get('http://localhost:8080/coupons/minPrice');
            let minPrice: number = responseMinPrice.data;
            return minPrice;
        }
        return selectedMinPrice;
    };

    async function getMaxPrice() {
        if (selectedMaxPrice == 0) {
            let responseMaxPrice = await axios.get('http://localhost:8080/coupons/maxPrice');
            let maxPrice: number = responseMaxPrice.data;
            return maxPrice;
        }
        return selectedMaxPrice;
    };

    function formatDate(date: string): string {
        let formattedDate = moment(date);
        let formattedDateString = formattedDate.format('DD/MM/YYYY');
        return formattedDateString
    };

    return (
        <div className="CouponsContainer">
            <button onClick={() => setCurrentPage((prevPage) => Math.max(1, prevPage - 1))}>Previous Page</button>
            {currentPage} of {totalPages}
            <button onClick={() => setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1))}>Next Page</button>

            <div>
                {coupons.length > 0 ? (
                    coupons
                        .map((coupon) =>
                            <CouponCard
                                key={coupon.id}
                                id={coupon.id}
                                name={coupon.name}
                                description={coupon.description}
                                startDate={formatDate(coupon.startDate)}
                                endDate={formatDate(coupon.endDate)}
                                amount={coupon.amount}
                                price={coupon.price}
                                categoryId={coupon.categoryId}
                                categoryName={coupon.categoryName}
                                companyId={coupon.companyId}
                                companyName={coupon.companyName}
                                isAvailable={coupon.isAvailable}
                                imageData={coupon.imageData} />
                        )
                ) : (
                    <p>No coupons available for your selection</p>
                )}
            </div>
        </div>
    );
}

export default CouponsContainer;
