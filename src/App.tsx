import { useEffect } from 'react';
import './App.css';
import Layout from './components/layout/Layout';
import { ICompany } from './models/ICompany';
import { ICoupon } from './models/ICoupon';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { ActionType } from './redux/action-type';
import { ICategory } from './models/ICategory';
import jwt_decode from 'jwt-decode'

function App() {
  let dispatch = useDispatch();
  let categories: ICategory[] | ICategory;
  let companies: ICompany[] | ICompany;
  // let coupons: ICoupon[];

  useEffect(() => {
    let storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      dispatch({ type: ActionType.Login });
    };
    getInitialData();
  }, []);

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
  }

  async function getInitialData() {

    try {
      let responseCategories = await axios.get('http://localhost:8080/categories');
      categories = responseCategories.data;

      if (getUserType() == 'COMPANY') {
        let responseCompanies = await axios.get(`http://localhost:8080/companies/${getCompanyId()}`);
        companies = responseCompanies.data;
      } else {
        let responseCompanies = await axios.get('http://localhost:8080/companies');
        companies = responseCompanies.data;
      }

      // let allCategoryIds: number[] = Array.isArray(categories) ? categories.map(category => category.id) : [categories.id];
      // let allCompanyIds: number[] = Array.isArray(companies) ? companies.map(company => company.id) : [companies.id];
      // let responseCoupons = await axios.get(`http://localhost:8080/coupons/byFilters?page=1&categoryIds=${[]}&companyIds=${[]}`);
      // coupons = responseCoupons?.data || [];

      let maxPrice = getMaxPrice();
      // let maxPrice = Math.max(...coupons.map(coupon => coupon.price));

      // dispatch({ type: ActionType.PageLoaded, payload: { coupons, companies, categories, maxPrice } });
      dispatch({ type: ActionType.PageLoaded, payload: { companies, categories, maxPrice } });
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  };

  async function getMaxPrice() {
      let responseMaxPrice = await axios.get('http://localhost:8080/coupons/maxPrice');
      let maxPrice: number = responseMaxPrice.data;
      dispatch({ type: ActionType.FilterByMaxPrice, payload: { maxPrice } });
      return maxPrice;
  };

  return (
    <div className="App">
      <Layout />
    </div>
  );
}

export default App;
