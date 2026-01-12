import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { TbFileInvoice, TbPackage, TbLogout, TbUsers, TbBuildingStore, TbChevronLeft, TbChevronRight } from "react-icons/tb";
import './MainLayout.css'

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="layout">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!collapsed && <img src="./images/logo.png" className="App-logo" alt="logo" />}
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <TbChevronRight /> : <TbChevronLeft />}
          </button>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/slips" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} title="伝票管理">
            <TbFileInvoice className="nav-icon" />
            <span className="nav-label">伝票管理</span>
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} title="商品管理">
            <TbPackage className="nav-icon" />
            <span className="nav-label">商品管理</span>
          </NavLink>
          <NavLink to="/customers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} title="顧客管理">
            <TbBuildingStore className="nav-icon" />
            <span className="nav-label">顧客管理</span>
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} title="ユーザー管理">
            <TbUsers className="nav-icon" />
            <span className="nav-label">ユーザー管理</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <NavLink to="/login" className="nav-link logout" title="ログアウト">
            <TbLogout className="nav-icon" />
            <span className="nav-label">ログアウト</span>
          </NavLink>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
