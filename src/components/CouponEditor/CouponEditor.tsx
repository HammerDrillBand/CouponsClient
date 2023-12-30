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
import { ICompany } from '../../models/ICompany';

function CouponEditor() {

    let dispatch = useDispatch();
    let navigate = useNavigate();

    let coupon: ICoupon = useSelector((state: AppState) => state.editedCoupon);
    let categories: ICategory[] = useSelector((state: AppState) => state.categories);
    let companies: ICompany[] = useSelector((state: AppState) => state.companies);
    let [isChangesMade, setIsChangesMade] = useState<boolean>(false);

    useEffect(() => {
        formatDates();
        dispatch({ type: ActionType.resetEditedCoupon });
        setIsLoading(false);
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
        companyName: coupon.companyName,
        isAvailable: coupon.isAvailable,
        imageData: coupon.imageData
    });

    let [isLoading, setIsLoading] = useState(true);
    let isNewCoupon = formData.id == -1;

    if (isLoading) {
        return <div>Loading...</div>;
    };

    function inputChanged(event: any) {
        let { name, value, type } = event.target;

        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: ((event.target as HTMLInputElement).checked) == true ? true : false,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        };
        setIsChangesMade(true);
    };

    function imageInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
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
        setIsChangesMade(true);
    };

    function clearImageData() {
        setFormData({
            ...formData,
            imageData: ''
        });
        setIsChangesMade(true);
    };

    function formatDates() {
        let formattedStartDate = formData.startDate.split('/').reverse().join('-');
        let formattedEndDate = formData.endDate.split('/').reverse().join('-');
        setFormData((prevData) => ({
            ...prevData,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
        }));
    };

    async function onSaveChangesClicked() {
        let shortCoupon = {
            id: formData.id,
            name: formData.name,
            description: formData.description,
            startDate: formData.startDate,
            endDate: formData.endDate,
            price: formData.price,
            amount: formData.amount,
            categoryId: formData.categoryId,
            companyId: formData.companyId,
            isAvailable: formData.isAvailable,
            imageData: formData.imageData
        };
        try {
            if (isNewCoupon) {
                await axios.post(`http://localhost:8080/coupons`, shortCoupon);
            } else {
                await axios.put(`http://localhost:8080/coupons`, shortCoupon);
            }

            if (isNewCoupon) {
                alert("Coupon created successfully");
            } else {
                alert("Coupon updated successfully");
            }
            navigate(`/`);
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        };
    };

    async function onDeleteClicked() {
        try {
            await axios.delete(`http://localhost:8080/coupons/${formData.id}`);

            alert("Coupon deleted successfully");
            window.location.reload();
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        };
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

    return (
        <div className='CouponEditor'>
            {getUserType() != 'CUSTOMER' ? (
                <>
                    {!isNewCoupon && (
                        <div className='EditorLineItem'>
                            <label className='Label'>Coupon #: {formData.id}</label>
                        </div>
                    )}

                    {(isNewCoupon && getUserType() == 'ADMIN') && (
                        <div className='EditorLineItem'>
                            <label className='Label'>Company:</label>
                            <select
                                className='EditorInput'
                                id='comapnyId'
                                name='companyId'
                                value={formData.companyId}
                                onChange={inputChanged}
                            >
                                <option value=''>Select Company</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className='EditorLineItem'>
                        <label className='Label'>Name:</label>
                        <input
                            className='EditorInput'
                            type='text'
                            id='name'
                            name='name'
                            value={formData.name}
                            onChange={inputChanged}
                        />
                    </div>
                    <div className='EditorLineItem'>
                        <label className='Label'>Description:</label>
                        <input
                            className='DescriptionBox'
                            type='text'
                            id='description'
                            name='description'
                            value={formData.description}
                            onChange={inputChanged}
                        />
                    </div>
                    <div className='EditorLineItem'>
                        <label className='Label'>Valid From:</label>
                        <input
                            className='EditorInput'
                            type='date'
                            id='startDate'
                            name='startDate'
                            value={formData.startDate}
                            onChange={inputChanged}
                        />
                    </div>
                    <div className='EditorLineItem'>
                        <label className='Label'>Valid to:</label>
                        <input
                            className='EditorInput'
                            type='date'
                            id='endDate'
                            name='endDate'
                            value={formData.endDate}
                            onChange={inputChanged}
                        />
                    </div>
                    <div className='EditorLineItem'>
                        <label className='Label'>Available Amount:</label>
                        <input
                            className='EditorInput'
                            type='number'
                            id='amount'
                            name='amount'
                            value={formData.amount < 0 ? 0 : formData.amount}
                            onChange={inputChanged}
                        />
                    </div>
                    <div className='EditorLineItem'>
                        <label className='Label'>Price:</label>
                        <input
                            className='EditorInput'
                            type='number'
                            id='price'
                            name='price'
                            value={formData.price < 0 ? 0 : formData.price}
                            onChange={inputChanged}
                        />
                    </div>
                    <div className='EditorLineItem'>
                        <label className='Label'>Category:</label>
                        <select
                            className='EditorInput'
                            id='category'
                            name='categoryId'
                            value={formData.categoryId}
                            onChange={inputChanged}
                        >
                            <option value=''>Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='EditorLineItem'>
                        <label className='Label'>Image:</label>
                        <input
                            className='EditorInput'
                            type='file'
                            id='image'
                            name='image'
                            accept='image/jpeg'
                            onChange={imageInputChanged}
                        />
                        <button
                            onClick={clearImageData}
                            className={`${formData.imageData ? 'ClearButton' : 'disabled-button'}`}
                            disabled={!formData.imageData}
                        >
                            Clear Image
                        </button>
                    </div>
                    <div className='ImageBox'>
                        {formData.imageData && (
                            <img
                                src={`data:image/jpeg;base64,${formData.imageData}`}
                                alt='Coupon Image'
                                className='coupon-image'
                            />
                        )}
                    </div>
                    <div className='EditorLineItem'>
                        <label className='Label'>Currently available:</label>
                        <div className='checkbox'>
                            <input
                                type='checkbox'
                                id='isAvailable'
                                name='isAvailable'
                                checked={formData.isAvailable ? true : false}
                                onChange={inputChanged}
                            />
                        </div>
                    </div>
                    <div className='ButtonContainer'>
                        <button
                            className={`${isChangesMade ? 'SaveButton' : 'disabled-button'}`}
                            onClick={onSaveChangesClicked}
                            disabled={!isChangesMade}>
                            Save Changes
                        </button>
                        {!isNewCoupon && (
                            <button
                                className='DeleteButton'
                                onClick={onDeleteClicked}>
                                Delete This Coupon
                            </button>
                        )}
                    </div>

                </>
            ) : (
                <div>Why are you even here?!</div>
            )}
        </div>
    );
};

export default CouponEditor;
