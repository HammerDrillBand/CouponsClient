import { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { useDispatch } from 'react-redux';
import { ActionType } from '../../redux/action-type';
import { INewUser } from '../../models/IUser';


function Register() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [passwordVerification, setPasswordVerification] = useState("");
    let dispatch = useDispatch();

    async function onRegisterClicked() {
        if (password === passwordVerification) {
            let userType: string = 'CUSTOMER'
            let newUserDetails: INewUser = { username, password, userType };
            try {
                await axios.post("http://localhost:8080/users", newUserDetails);
                let response = await axios.post("http://localhost:8080/users/login", { username, password });
                let serverResponse = response.data;
                let token = 'Bearer ' + serverResponse.token;
                axios.defaults.headers.common['Authorization'] = token;
                localStorage.setItem('authToken', token);
                localStorage.setItem('username', username);

                dispatch({ type: ActionType.Login });
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
            <input className='Input' type='email' placeholder='Enter your email' onChange={event => setUsername(event.target.value)} />
            <br />
            <input className='Input' type='password' placeholder='Enter new password' onChange={event => setPassword(event.target.value)} />
            <br />
            <input className='Input' type='password' placeholder='Confirm new password' onChange={event => setPasswordVerification(event.target.value)} />
            <br />
            <button onClick={onRegisterClicked} className='RegisterButton'>Register</button>
            <br />
            <br />
        </div>
    );
}

export default Register;
