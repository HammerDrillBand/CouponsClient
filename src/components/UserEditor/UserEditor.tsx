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
    let UserTypes = ["ADMIN", "COMPANY", "CUSTOMER"];

    useEffect(() => {
        setIsLoading(false);
    }, [user, companies]);

    let [formData, setFormData] = useState<IUser>({
        id: user.id,
        username: user.username,
        password: '',
        userType: user.userType,
        companyId: user.companyId
    });

    let [isLoading, setIsLoading] = useState(true);
    let isNewUser: boolean = formData.id != -1;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    let userInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    let selectionChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // async function onSaveChangesClicked() {
    //     await axios.put(`http://localhost:8080/users`, formData)
    //         .then(async () => {
    //             let responseUsers = await axios.get(`http://localhost:8080/users`);
    //             let users: IUser[] = responseUsers.data;
    //             dispatch({ type: ActionType.UpdateUsers, payload: { users } });
    //             alert("user updated successfully");
    //             navigate(`/`)
    //         })
    //         .catch(error => {
    //             alert(error.response.data.errorMessage);
    //         })
    // };

    async function onSaveChangesClicked() {
        try {
            if (isNewUser) {
                await axios.post(`http://localhost:8080/users`, formData);
            } else {
                await axios.put(`http://localhost:8080/users`, formData);
            }
    
            let responseUsers = await axios.get(`http://localhost:8080/users`);
            let users: IUser[] = responseUsers.data;
            dispatch({ type: ActionType.UpdateUsers, payload: { users } });
            alert("User updated successfully");
            navigate(`/`);
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        }
    };


    function getCompanyNameById(companyId: number): string | undefined {
        let company = companies.find((company) => company.id === companyId);
        return company ? company.name : undefined;
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
    }

    return (
        <div className='UserEditor'>
            {getUserType() == 'ADMIN' ? (
                <>
                    <div>
                        <label>User #: {formData.id}</label>
                    </div>
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
                    {/* <div>
                        <label>Password:</label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            value={formData.password}
                            onChange={userInputChanged}
                        />
                    </div> */}
                    <div>
                        <label>User Type:</label>
                        <select
                            id='userType'
                            name='userType'
                            value={formData.userType}
                            onChange={selectionChanged}
                        >
                            {UserTypes.map((type, index) => (
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
                                {companies.map((company) => (
                                    <option key={company.id} value={company.name}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <button onClick={onSaveChangesClicked}>Save Changes</button>
                </>
            ) : (
                <div>Why are you even here?!</div>
            )}
        </div>
    );
}

export default UserEditor;
