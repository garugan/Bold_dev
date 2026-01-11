import { NavLink, Outlet } from 'react-router-dom'
import './MainLayout.css'

export function MainLayout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>納品伝票管理</h1>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/slips" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">📋</span>
            伝票管理
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">📦</span>
            商品管理
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <NavLink to="/login" className="nav-link logout">
            <span className="nav-icon">🚪</span>
            ログアウト
          </NavLink>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
