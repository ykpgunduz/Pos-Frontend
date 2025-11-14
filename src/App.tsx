import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import UserSelect from './components/UserSelect';
import Login from './pages/Login';
import Home from './pages/Home';
import Tables from './pages/Tables';
import TableDetail from './pages/TableDetail';
import QuickSale from './pages/QuickSale';
import TakeAway from './pages/TakeAway';
import Kitchen from './pages/Kitchen';
import Products from './pages/Products';
import Stock from './pages/Stock';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Payment from './pages/Payment';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <UserSelect />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/tables/:tableId" element={<TableDetail />} />
            <Route path="/quick-sale" element={<QuickSale />} />
            <Route path="/take-away" element={<TakeAway />} />
            <Route path="/kitchen" element={<Kitchen />} />
            <Route path="/products" element={<Products />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment/:orderId" element={<Payment />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
