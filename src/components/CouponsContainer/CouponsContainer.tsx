import './CouponsContainer.css'
import CouponCard from '../CouponCard/CouponCard';
import moment from 'moment';
import { AppState } from '../../redux/app-state';
import { useSelector } from 'react-redux';
import { ICoupon } from '../../models/ICoupon';

function CouponsContainer() {

    let coupons = useSelector<AppState, ICoupon[]>((state: AppState) => state.coupons);
    let selectedCategoryIds: number[] = useSelector<AppState, number[]>((state: AppState) => state.FilteredByCategoryId);

    let filteredCoupons: ICoupon[];

    if (selectedCategoryIds.length > 0) {
        filteredCoupons = coupons.filter(coupon => selectedCategoryIds.includes(coupon.categoryId));
    }
    else {
        filteredCoupons = coupons;
    }


    function formatDate(date: string): string {
        let formattedDate = moment(date);
        let formattedDateString = formattedDate.format('DD/MM/YYYY');
        return formattedDateString
    };

    return (
        <div className="CouponsContainer">

            <div>
                {filteredCoupons.map((coupon) =>
                    <CouponCard key={coupon.id} id={coupon.id} name={coupon.name} description={coupon.description} startDate={formatDate(coupon.startDate)} endDate={formatDate(coupon.endDate)} amount={coupon.amount} price={coupon.price} categoryId={coupon.categoryId} categoryName={coupon.categoryName} companyId={coupon.companyId} companyName={coupon.companyName} />
                )}
            </div>
        </div>
    );
}

export default CouponsContainer;
