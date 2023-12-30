import { useEffect, useState } from "react";
import './Header.css';
import logo from "../../Images/logo.png";
import Login from "../Login/Login";
import Modal from 'react-modal';
import Register from "../Register/Register";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/app-state";
import { ActionType } from "../../redux/action-type";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from 'jwt-decode'

function Header() {

    let dispatch = useDispatch();
    let navigate = useNavigate();
    let isLoggedIn: boolean = useSelector((state: AppState) => state.isLoggedIn);
    let isFiltersReset: boolean = useSelector((state: AppState) => state.isFiltersReset);

    let [loginModalIsOpen, setLoginIsOpen] = useState<boolean>(false);
    let [registerModalIsOpen, setRegisterIsOpen] = useState<boolean>(false);
    let [searchText, setSearchText] = useState<string>("")

    let location = useLocation();
    let isCouponsRoute: boolean = location.pathname === '/';
    let isUsersRoute: boolean = location.pathname === '/users';
    let isCompaniesRoute: boolean = location.pathname === '/companies';
    let isCategoriesRoute: boolean = location.pathname === '/categories';
    let isPurchasesRoute: boolean = location.pathname === '/purchases';
    let isEditorRoute: boolean = location.pathname.includes('editor');

    useEffect(() => {
        setLoginStatus();
        resetFilters();
    }, [isLoggedIn, location.pathname, isFiltersReset]);

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
        resetFilters();
        if (getUserType() == 'CUSTOMER') {
            navigate(`/purchases?userId=${getUserId()}`);
        } else if (getUserType() == 'COMPANY') {
            navigate(`/purchases?companyId=${getCompanyId()}`);
        } else {
            navigate(`/purchases`);
        }
    };

    function goToHome() {
        resetFilters();
        window.location.reload();
    };

    function goToUsersList() {
        resetFilters();
        navigate('/users');
    };

    function goToCompaniesList() {
        resetFilters();
        navigate('/companies');
    };

    function goToCategoriesList() {
        resetFilters();
        navigate('/categories');
    };

    function goToCouponCreator() {
        dispatch({ type: ActionType.resetEditedCoupon });
        navigate('/coupon_editor');
    };

    function goToUserCreator() {
        dispatch({ type: ActionType.resetEditedUser });
        navigate('/user_editor');
    };

    function goToCompanyCreator() {
        dispatch({ type: ActionType.resetEditedCompany });
        navigate('/company_editor');
    };

    function goToCategoryCreator() {
        dispatch({ type: ActionType.resetEditedCategory });
        navigate('/category_editor');
    };

    function resetFilters() {
        setSearchText("");
        dispatch({ type: ActionType.resetFilters });
        dispatch({ type: ActionType.setIsFiltersReset });
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

    function searchTextChanged(searchText: string): void {
        dispatch({ type: ActionType.filterByText, payload: { searchText } });
        setSearchText(searchText);
    };

    function setLoginStatus() {
        let storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            dispatch({ type: ActionType.Login });
        };
        if (isLoggedIn) {
            setLoginIsOpen(false);
            setRegisterIsOpen(false);
        }
    };

    return (
        <div className="Header">
            <img className="Logo" src={logo} alt="TheMUSE logo" onClick={goToHome} />
            {isLoggedIn && (
                <div className="dropdown">
                    <button className="HeaderButton">Menu</button>
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
                        <a href="#" onClick={userLoggedOut} className="withBorder">Logout</a>
                    </div>
                </div>
            )}

            {(getUserType() === "ADMIN" || getUserType() === "COMPANY") && (
                <>
                    {isCouponsRoute && <button onClick={goToCouponCreator} className="AddButton">Add New Coupon</button>}
                    {isUsersRoute && <button onClick={goToUserCreator} className="AddButton">Add New User</button>}
                    {isCompaniesRoute && <button onClick={goToCompanyCreator} className="AddButton">Add New Company</button>}
                    {isCategoriesRoute && <button onClick={goToCategoryCreator} className="AddButton">Add New Category</button>}
                </>
            )}

            {(getUserType() == "CUSTOMER" || isEditorRoute || (getUserType()=="ADMIN" && isPurchasesRoute)) && (
                <div>
                    {/* Blank placeholder in place of button 2, to keep the 'hello' message in it's designated place*/}
                </div>
            )}

            {!isLoggedIn && (
                <>
                    <div>
                        <button className="HeaderButton" id="Register" onClick={openRegisterModal}>Register</button>
                    </div>
                    <div>
                        <button className="HeaderButton" id="Login" onClick={openLoginModal}>Login</button>
                    </div>
                </>
            )}

            <div>
                {isLoggedIn && (
                    <div>
                        <div className="Welcome">Hello, {localStorage.getItem('username')}</div>
                    </div>
                )}
            </div>

            <input
                className="SearchBar"
                type="text"
                value={searchText}
                onChange={(event) => searchTextChanged(event.target.value)}
                placeholder="Search"
            />

            <Modal className='HeaderModal' isOpen={loginModalIsOpen} onRequestClose={closeLoginModal}>
                <Login />
                <button onClick={closeLoginModal} className="ReturnButton">Cancel and return</button>
            </Modal>

            <Modal className='HeaderModal' isOpen={registerModalIsOpen} onRequestClose={closeRegisterModal}>
                <Register />
                <button onClick={closeRegisterModal} className="ReturnButton">Cancel and return</button>
            </Modal>
        </div>
    );
}

export default Header;
