import { useEffect, useState } from 'react';
import './App.css';
import Layout from './components/layout/Layout';
import { ICompany } from './models/ICompany';
import { ICoupon } from './models/ICoupon';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { ActionType } from './redux/action-type';

function App() {

  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [categories, setCategories] = useState<ICoupon[]>([]);
  let dispatch = useDispatch();

  useEffect(() => {
    getInitialData();
  }, []);

  async function getInitialData() {
    try {
      let responseCoupons = await axios.get("http://localhost:8080/coupons");
      let coupons = responseCoupons.data;
      setCoupons(coupons);

      let responseCategories = await axios.get("http://localhost:8080/categories");
      let categories = responseCategories.data;
      setCategories(categories);

      let responseCompanies = await axios.get("http://localhost:8080/companies");
      let companies = responseCompanies.data;
      setCompanies(companies);

      dispatch({type: ActionType.PageLoaded, payload: {coupons, companies, categories}});
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
