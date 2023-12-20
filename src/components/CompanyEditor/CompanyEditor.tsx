import React, { useEffect, useState } from 'react';
import './CompanyEditor.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/app-state';
import { ICompany } from '../../models/ICompany';
import axios from 'axios';
import { ActionType } from '../../redux/action-type';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'

function CompanyEditor() {

    let dispatch = useDispatch();
    let navigate = useNavigate();

    let comapny: ICompany = useSelector((state: AppState) => state.editedCompany);
    let ComapnyTypes = ["PRIVATE_OWNERSHIP", "PARTNERSHIP", "CORPORATION", "LLC"];
    let [isChangesMade, setIsChangesMade] = useState<boolean>(false);

    useEffect(() => {
        dispatch({ type: ActionType.resetEditedCompany })
        setIsLoading(false);
    }, []);

    let [formData, setFormData] = useState<ICompany>({
        id: comapny.id,
        name: comapny.name,
        companyType: comapny.companyType,
        registryNumber: comapny.registryNumber,
        address: comapny.address,
        contactEmail: comapny.contactEmail
    });

    let [isLoading, setIsLoading] = useState(true);
    let isNewComapny: boolean = formData.id == -1;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    function inputChanged(event: any) {

        let { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setIsChangesMade(true);
    };

    async function onSaveChangesClicked() {
        try {
            if (isNewComapny) {
                await axios.post(`http://localhost:8080/companies`, formData);
            } else {
                await axios.put(`http://localhost:8080/companies`, formData);
            }

            updateCompaniesState();

            if (isNewComapny) {
                alert("Company created successfully");
            } else {
                alert("Company updated successfully");
            }
            navigate(`/companies`);
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        }
    };

    async function onDeleteClicked() {
        try {
            await axios.delete(`http://localhost:8080/companies/${formData.id}`);

            updateCompaniesState();

            alert("Company deleted successfully");
            navigate(`/companies`);
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        };
    };

    async function updateCompaniesState() {
        let responseCompanies = await axios.get(`http://localhost:8080/companies`);
        let companies: ICompany[] = responseCompanies.data;
        dispatch({ type: ActionType.UpdateCompanies, payload: { companies } });
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
        <div className='CompanyEditor'>
            {getUserType() == 'ADMIN' ? (
                <>
                    {!isNewComapny && (
                        <div>
                            <label>Company #: {formData.id}</label>
                        </div>
                    )}
                    <div>
                        <label>Name:</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={formData.name}
                            onChange={inputChanged}
                        />
                    </div>
                    <div>
                        <label>Company Type:</label>
                        <select
                            id='companyType'
                            name='companyType'
                            value={formData.companyType}
                            onChange={inputChanged}
                        >
                            <option value=''>Select Company Type</option>
                            {ComapnyTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Registry Number:</label>
                        <input
                            type='number'
                            id='registryNumber'
                            name='registryNumber'
                            value={formData.registryNumber < 0 ? 0 : formData.registryNumber}
                            onChange={inputChanged}
                        />
                    </div>
                    <div>
                        <label>Address:</label>
                        <input
                            type='text'
                            id='address'
                            name='address'
                            value={formData.address}
                            onChange={inputChanged}
                        />
                    </div>
                    <div>
                        <label>Contact Email:</label>
                        <input
                            type='text'
                            id='contactEmail'
                            name='contactEmail'
                            value={formData.contactEmail}
                            onChange={inputChanged}
                        />
                    </div>


                    <button
                        onClick={onSaveChangesClicked}
                        disabled={!isChangesMade}>
                        Save Changes
                    </button>
                    {!isNewComapny && (
                        <button onClick={onDeleteClicked}>
                            Delete This Company
                        </button>
                    )}

                </>
            ) : (
                <div>Why are you even here?!</div>
            )}
        </div>
    );
}

export default CompanyEditor;
