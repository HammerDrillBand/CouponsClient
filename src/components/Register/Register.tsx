import { useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import './Register.css';
import { useDispatch } from 'react-redux';
import { ActionType } from '../../redux/action-type';
import Login from '../Login/Login';
import { IUser } from '../../models/IUser';

function Register() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [passwordVerification, setPasswordVerification] = useState("");
    let dispatch = useDispatch();

    async function onRegisterClicked() {
        if (password === passwordVerification) {
            let userType: string = 'CUSTOMER'
            let newUserDetails: IUser = { username, password, userType };
            try {
                let newUserId = await axios.post("http://localhost:8080/users", newUserDetails);
                let response = await axios.post("http://localhost:8080/users/login", { username, password });
                let serverResponse = response.data;
                let token = 'Bearer ' + serverResponse.token;
                axios.defaults.headers.common['Authorization'] = token;
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                let isLoggedIn: boolean = true;
                dispatch({ type: ActionType.Login, payload: { isLoggedIn } });
            }
            catch (error: any) {
                alert(error.response.data.errorMessage);
            }
        } else {
            alert('The passwords entered are not identical')
        }

    }

    return (
        <div className="Register">
            <br />
            <input type='email' placeholder='Enter your email' onChange={event => setUsername(event.target.value)} />
            <br />
            <input type='password' placeholder='Enter new password' onChange={event => setPassword(event.target.value)} />
            <br />
            <input type='password' placeholder='Confirm new password' onChange={event => setPasswordVerification(event.target.value)} />
            <br />
            <button onClick={onRegisterClicked}>Register</button>
            <br />
            <br />
        </div>
    );
}

export default Register;
