import './Layout.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Route, Routes } from 'react-router-dom';
import CouponsContainer from '../CouponsContainer/CouponsContainer';
import FiltersMenu from '../FiltersMenu/FiltersMenu';

function Layout() {
  return (
    <section className="layout">
      <header>
        <Header />
      </header>

      <aside>
        <FiltersMenu/>
      </aside>

      <main>
        <Routes>
          <Route path='/' element={<CouponsContainer />} />
        </Routes>
      </main>

      <footer>
        <Footer />
      </footer>
    </section>
  );
}

export default Layout;
