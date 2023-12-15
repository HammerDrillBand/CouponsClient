import axios from 'axios';
import { IPurchase } from '../../models/IPurchase';
import './PurchasesList.css'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/app-state';
import moment from 'moment';
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom';

function PurchasesList() {

    let navigate = useNavigate();
    let [purchases, setPurchases] = useState<IPurchase[]>([]);
    let [isLoading, setIsLoading] = useState(true);
    let selectedCategoryIds: number[] = useSelector<AppState, number[]>((state: AppState) => state.FilteredByCategoryId);
    let selectedCompanyIds: number[] = useSelector<AppState, number[]>((state: AppState) => state.FilteredByCompanyId);
    let [currentPage, setCurrentPage] = useState<number>(1);
    let [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        getPurchases();
        setIsLoading(false);
    }, [selectedCategoryIds, selectedCompanyIds, currentPage]);

    async function getPurchases() {
        let responsePurchases;
        let userType: string | null = getUserType();
        try {
            if (userType == 'CUSTOMER') {
                responsePurchases = await axios.get(`http://localhost:8080/purchases/byUserId?page=${currentPage}`);
            } else if (userType == 'COMPANY') {
                responsePurchases = await axios.get(`http://localhost:8080/purchases/byCompanyId?page=${currentPage}`);
            } else {
                responsePurchases = await axios.get(`http://localhost:8080/purchases/byPage?page=${currentPage}`);
            }

            let { purchases, totalPages } = responsePurchases.data;

            setPurchases(purchases);
            setTotalPages(totalPages || 0);
            setCurrentPage((currentPage) => Math.max(1, Math.min(currentPage, totalPages)));
            navigate(`?page=${currentPage}`);
        } catch (error: any) {
            console.error("Error fetching purchases:", error);
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    let filteredPurchases: IPurchase[] = purchases;

    if (selectedCategoryIds.length > 0) {
        filteredPurchases = filteredPurchases.filter(purchase => selectedCategoryIds.includes(purchase.categoryId));
    }

    if (selectedCompanyIds.length > 0) {
        filteredPurchases = filteredPurchases.filter(purchase => selectedCompanyIds.includes(purchase.companyId));
    }

    function formatDate(date: string): string {
        let formattedDate = moment(date);
        let formattedDateString = formattedDate.format('DD/MM/YYYY');
        return formattedDateString
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
        <div className="PurchasesList">
            <button onClick={() => setCurrentPage((prevPage) => Math.max(1, prevPage - 1))}>Previous Page</button>
            {currentPage} of {totalPages}
            <button onClick={() => setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1))}>Next Page</button>

            <table>
                <thead>
                    <tr>
                        <td>Title</td>
                        <td>Detailed Description</td>
                        <td>Category</td>
                        <td>Date of Purchase</td>
                        <td>Amount</td>
                        {getUserType() !== 'COMPANY' &&
                            <td>Provided By</td>
                        }
                        {getUserType() !== 'CUSTOMER' &&
                            <>
                                <td>Procured By (email)</td>
                                <td>Procured By (ID)</td>
                            </>
                        }
                    </tr>
                </thead>
                <tbody>
                    {filteredPurchases.length > 0 ? (
                        filteredPurchases.map((purchase) => (
                            <tr key={purchase.id}>
                                <td>{purchase.couponName}</td>
                                <td>{purchase.couponDescription}</td>
                                <td>{purchase.categoryName}</td>
                                <td>{formatDate(purchase.date)}</td>
                                <td>{purchase.amount}</td>
                                {getUserType() !== 'COMPANY' &&
                                    <td>{purchase.companyName}</td>
                                }
                                {getUserType() !== 'CUSTOMER' &&
                                    <>
                                        <td>{purchase.username}</td>
                                        <td>{purchase.userId}</td>
                                    </>
                                }
                            </tr>
                        ))
                    ) : (
                        <p>No purchases available</p>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default PurchasesList;
