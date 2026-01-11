import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { LoginPage } from './pages/LoginPage'
import { SlipListPage } from './pages/SlipListPage'
import { SlipDetailPage } from './pages/SlipDetailPage'
import { ProductListPage } from './pages/ProductListPage'
import { ProductDetailPage } from './pages/ProductDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ログイン画面 */}
        <Route path="/login" element={<LoginPage />} />

        {/* メインレイアウト配下のページ */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/slips" replace />} />

          {/* 伝票管理 */}
          <Route path="slips" element={<SlipListPage />} />
          <Route path="slips/:id" element={<SlipDetailPage />} />

          {/* 商品管理 */}
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
        </Route>

        {/* 未定義ルートはログインへリダイレクト */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
