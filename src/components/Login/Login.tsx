import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from "react-redux";
import './Login.css';
import { ActionType } from '../../redux/action-type';

function Login() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let dispatch = useDispatch();

    async function onLoginClicked() {
        let loginDetails = { username, password };
        try {
            let response = await axios.post("http://localhost:8080/users/login", loginDetails);
            let serverResponse = response.data;
            let token = 'Bearer ' + serverResponse;
            axios.defaults.headers.common['Authorization'] = token;
            localStorage.setItem('authToken', token);
            localStorage.setItem('username', username);

            dispatch({ type: ActionType.Login });
            window.location.reload();
        }
        catch (error: any) {
            alert(error.response.data.errorMessage);
        }
    }

    return (
        <div className="Login">
            <br />
            <br />
            <input className='Input' type='email' placeholder='Enter your email' onChange={event => setUsername(event.target.value)} />
            <br />
            <input className='Input' type='password' placeholder='Password' onChange={event => setPassword(event.target.value)} />
            <br />
            <button onClick={onLoginClicked} className='LoginButton'>Login</button>
            <br />
            <br />
        </div>
    );
}

export default Login;
