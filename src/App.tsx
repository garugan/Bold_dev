import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { SlipListPage } from './pages/SlipListPage'
import { SlipDetailPage } from './pages/SlipDetailPage'
import { ProductListPage } from './pages/ProductListPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { UserListPage } from './pages/UserListPage'
import { UserDetailPage } from './pages/UserDetailPage'
import { CustomerListPage } from './pages/CustomerListPage'
import { CustomerDetailPage } from './pages/CustomerDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 認証画面 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* メインレイアウト配下のページ */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/slips" replace />} />

          {/* 伝票管理 */}
          <Route path="slips" element={<SlipListPage />} />
          <Route path="slips/:id" element={<SlipDetailPage />} />

          {/* 商品管理 */}
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />

          {/* 顧客管理 */}
          <Route path="customers" element={<CustomerListPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />

          {/* ユーザー管理 */}
          <Route path="users" element={<UserListPage />} />
          <Route path="users/:id" element={<UserDetailPage />} />
        </Route>

        {/* 未定義ルートはログインへリダイレクト */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
