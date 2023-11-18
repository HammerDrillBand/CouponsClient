import './CouponsContainer.css'
import CouponCard from '../CouponCard/CouponCard';
import moment from 'moment';
import { AppState } from '../../redux/app-state';
import { useSelector } from 'react-redux';
import { ICoupon } from '../../models/ICoupon';
import { useEffect, useState } from 'react';

function CouponsContainer() {

    let coupons = useSelector<AppState, ICoupon[]>((state: AppState) => state.coupons);
    let selectedCategoryIds: number[] = useSelector<AppState, number[]>((state: AppState) => state.FilteredByCategoryId);
    let selectedCompanyIds: number[] = useSelector<AppState, number[]>((state: AppState) => state.FilteredByCompanyId);
    let selectedMinPrice: number = useSelector<AppState, number>((state: AppState) => state.FilteredByMinPrice);
    let selectedMaxPrice: number = useSelector<AppState, number>((state: AppState) => state.FilteredByMaxPrice);

    let [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, [coupons, selectedCategoryIds, selectedCompanyIds, selectedMinPrice, selectedMaxPrice]);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    let filteredCoupons: ICoupon[] = coupons;

    if (selectedCategoryIds.length > 0) {
        filteredCoupons = filteredCoupons.filter(coupon => selectedCategoryIds.includes(coupon.categoryId));
    }

    if (selectedCompanyIds.length > 0) {
        filteredCoupons = filteredCoupons.filter(coupon => selectedCompanyIds.includes(coupon.companyId));
    }

    filteredCoupons = filteredCoupons.filter(coupon => coupon.price >= selectedMinPrice && coupon.price <= selectedMaxPrice);

    function formatDate(date: string): string {
        let formattedDate = moment(date);
        let formattedDateString = formattedDate.format('DD/MM/YYYY');
        return formattedDateString
    };

    return (
        <div className="CouponsContainer">
            <div>
                {filteredCoupons.length > 0 ? (
                    filteredCoupons
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
                            imageData={coupon.imageData}/>
                    )
                ) : (
                    <p>No coupons available for your selection</p>
                )}
            </div>
        </div>
    );
}

export default CouponsContainer;
