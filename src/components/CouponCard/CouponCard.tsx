import { useState } from 'react';
import { ICoupon } from '../../models/ICoupon';
import './CouponCard.css'
import Modal from 'react-modal';

function CouponCard(props: ICoupon) {

    Modal.setAppElement('#root');

    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div className='CouponCard'>
            <span id='name'><br /><br /><br />{props.name}</span><br />
            <span id='price'>NIS {props.price}</span><br /><br />
            <span id='quantity'>Available amount: {props.amount}</span><br /><br />
            <button onClick={openModal}>Get This</button>

            <Modal className='Modal' isOpen={modalIsOpen} onRequestClose={closeModal}>
                <span id='name'><br />{props.name}</span><br /><br />
                <span id='description'>{props.description}</span><br /><br />
                <span id='startDate'>Valid from: {props.startDate}</span>
                <span id='endDate'> to: {props.endDate}</span><br /><br />
                <span id='category'>Category: {props.categoryName}</span><br /><br />
                <span id='company'>Provided by: {props.companyName}</span><br /><br />
                <span id='quantity'>Available amount: {props.amount}</span><br /><br />
                <span id='price'>NIS {props.price}</span><br /><br />
                <button onClick={closeModal}>Cancel and return</button>
            </Modal>
        </div>
    );
}

export default CouponCard;
