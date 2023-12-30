import React, { useEffect, useState } from 'react';
import './UserEditor.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/app-state';
import { ICompany } from '../../models/ICompany';
import axios from 'axios';
import { ActionType } from '../../redux/action-type';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../../models/IUser';
import jwt_decode from 'jwt-decode'

function UserEditor() {

    let dispatch = useDispatch();
    let navigate = useNavigate();

    let user: IUser = useSelector((state: AppState) => state.editedUser);
    let companies: ICompany[] = useSelector((state: AppState) => state.companies);

    let userTypes = ["ADMIN", "COMPANY", "CUSTOMER"];

    let [isChangesMade, setIsChangesMade] = useState<boolean>(false);
    let [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

    useEffect(() => {
        dispatch({ type: ActionType.resetEditedUser })
        setIsLoading(false);
    }, []);

    let [formData, setFormData] = useState<IUser>({
        id: user.id,
        username: user.username,
        password: '',
        userType: user.userType,
        companyId: user.companyId
    });

    let [isLoading, setIsLoading] = useState(true);
    let isNewUser: boolean = formData.id == -1;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    function userInputChanged(event: any) {
        let { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setIsChangesMade(true);
    };

    async function onSaveChangesClicked() {
        let adaptedUser = {
            id: formData.id,
            username: formData.username,
            password: formData.password,
            ...(formData.userType == 'COMPANY' && { companyId: formData.companyId }),
            userType: formData.userType,
        };

        try {
            if (isNewUser) {
                await axios.post(`http://localhost:8080/users`, adaptedUser);
            } else {
                await axios.put(`http://localhost:8080/users`, adaptedUser);
            }

            if (isNewUser) {
                alert("User created successfully");
            } else {
                alert("User updated successfully");
            }
            navigate(`/users`);
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        }
    };

    async function onDeleteClicked() {
        try {
            await axios.delete(`http://localhost:8080/users/${formData.id}`);

            alert("User deleted successfully");
            navigate(`/users`);
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        };
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

    return (
        <div className='UserEditor'>
            {getUserType() == 'ADMIN' ? (
                <>
                    {!isNewUser && (
                        <div className='EditorLineItem'>
                            <label className='Label'>User #: {formData.id}</label>
                        </div>
                    )}
                    <div className='EditorLineItem'>
                        <label className='Label'>Username:</label>
                        <input
                            className='EditorInput'
                            type='text'
                            id='username'
                            name='username'
                            value={formData.username}
                            onChange={userInputChanged}
                        />
                    </div>
                    <div className='EditorLineItem'>

                        {(isChangingPassword || isNewUser) ?
                            <>
                                <label className='Label'>Password:</label>
                                <input
                                    className='EditorInput'
                                    type='password'
                                    id='password'
                                    name='password'
                                    value={formData.password}
                                    onChange={userInputChanged}
                                />
                            </>
                            :
                            <button
                            className='ChangePasswordButton'
                            onClick={() => setIsChangingPassword(true)}>
                                Change Password
                            </button>}
                    </div>
                    <div className='EditorLineItem'>
                        <label className='Label'>User Type:</label>
                        <select
                            className='EditorInput'
                            id='userType'
                            name='userType'
                            value={formData.userType}
                            onChange={userInputChanged}
                        >
                            <option value=''>Select User Type</option>
                            {userTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    {formData.userType == 'COMPANY' && (
                        <div className='EditorLineItem'>
                            <label className='Label'>Company:</label>
                            <select
                                className='EditorInput'
                                id='comapnyId'
                                name='companyId'
                                value={formData.companyId}
                                onChange={userInputChanged}
                            >
                                <option value=''>Select Company</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className='ButtonContainer'>
                        <button
                            className={`${isChangesMade ? 'SaveButton' : 'disabled-button'}`}
                            onClick={onSaveChangesClicked}
                            disabled={!isChangesMade}>
                            Save Changes
                        </button>
                        {!isNewUser && (
                            <button
                                className='DeleteButton'
                                onClick={onDeleteClicked}>
                                Delete This User
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div>Why are you even here?!</div>
            )}
        </div>
    );
}

export default UserEditor;
