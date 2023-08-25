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

    let [loginModalIsOpen, setLoginIsOpen] = useState(false);
    let [registerModalIsOpen, setRegisterIsOpen] = useState(false);
    let isLoggedIn = useSelector((state: AppState) => state.isLoggedIn);

    useEffect(() => {
        // Check if user is logged in, and if so, close the login modal
        if (isLoggedIn) {
            setLoginIsOpen(false);
            setRegisterIsOpen(false);
        }
    }, [isLoggedIn]);

    function openLoginModal() {
        setLoginIsOpen(true);
    }

    function closeLoginModal() {
        setLoginIsOpen(false);
    }

    function openRegisterModal() {
        setRegisterIsOpen(true);
    }

    function closeRegisterModal() {
        setRegisterIsOpen(false);
    }

    function userLoggedOut() {
        isLoggedIn = false;
        dispatch({ type: ActionType.Login, payload: { isLoggedIn } });
    }

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
                <button className="HeaderButton" onClick={userLoggedOut}>Logout</button>
            )}

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
