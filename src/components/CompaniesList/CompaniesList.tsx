import './CompaniesList.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/app-state';
import { ICompany } from '../../models/ICompany';
import { useNavigate } from 'react-router-dom';
import { ActionType } from '../../redux/action-type';
import axios from 'axios';

function CompaniesList() {

    let dispatch = useDispatch();
    let navigate = useNavigate();

    let searchText: string = useSelector<AppState, string>((state: AppState) => state.searchText);

    let [companies, setCompanies] = useState<ICompany[]>(useSelector<AppState, ICompany[]>((state: AppState) => state.companies))
    let [isLoading, setIsLoading] = useState<boolean>(true);
    let [currentPage, setCurrentPage] = useState<number>(1);
    let [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        getCompanies();
        setIsLoading(false);
    }, [currentPage, searchText]);

    if (isLoading) {
        return <div>Loading...</div>;
    };

    async function getCompanies() {
        try {
            let responseCompanies = await axios.get(`http://localhost:8080/companies/byFilters?page=${currentPage}
            &searchText=${searchText}`);

            let { companies, totalPages } = responseCompanies.data;

            setCompanies(companies);
            setTotalPages(totalPages || 0);
            setCurrentPage((currentPage) => Math.max(1, Math.min(currentPage, totalPages)));
            navigate(`?page=${currentPage}`);
        } catch (error: any) {
            console.error("Error fetching companies:", error);
            setIsLoading(false)
        }
    }

    function onEditClicked(id: number) {
        let editedCompany: ICompany | undefined = companies.find(company => company.id === id);
        dispatch({ type: ActionType.EditCompany, payload: { editedCompany } });
        navigate(`/company_editor?companyId=${id}`);
    };

    return (
        <div className="CompaniesList">
            <div className='Pages'>
                <button
                    onClick={() => setCurrentPage((prevPage) => Math.max(1, prevPage - 1))}
                    className={`${currentPage == 1 ? 'DisabledPageButton' : 'PageButton'}`}
                    disabled={currentPage == 1}>
                    ◄
                </button>
                Page {currentPage} of {totalPages}
                <button
                    onClick={() => setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1))}
                    className={`${currentPage == totalPages ? 'DisabledPageButton' : 'PageButton'}`}
                    disabled={currentPage == totalPages}>
                    ►
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Name</td>
                        <td>Company Type</td>
                        <td>Registry Number</td>
                        <td>Address</td>
                        <td>Contact Email</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {companies.length > 0 ? (
                        companies.map((company) => (
                            <tr key={company.id}>
                                <td>{company.id}</td>
                                <td>{company.name}</td>
                                <td>{company.companyType}</td>
                                <td>{company.registryNumber}</td>
                                <td>{company.address}</td>
                                <td>{company.contactEmail}</td>
                                <td><button
                                    className='EditButton'
                                    onClick={() => onEditClicked(company.id)}>
                                    Edit
                                </button></td>
                            </tr>
                        ))
                    ) : (
                        <p>No companies available</p>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default CompaniesList;
