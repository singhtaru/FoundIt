import { Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import SearchItemsPage from './pages/SearchItemsPage';
import ReportItemPage from './pages/ReportItemPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ReviewItemPage from './pages/ReviewItemPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import AdminItemsStatusPage from './pages/AdminItemsStatusPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import { isAdminUser } from './services/session';

function RequireAdmin({ children }) {
  return isAdminUser() ? children : <Navigate to="/auth" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/search" element={<SearchItemsPage />} />
      <Route path="/report" element={<ReportItemPage />} />
      <Route path="/items/:id" element={<ItemDetailsPage />} />
      <Route path="/admin" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
      <Route path="/admin/pending" element={<RequireAdmin><AdminItemsStatusPage type="pending" /></RequireAdmin>} />
      <Route path="/admin/approved" element={<RequireAdmin><AdminItemsStatusPage type="approved" /></RequireAdmin>} />
      <Route path="/admin/claimed" element={<RequireAdmin><AdminItemsStatusPage type="claimed" /></RequireAdmin>} />
      <Route path="/admin/settings" element={<RequireAdmin><AdminSettingsPage /></RequireAdmin>} />
      <Route path="/admin/review/:id" element={<RequireAdmin><ReviewItemPage /></RequireAdmin>} />
    </Routes>
  );
}

export default App;
