import { NavLink, Outlet } from 'react-router-dom'
import { TbFileInvoice, TbPackage, TbLogout } from "react-icons/tb";
import './MainLayout.css'

export function MainLayout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="./images/logo.png" className="App-logo" alt="logo" />
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/slips" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <TbFileInvoice className="nav-icon" />
            伝票管理
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <TbPackage className="nav-icon" />
            商品管理
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <NavLink to="/login" className="nav-link logout">
            <TbLogout className="nav-icon" />
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
