import { Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import SearchItemsPage from './pages/SearchItemsPage';
import ReportItemPage from './pages/ReportItemPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ReviewItemPage from './pages/ReviewItemPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/search" element={<SearchItemsPage />} />
      <Route path="/report" element={<ReportItemPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/pending" element={<AdminDashboardPage />} />
      <Route path="/admin/approved" element={<AdminDashboardPage />} />
      <Route path="/admin/claimed" element={<AdminDashboardPage />} />
      <Route path="/admin/settings" element={<AdminSettingsPage />} />
      <Route path="/admin/review/:id" element={<ReviewItemPage />} />
      <Route path="/item/:id" element={<ItemDetailsPage />} />
    </Routes>
  );
}

export default App;
