import { useEffect, useState } from "react";
import './Header.css';
import logo from "./logo.png";
import Login from "../Login/Login";
import Modal from 'react-modal';
import Register from "../Register/Register";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/app-state";
import { ActionType } from "../../redux/action-type";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from 'jwt-decode'

function Header() {

    let dispatch = useDispatch();
    let navigate = useNavigate();
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
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        dispatch({ type: ActionType.Logout });
        goToHome();
        window.location.reload();
    };

    function seeUserPurchases() {
        if (getUserType() == 'CUSTOMER') {
            navigate(`/purchases?userId=${getUserId()}`);
        } else if (getUserType() == 'COMPANY') {
            navigate(`/purchases?companyId=${getCompanyId()}`);
        } else {
            navigate(`/purchases`);
        }
    };

    function goToHome() {
        navigate('/')
    };

    function goToUsersList() {
        navigate('/users')
    };

    function goToCompaniesList() {
        navigate('/companies')
    };

    function goToCategoriesList() {
        navigate('/categories')
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
    };

    function getUserId(): number | null {
        let storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            axios.defaults.headers.common['Authorization'] = storedToken;
            let decodedToken: any = jwt_decode(storedToken);
            let decodedTokenData = JSON.parse(decodedToken.sub);
            let userIdFromToken = decodedTokenData.id;
            return userIdFromToken;
        }
        return null;
    };


    return (
        <div className="Header">
            <img className="Logo" src={logo} alt="TheMUSE logo" onClick={goToHome} />
            <div className="HeaderContent">
                {isLoggedIn ? (
                    <div className="WelcomeContainer">
                        <div className="Welcome">Welcome, {localStorage.getItem('username')}</div>
                    </div>
                ) : (
                    <div className="ButtonContainer">
                        <button className="HeaderButton" onClick={openRegisterModal}>Register</button>
                        <button className="HeaderButton" onClick={openLoginModal}>Login</button>
                    </div>
                )}
            </div>

            {isLoggedIn && (
                <div className="dropdown">
                    <button className="dropbtn">Menu</button>
                    <div className="dropdown-content">
                        <a href="#" onClick={goToHome}>Coupons</a>
                        {getUserType() == 'ADMIN' && (
                            <>
                                <a href="#" onClick={goToUsersList}>Users</a>
                                <a href="#" onClick={goToCompaniesList}>Companies</a>
                                <a href="#" onClick={goToCategoriesList}>Categories</a>
                            </>
                        )}
                        <a href="#" onClick={seeUserPurchases}>Purchases History</a>
                        <a href="#" onClick={userLoggedOut}>Logout</a>
                    </div>
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
