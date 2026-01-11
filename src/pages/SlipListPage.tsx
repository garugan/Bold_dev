import { Link } from 'react-router-dom'
import './PageStyles.css'

const mockSlips = [
  { id: 'SLP-001', date: '2024-01-15', customer: '株式会社ABC', status: '配送済', items: 3, total: 45000 },
  { id: 'SLP-002', date: '2024-01-15', customer: '有限会社XYZ', status: '配送中', items: 5, total: 78500 },
  { id: 'SLP-003', date: '2024-01-14', customer: '田中商店', status: '準備中', items: 2, total: 12000 },
  { id: 'SLP-004', date: '2024-01-14', customer: '鈴木工業', status: '配送済', items: 8, total: 156000 },
  { id: 'SLP-005', date: '2024-01-13', customer: '佐藤物産', status: '配送済', items: 1, total: 8500 },
]

export function SlipListPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">伝票一覧</h2>
        <button className="btn btn-primary">+ 新規伝票作成</button>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="伝票番号、顧客名で検索..." className="search-input" />
        <select className="filter-select">
          <option value="">すべてのステータス</option>
          <option value="preparing">準備中</option>
          <option value="shipping">配送中</option>
          <option value="delivered">配送済</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>伝票番号</th>
              <th>日付</th>
              <th>顧客名</th>
              <th>商品数</th>
              <th>合計金額</th>
              <th>ステータス</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {mockSlips.map((slip) => (
              <tr key={slip.id}>
                <td><Link to={`/slips/${slip.id}`} className="link">{slip.id}</Link></td>
                <td>{slip.date}</td>
                <td>{slip.customer}</td>
                <td>{slip.items}点</td>
                <td>¥{slip.total.toLocaleString()}</td>
                <td>
                  <span className={`status status-${slip.status === '配送済' ? 'done' : slip.status === '配送中' ? 'progress' : 'pending'}`}>
                    {slip.status}
                  </span>
                </td>
                <td>
                  <Link to={`/slips/${slip.id}`} className="btn btn-small">詳細</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
