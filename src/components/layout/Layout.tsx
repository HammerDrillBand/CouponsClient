import './Layout.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Route, Routes, useNavigate } from 'react-router-dom';
import CouponsContainer from '../CouponsContainer/CouponsContainer';
import FiltersMenu from '../FiltersMenu/FiltersMenu';
import PurchasesList from '../PurchasesList/PurchasesList';
import CouponEditor from '../CouponEditor/CouponEditor';
import { useEffect, useState } from 'react';
import UsersList from '../UsersList/UsersList';
import UserEditor from '../UserEditor/UserEditor';

function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (performance.navigation.type !== 1) return;

    navigate('/');
  }, []);

  let [showFiltersMenu, setShowFiltersMenu] = useState(true);

  let toggleFiltersMenu = () => {
    setShowFiltersMenu(!showFiltersMenu);
  };

  return (
    <section className="layout">
      <header>
        <Header />
      </header>

      <aside className="filters-menu-container">
        <div className={`filters-menu ${showFiltersMenu ? 'visible' : 'hidden'}`}>
          <FiltersMenu />
        </div>
        <button className="roll-button" onClick={toggleFiltersMenu}>
          {showFiltersMenu ? '⮜' : '⮞'}
        </button>
      </aside>

      <main className={showFiltersMenu ? 'main-with-filters' : 'main-full-width'}>
        <div className="main-content">
          <Routes>
            <Route path='/' element={<CouponsContainer />} />
            <Route path="/coupon_editor" element={<CouponEditor />} />
            <Route path="/purchases" element={<PurchasesList />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/user_editor" element={<UserEditor />} />
            <Route path="/companies" element={<UsersList />} />
            <Route path="/company_editor" element={<UserEditor />} />
            <Route path="/categories" element={<UsersList />} />
            <Route path="/category_editor" element={<UserEditor />} />
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
