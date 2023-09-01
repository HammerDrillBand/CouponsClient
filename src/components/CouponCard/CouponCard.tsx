import { useEffect, useState } from 'react';
import { ICoupon } from '../../models/ICoupon';
import './CouponCard.css'
import Modal from 'react-modal';
import { IPurchase } from '../../models/IPurchase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { ActionType } from '../../redux/action-type';

function CouponCard(props: ICoupon) {

    let dispatch = useDispatch();

    Modal.setAppElement('#root');

    let [availableAmount, setAvailableAmount] = useState(props.amount);

    useEffect(() => {
        setAvailableAmount(props.amount);
        closeModal()
    }, [availableAmount]);

    let [modalIsOpen, setIsOpen] = useState(false);
    let [quantity, setQuantity] = useState(0);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    async function onPurchaseClicked() {
        let newPurchase: IPurchase = {
            couponId: props.id,
            amount: quantity
        }
        await axios.post("http://localhost:8080/purchases", newPurchase)
            .then(async () => {
                alert("Thank you for your purchase");
                closeModal();
                let responseCoupons = await axios.get("http://localhost:8080/coupons");
                let coupons: ICoupon[] = responseCoupons.data;
                dispatch({ type: ActionType.AddPurchase, payload: { coupons } });
            })
            .catch(error => {
                alert(error.response.data.errorMessage);
            })
    }

    return (
        <div className='CouponCard'>
            <span id='name'><br /><br /><br />{props.name}</span><br />
            <span id='price'>NIS {props.price}</span><br /><br />
            <span id='quantity'>Available amount: {availableAmount}</span><br /><br />
            <button onClick={openModal}>Get This</button>

            <Modal className='Modal' isOpen={modalIsOpen} onRequestClose={closeModal}>
                <span id='name'><br />{props.name}</span><br /><br />
                <span id='description'>{props.description}</span><br /><br />
                <span id='startDate'>Valid from: {props.startDate}</span>
                <span id='endDate'> to: {props.endDate}</span><br /><br />
                <span id='category'>Category: {props.categoryName}</span><br /><br />
                <span id='company'>Provided by: {props.companyName}</span><br /><br />
                <span id='quantity'>Available amount: {availableAmount}</span><br /><br />
                <span id='price'>NIS {props.price}</span><br /><br />
                <input type="number"
                    id="number"
                    value={quantity}
                    step={1}
                    min={0}
                    max={props.amount}
                    onChange={event => setQuantity(+event.target.value)} /><br />
                <button onClick={onPurchaseClicked}
                    disabled={quantity > availableAmount}
                    className={quantity > availableAmount ? 'disabled-button' : ''}>
                    Buy now
                </button><br />
                <button onClick={closeModal}>Cancel and return</button>
            </Modal>
        </div>
    );
}

export default CouponCard;

