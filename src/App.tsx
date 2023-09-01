import { useEffect, useState } from 'react';
import './App.css';
import Layout from './components/layout/Layout';
import { ICompany } from './models/ICompany';
import { ICoupon } from './models/ICoupon';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { ActionType } from './redux/action-type';
import { ICategory } from './models/ICategory';

function App() {
  let dispatch = useDispatch();

  useEffect(() => {
    getInitialData();
  }, []);

  async function getInitialData() {
    let storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      axios.defaults.headers.common['Authorization'] = storedToken;
    };

    try {
      let responseCoupons = await axios.get("http://localhost:8080/coupons");
      let coupons: ICoupon[] = responseCoupons.data;

      let responseCategories = await axios.get("http://localhost:8080/categories");
      let categories: ICategory[] = responseCategories.data;

      let responseCompanies = await axios.get("http://localhost:8080/companies");
      let companies: ICompany[] = responseCompanies.data;

      let maxPrice = Math.max(...coupons.map(coupon => coupon.price));

      dispatch({ type: ActionType.PageLoaded, payload: { coupons, companies, categories, maxPrice } });
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  };

  return (
    <div className="App">
      <Layout />
    </div>
  );
}

export default App;
