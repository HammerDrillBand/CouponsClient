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
                <div className='ModalName'>{props.name}</div>
                <div className='ModalDescription'>{props.description}</div>
                <div className='LineItem'>
                    <div className='ModalLabel'>
                        Valid from:
                    </div>
                    <div className='ModalData'>
                        {props.startDate}
                    </div>
                </div>
                <div className='LineItem'>
                    <div className='ModalLabel'>
                        to:
                    </div>
                    <div className='ModalData'>
                        {props.endDate}
                    </div>
                </div>
                <div className='LineItem'>
                    <div className='ModalLabel'>
                        Category:
                    </div>
                    <div className='ModalData'>
                        {props.categoryName}
                    </div>
                </div>
                <div className='LineItem'>
                    <div className='ModalLabel'>
                        Provided by:
                    </div>
                    <div className='ModalData'>
                        {props.companyName}
                    </div>
                </div>
                <div className='LineItem'>
                    <div className='ModalLabel'>
                        Available amount:
                    </div>
                    <div className='ModalData'>
                        {availableAmount}
                    </div>
                </div>
                <div className='LineItem'>
                    <div className='ModalLabel'>
                        Unit Cost
                    </div>
                    <div className='ModalData'>
                        {props.price}
                    </div>
                </div>
                {getUserType() == "CUSTOMER" ? (
                    <div className='LineItem'>
                        <div className='ModalLabel'>Choose Amount to Buy:</div>
                        <input type="number"
                            className='numberInput'
                            value={quantity}
                            step={1}
                            min={0}
                            max={props.amount}
                            onChange={event => setQuantity(+event.target.value)} />
                        <button
                            onClick={onPurchaseClicked}
                            disabled={props.amount === 0 || quantity > availableAmount}
                            className={quantity > availableAmount || quantity == 0 ? 'DisabledModalButton' : 'BuyButton'}>
                            Buy now
                        </button>
                    </div>
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

