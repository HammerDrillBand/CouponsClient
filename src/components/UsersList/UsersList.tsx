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
    let [currentPage, setCurrentPage] = useState<number>(1);
    let [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        getUsers();
        setIsLoading(false);
    }, [selectedCompanyIds, currentPage]);

    async function getUsers() {
        let companyIds: number[] = await getCompanyIds();

        try {
            let responseUsers = await axios.get(`http://localhost:8080/users/byFilters?page=${currentPage}
            &companyIds=${companyIds}`);
            let { users, totalPages } = responseUsers.data;
            setUsers(users);
            setTotalPages(totalPages || 0);
            setCurrentPage((currentPage) => Math.max(1, Math.min(currentPage, totalPages)));
            navigate(`?page=${currentPage}`);
        } catch (error: any) {
            console.error("Error fetching users:", error);
            setIsLoading(false)
        }
    };

    async function getCompanyIds() {
        if (selectedCompanyIds.length == 0) {
            let responseCompanies = await axios.get('http://localhost:8080/companies');
            let companies: ICompany[] = responseCompanies.data;
            let companyIds: number[] = companies.map(company => company.id);
            return companyIds;
        }
        return selectedCompanyIds;
    };


    if (isLoading) {
        return <div>Loading...</div>;
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
            <button onClick={() => setCurrentPage((prevPage) => Math.max(1, prevPage - 1))}>Previous Page</button>
            {currentPage} of {totalPages}
            <button onClick={() => setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1))}>Next Page</button>

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
                    {users.length > 0 ? (
                        users.map((user) => (
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
