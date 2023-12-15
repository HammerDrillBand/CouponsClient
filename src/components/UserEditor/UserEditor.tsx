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

    let userInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setIsChangesMade(true);
    };

    let selectionChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
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

    function getCompanyNameById(companyId: number): string | undefined {
        let company: ICompany | undefined = companies.find((company) => company.id === companyId);
        return company ? company.name : undefined;
    };

    return (
        <div className='UserEditor'>
            {getUserType() == 'ADMIN' ? (
                <>
                    {!isNewUser && (
                        <div>
                            <label>User #: {formData.id}</label>
                        </div>
                    )}
                    <div>
                        <label>Username:</label>
                        <input
                            type='text'
                            id='username'
                            name='username'
                            value={formData.username}
                            onChange={userInputChanged}
                        />
                    </div>
                    {(isChangingPassword || isNewUser) ?
                        <div>
                            <label>Password:</label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                value={formData.password}
                                onChange={userInputChanged}
                            />
                        </div>
                        :
                        <button onClick={() => setIsChangingPassword(true)}>
                            Change Password
                        </button>}
                    <div>
                        <label>User Type:</label>
                        <select
                            id='userType'
                            name='userType'
                            value={formData.userType}
                            onChange={selectionChanged}
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
                        <div>
                            <label>Company:</label>
                            <select
                                id='comapnyId'
                                name='companyId'
                                value={getCompanyNameById(formData.companyId)}
                                onChange={selectionChanged}
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
                    <button
                        onClick={onSaveChangesClicked}
                        disabled={!isChangesMade}>
                        Save Changes
                    </button>
                    {!isNewUser && (
                        <button onClick={onDeleteClicked}>
                            Delete This User
                        </button>
                    )}

                </>
            ) : (
                <div>Why are you even here?!</div>
            )}
        </div>
    );
}

export default UserEditor;
