import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from "react-redux";
// import { useNavigate } from 'react-router-dom';
import './Login.css';
import { ActionType } from '../../redux/action-type';

function Login() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let dispatch = useDispatch();
    // let navigate = useNavigate();

    async function onLoginClicked() {
        let loginDetails = { username, password }
        try {
            let response = await axios.post("http://localhost:8080/users/login", loginDetails);
            let serverResponse = response.data;
            let token = 'Bearer ' + serverResponse.token;
            axios.defaults.headers.common['Authorization'] = token;
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            let isLoggedIn: boolean = true;
            dispatch({type: ActionType.Login, payload: {isLoggedIn}});
            // navigate('/coupons');
        }
        catch (error: any) {
            alert(error.response.data.errorMessage);
        }
    }

    return (
        <div className="Login">
            <br />
            <br />
            <input type='email' placeholder='Enter your email' onChange={event => setUsername(event.target.value)} />
            <br />
            <input type='password' placeholder='Password' onChange={event => setPassword(event.target.value)} />
            <br />
            <button onClick={onLoginClicked}>Login</button>
            <br />
            <br />
        </div>
    );
}

export default Login;
