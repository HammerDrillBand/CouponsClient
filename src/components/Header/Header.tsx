import { useEffect, useState } from "react";
import './Header.css';
import logo from "./logo.png";
import Login from "../Login/Login";
import Modal from 'react-modal';
import Register from "../Register/Register";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/app-state";
import { ActionType } from "../../redux/action-type";

function Header() {

    let dispatch = useDispatch();
    let isLoggedIn: boolean = useSelector((state: AppState) => state.isLoggedIn);

    let [loginModalIsOpen, setLoginIsOpen] = useState(false);
    let [registerModalIsOpen, setRegisterIsOpen] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            setLoginIsOpen(false);
            setRegisterIsOpen(false);
        }
    }, [isLoggedIn]);

    function openLoginModal() {
        setLoginIsOpen(true);
    };

    function closeLoginModal() {
        setLoginIsOpen(false);
    };

    function openRegisterModal() {
        setRegisterIsOpen(true);
    };

    function closeRegisterModal() {
        setRegisterIsOpen(false);
    };

    function userLoggedOut() {
        dispatch({ type: ActionType.Logout });
    };

    function seeUserPurchases() {

    };

    return (
        <div className="Header">
            <img className="Logo" src={logo} alt="TheMUSE logo" />
            <div className="HeaderContent">
                {isLoggedIn ? (
                    <div className="WelcomeContainer">
                        <div className="Welcome">Welcome, {localStorage.getItem('username')}</div>
                    </div>
                ) : (
                    <div className="ButtonContainer">
                        <button className="HeaderButton" onClick={openLoginModal}>Login</button>
                        <button className="HeaderButton" onClick={openRegisterModal}>Register</button>
                    </div>
                )}

            </div>
            {isLoggedIn && (
                <div className="ButtonContainer">
                    <button className="HeaderButton" onClick={userLoggedOut}>Logout</button>
                    <button className="HeaderButton" onClick={seeUserPurchases}>My Purchases</button>
                </div>)}

            <Modal className='HeaderModal' isOpen={loginModalIsOpen} onRequestClose={closeLoginModal}>
                <Login />
                <button onClick={closeLoginModal}>Cancel and return</button>
            </Modal>

            <Modal className='HeaderModal' isOpen={registerModalIsOpen} onRequestClose={closeRegisterModal}>
                <Register />
                <button onClick={closeRegisterModal}>Cancel and return</button>
            </Modal>
        </div>
    );
}

export default Header;
