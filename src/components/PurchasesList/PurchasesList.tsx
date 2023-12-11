import axios from 'axios';
import { IPurchase } from '../../models/IPurchase';
import './PurchasesList.css'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/app-state';
import moment from 'moment';
import jwt_decode from 'jwt-decode'

function PurchasesList() {

    let [purchases, setPurchases] = useState<IPurchase[]>([]);
    let [isLoading, setIsLoading] = useState(true);
    let selectedCategoryIds: number[] = useSelector<AppState, number[]>((state: AppState) => state.FilteredByCategoryId);
    let selectedCompanyIds: number[] = useSelector<AppState, number[]>((state: AppState) => state.FilteredByCompanyId);

    useEffect(() => {
        getPurchases();
    }, [selectedCategoryIds, selectedCompanyIds]);

    async function getPurchases() {
        let responsePurchases;
        try {
            if (getUserType() == 'CUSTOMER') {
                responsePurchases = await axios.get(`http://localhost:8080/purchases/byUserId?userId=${getUserId()}`);
            } else if (getUserType() == 'COMPANY') {
                responsePurchases = await axios.get(`http://localhost:8080/purchases/byCompanyId?companyId=${getCompanyId()}`);
            } else {
                responsePurchases = await axios.get(`http://localhost:8080/purchases`);
            }
            setPurchases(responsePurchases.data);
            setIsLoading(false)
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

    function getUserType(): string | null{
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

    function getCompanyId(): number | null {
        let storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            axios.defaults.headers.common['Authorization'] = storedToken;
            let decodedToken: any = jwt_decode(storedToken);
            let decodedTokenData = JSON.parse(decodedToken.sub);
            let companyIdFromToken = decodedTokenData.companyId;
            return companyIdFromToken;
        }
        return null;
    };

    function getUserId(): number | null {
        let storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            axios.defaults.headers.common['Authorization'] = storedToken;
            let decodedToken: any = jwt_decode(storedToken);
            let decodedTokenData = JSON.parse(decodedToken.sub);
            let userIdFromToken = decodedTokenData.id;
            return userIdFromToken;
        }
        return null;
    };

    return (
        <div className="PurchasesList">
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
