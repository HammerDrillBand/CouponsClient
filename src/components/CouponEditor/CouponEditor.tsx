import React, { useEffect, useState } from 'react';
import { ICoupon } from '../../models/ICoupon';
import './CouponEditor.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/app-state';
import { ICategory } from '../../models/ICategory';
import axios from 'axios';
import { ActionType } from '../../redux/action-type';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'

function CouponEditor() {

    let dispatch = useDispatch();
    let navigate = useNavigate();

    let coupon: ICoupon = useSelector((state: AppState) => state.editedCoupon);
    let categories: ICategory[] = useSelector((state: AppState) => state.categories);

    useEffect(() => {
        setIsLoading(false);
        formatDates();

        return () => {
            dispatch({ type: ActionType.resetEditedCoupon });
        };
    }, []);

    let [formData, setFormData] = useState<ICoupon>({
        id: coupon.id,
        name: coupon.name,
        description: coupon.description,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        amount: coupon.amount,
        price: coupon.price,
        categoryId: coupon.categoryId,
        categoryName: coupon.categoryName,
        companyId: coupon.companyId,
        companyName: coupon.categoryName,
        isAvailable: coupon.isAvailable,
        imageData: coupon.imageData
    });

    let [isLoading, setIsLoading] = useState(true);
    let isNewCoupon = formData.id != -1;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    let userInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    let userSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    let imageInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        let file = event.target.files && event.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = (event) => {
                let base64Image = event.target?.result as string;
                let newImagedata = base64Image.split(',')[1];
                setFormData({
                    ...formData,
                    imageData: newImagedata,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    function formatDates() {
        let formattedStartDate = formData.startDate.split('/').reverse().join('-');
        let formattedEndDate = formData.endDate.split('/').reverse().join('-');
        setFormData((prevData) => ({
            ...prevData,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
        }));
    }

    async function onSaveChangesClicked() {
        try {
            if (isNewCoupon) {
                await axios.post(`http://localhost:8080/coupons`, formData);
            } else {
                await axios.put(`http://localhost:8080/coupons`, formData);
            }
    
            let responseCoupons;
            if(getUserType() == 'COMPANY'){
                responseCoupons = await axios.get(`http://localhost:8080/coupons/byCompanyId?companyId=${getCompanyId()}`);
            } else {
                responseCoupons = await axios.get(`http://localhost:8080/coupons`);
            }
            let coupons: ICoupon[] = responseCoupons.data;
            dispatch({ type: ActionType.UpdateCoupons, payload: { coupons } });
            alert("Coupon updated successfully");
            navigate(`/`);
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        }
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
        <div className='CouponEditor'>
            {getUserType() != 'CUSTOMER' ? (
                <>
                    {!isNewCoupon && (
                        <div>
                            <label>Coupon #: {formData.id}</label>
                        </div>
                    )}
                    <div>
                        <label>Name:</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={formData.name}
                            onChange={userInputChanged}
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <input
                            type='text'
                            id='description'
                            name='description'
                            value={formData.description}
                            onChange={userInputChanged}
                        />
                    </div>
                    <div>
                        <label>Valid From:</label>
                        <input
                            type='date'
                            id='startDate'
                            name='startDate'
                            value={formData.startDate}
                            onChange={userInputChanged}
                        />
                    </div>
                    <div>
                        <label>Valid to:</label>
                        <input
                            type='date'
                            id='endDate'
                            name='endDate'
                            value={formData.endDate}
                            onChange={userInputChanged}
                        />
                    </div>
                    <div>
                        <label>Available Amount:</label>
                        <input
                            type='number'
                            id='amount'
                            name='amount'
                            value={coupon.amount < 0 ? 0 : formData.amount}
                            onChange={userInputChanged}
                        />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type='number'
                            id='price'
                            name='price'
                            value={coupon.price < 0 ? 0 : formData.price}
                            onChange={userInputChanged}
                        />
                    </div>
                    <div>
                        <label>Category:</label>
                        <select
                            id='category'
                            name='categoryId'
                            value={formData.categoryId}
                            onChange={userSelectionChanged}
                        >
                            <option value=''>Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Image:</label>
                        <input
                            type='file'
                            id='image'
                            name='image'
                            accept='image/jpeg'
                            onChange={imageInputChanged}
                        />
                        {formData.imageData && (
                            <img
                                src={`data:image/jpeg;base64,${formData.imageData}`}
                                alt='Coupon Image'
                                className='coupon-image'
                            />
                        )}
                    </div>
                    <button onClick={onSaveChangesClicked}>Save Changes</button>
                </>
            ) : (
                <div>Why are you even here?!</div>
            )}
        </div>
    );
}

export default CouponEditor;
