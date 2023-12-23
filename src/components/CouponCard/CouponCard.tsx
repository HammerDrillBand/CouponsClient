import { useEffect, useState } from 'react';
import { ICoupon } from '../../models/ICoupon';
import './CouponCard.css'
import Modal from 'react-modal';
import { INewPurchase, IPurchase } from '../../models/IPurchase';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ActionType } from '../../redux/action-type';
import { AppState } from '../../redux/app-state';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'

function CouponCard(props: ICoupon) {

    let dispatch = useDispatch();
    let navigate = useNavigate();

    Modal.setAppElement('#root');
    let [availableAmount, setAvailableAmount] = useState(props.amount);
    let isLoggedIn: boolean = useSelector((state: AppState) => state.isLoggedIn);

    useEffect(() => {
        setAvailableAmount(props.amount);
        closeModal();
    }, [availableAmount]);

    let [modalIsOpen, setIsOpen] = useState(false);
    let [quantity, setQuantity] = useState(0);

    function openModal() {
        setIsOpen(true);
    };

    function closeModal() {
        setIsOpen(false);
    };

    async function onPurchaseClicked() {
        let newPurchase: INewPurchase = {
            couponId: props.id,
            amount: quantity,
        }
        try {
            await axios.post("http://localhost:8080/purchases", newPurchase)
                .then(async () => {
                    alert("Thank you for your purchase");
                    closeModal();
                    window.location.reload();
                })
                .catch(error => {
                    alert(error.response.data.errorMessage);
                })
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        }
    };

    function onEditClicked() {
        let editedCoupon: ICoupon = {
            id: props.id,
            name: props.name,
            description: props.description,
            startDate: props.startDate,
            endDate: props.endDate,
            amount: props.amount,
            price: props.price,
            categoryId: props.categoryId,
            categoryName: props.categoryName,
            companyId: props.companyId,
            companyName: props.companyName,
            isAvailable: props.isAvailable,
            imageData: props.imageData
        }

        dispatch({ type: ActionType.EditCoupon, payload: { editedCoupon } });
        navigate(`/coupon_editor?couponId=${editedCoupon.id}`);
    };

    let imageDataByte64: string = props.imageData;
    let imageDataUrl = `data:image/jpeg;base64,${imageDataByte64}`;

    let backgroundStyle = {
        backgroundImage: `url(${imageDataUrl})`,
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
        <div className={`CouponCard ${props.isAvailable ? '' : 'notAvailable'}`} style={backgroundStyle}>
            <div id='Name'><br />{props.name}</div>
            <div id='Price'>NIS {props.price}</div>
            <div id='Quantity'>Available amount: {availableAmount}</div>
            <button onClick={openModal} className='NeutralButton'>More</button>

            <Modal className='Modal' isOpen={modalIsOpen} onRequestClose={closeModal}>
                <div>{props.name}</div>
                <div>{props.description}</div>
                <div>Valid from: {props.startDate}</div>
                <div> to: {props.endDate}</div>
                <div>Category: {props.categoryName}</div>
                <div>Provided by: {props.companyName}</div>
                <div>Available amount: {availableAmount}</div>
                <div>NIS {props.price}</div>
                {getUserType() == "CUSTOMER" ? (
                    <>
                        <div>Choose Amount to Buy:</div>
                        <input type="number"
                            className='numberInput'
                            value={quantity}
                            step={1}
                            min={0}
                            max={props.amount}
                            onChange={event => setQuantity(+event.target.value)} />
                        <button
                            onClick={onPurchaseClicked}
                            disabled={!isLoggedIn || props.amount === 0 || quantity > availableAmount}
                            className={!isLoggedIn || quantity > availableAmount || quantity == 0 ? 'disabled-button' : 'BuyButton'}>
                            Buy now
                        </button>
                    </>
                ) : (
                    <>
                        {getUserType() == "ADMIN" || getUserType() == "COMPANY" ? (
                            <button onClick={onEditClicked} className='NeutralButton'>Edit</button>
                        ) : null}
                    </>
                )}
                <button onClick={closeModal} className='ReturnButton'>Cancel and return</button>
            </Modal>
        </div>
    );
}

export default CouponCard;

