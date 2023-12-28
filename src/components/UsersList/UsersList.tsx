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

    let selectedCompanyIds: number[] = useSelector<AppState, number[]>((state: AppState) => state.FilteredByCompanyId);
    let companies: ICompany[] = useSelector<AppState, ICompany[]>((state: AppState) => state.companies);
    let searchText: string = useSelector<AppState, string>((state: AppState) => state.searchText);

    let [currentPage, setCurrentPage] = useState<number>(1);
    let [totalPages, setTotalPages] = useState<number>(1);
    let [users, setUsers] = useState<IUser[]>([]);
    let [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getUsers();
        setIsLoading(false);
    }, [selectedCompanyIds, currentPage, searchText]);

    async function getUsers() {
        try {
            let responseUsers = await axios.get(`http://localhost:8080/users/byFilters?page=${currentPage}
            &companyIds=${selectedCompanyIds}
            &searchText=${searchText}`);

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
            <div className='Pages'>
                <button
                    onClick={() => setCurrentPage((prevPage) => Math.max(1, prevPage - 1))}
                    className='PageButton'>
                    ◄
                </button>
                Page {currentPage} of {totalPages}
                <button
                    onClick={() => setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1))}
                    className='PageButton'>
                    ►
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Username</td>
                        <td>User Type</td>
                        <td>Company</td>
                        <td></td>
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
                                <td><button
                                    className='EditButton'
                                    onClick={() => onEditClicked(user.id)}>
                                    Edit
                                </button></td>
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
