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

    // let companies: ICompany[] = useSelector<AppState, ICompany[]>((state: AppState) => state.companies);
    let [companies, setCompanies] = useState<ICompany[]>(useSelector<AppState, ICompany[]>((state: AppState) => state.companies))
    let [isLoading, setIsLoading] = useState<boolean>(true);
    let [currentPage, setCurrentPage] = useState<number>(1);
    let [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        getCompanies();
        setIsLoading(false);
    }, [currentPage]);

    async function getCompanies() {
        try {
            let responseCompanies = await axios.get(`http://localhost:8080/companies/byPage?page=${currentPage}`);
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

    if (isLoading) {
        return <div>Loading...</div>;
    };

    function onEditClicked(id: number) {
        let editedCompany: ICompany | undefined = companies.find(company => company.id === id);
        dispatch({ type: ActionType.EditCompany, payload: { editedCompany } });
        navigate(`/company_editor?companyId=${id}`);
    };

    return (
        <div className="CompaniesList">
            <button onClick={() => setCurrentPage((prevPage) => Math.max(1, prevPage - 1))}>Previous Page</button>
            {currentPage} of {totalPages}
            <button onClick={() => setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1))}>Next Page</button>

            <table>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Name</td>
                        <td>Company Type</td>
                        <td>Registry Number</td>
                        <td>Address</td>
                        <td>Contact Email</td>
                        <td>Edit</td>
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
                                <td><button onClick={() => onEditClicked(company.id)}>Edit</button></td>
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
