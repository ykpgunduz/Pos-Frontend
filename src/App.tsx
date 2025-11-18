import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import UserSelect from './components/UserSelect';
import ProtectedRoute from './components/ProtectedRoute';
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
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
            <Route path="/tables/:tableId" element={<ProtectedRoute><TableDetail /></ProtectedRoute>} />
            <Route path="/quick-sale" element={<ProtectedRoute><QuickSale /></ProtectedRoute>} />
            <Route path="/take-away" element={<ProtectedRoute><TakeAway /></ProtectedRoute>} />
            <Route path="/kitchen" element={<ProtectedRoute><Kitchen /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="/stock" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/payment/:orderId" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
