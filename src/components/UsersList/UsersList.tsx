import axios from 'axios';
import { IUser } from '../../models/IUser';
import './UsersList.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/app-state';
import { ICompany } from '../../models/ICompany';
import { useNavigate } from 'react-router-dom';
import { ActionType } from '../../redux/action-type';

function UsersList() {

    let dispatch = useDispatch();
    let navigate = useNavigate();

    let [users, setUsers] = useState<IUser[]>([]);
    let [isLoading, setIsLoading] = useState(true);
    let selectedCompanyIds: number[] = useSelector<AppState, number[]>((state: AppState) => state.FilteredByCompanyId);
    let companies: ICompany[] = useSelector<AppState, ICompany[]>((state: AppState) => state.companies);

    useEffect(() => {
        getUsers();
    }, [selectedCompanyIds]);

    async function getUsers() {
        let responseUsers;
        try {
            responseUsers = await axios.get(`http://localhost:8080/users`);
            setUsers(responseUsers.data);
            setIsLoading(false)
        } catch (error: any) {
            alert(error.response.data.errorMessage);
            console.error("Error fetching users:", error);
            setIsLoading(false)
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    };

    let filteredUsers: IUser[] = users;

    if (selectedCompanyIds.length > 0) {
        filteredUsers = filteredUsers.filter(user => selectedCompanyIds.includes(user.companyId));
    };

    function onEditClicked(id: number) {
        let editedUser: IUser | undefined = users.find(user => user.id === id);
        dispatch({ type: ActionType.EditUser, payload: { editedUser } });
        navigate(`/user_editor?userId=${id}`);
    };

    function getCompanyName(companyId: number): string {
        let company = companies.find(company => company.id === companyId);
        return company ? company.name : 'N/A';
    };

    return (
        <div className="UsersList">
            <table>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Username</td>
                        <td>User Type</td>
                        <td>Company</td>
                        <td>Edit</td>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.userType}</td>
                                <td>{getCompanyName(user.companyId)}</td>
                                <td><button onClick={() => onEditClicked(user.id)}>Edit</button></td>
                            </tr>
                        ))
                    ) : (
                        <p>No users available</p>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default UsersList;
