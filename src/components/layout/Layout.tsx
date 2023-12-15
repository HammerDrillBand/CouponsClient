import './Layout.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import CouponsContainer from '../CouponsContainer/CouponsContainer';
import FiltersMenu from '../FiltersMenu/FiltersMenu';
import PurchasesList from '../PurchasesList/PurchasesList';
import CouponEditor from '../CouponEditor/CouponEditor';
import { useEffect } from 'react';
import UsersList from '../UsersList/UsersList';
import UserEditor from '../UserEditor/UserEditor';
import CompaniesList from '../CompaniesList/CompaniesList';
import CompanyEditor from '../CompanyEditor/CompanyEditor';
import CategoriesList from '../CategoriesList/CategoriesList';
import CategoryEditor from '../CategoryEditor/CategoryEditor';

function Layout() {
  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    navigate('/');
  }, []);

  function isFiltersMenuShown(): boolean{
    if(location.pathname.includes('_editor')){
      return false;
    }
    if(location.pathname === '/companies' || location.pathname === '/categories'){
      return false;
    }
    return true;
  }

  return (
    <section className="layout">
      <header>
        <Header />
      </header>

      <aside className="filters-menu">
        {isFiltersMenuShown() && <FiltersMenu />}
      </aside>

      <main className={!isFiltersMenuShown() ? 'main-full-width' : 'main'}>
        <div className="main-content">
          <Routes>
            <Route path='/' element={<CouponsContainer />} />
            <Route path="/coupon_editor" element={<CouponEditor />} />
            <Route path="/purchases" element={<PurchasesList />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/user_editor" element={<UserEditor />} />
            <Route path="/companies" element={<CompaniesList />} />
            <Route path="/company_editor" element={<CompanyEditor />} />
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/category_editor" element={<CategoryEditor />} />
          </Routes>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </section>
  );
}

export default Layout;
