import { Link } from 'react-router-dom'
import './PageStyles.css'

const mockProducts = [
  { id: 'PRD-001', name: 'ノートPC Dell XPS 15', category: 'PC', stock: 15, price: 25000 },
  { id: 'PRD-002', name: 'モニター 27インチ 4K', category: 'モニター', stock: 8, price: 45000 },
  { id: 'PRD-003', name: 'USBケーブル Type-C', category: 'ケーブル', stock: 150, price: 500 },
  { id: 'PRD-004', name: 'キーボード 無線', category: '周辺機器', stock: 32, price: 8000 },
  { id: 'PRD-005', name: 'マウスパッド', category: '周辺機器', stock: 45, price: 1500 },
  { id: 'PRD-006', name: 'Webカメラ HD', category: '周辺機器', stock: 0, price: 12000 },
]

export function ProductListPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">商品一覧</h2>
        <button className="btn btn-primary">+ 新規商品登録</button>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="商品コード、商品名で検索..." className="search-input" />
        <select className="filter-select">
          <option value="">すべてのカテゴリ</option>
          <option value="pc">PC</option>
          <option value="monitor">モニター</option>
          <option value="cable">ケーブル</option>
          <option value="peripheral">周辺機器</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>商品コード</th>
              <th>商品名</th>
              <th>カテゴリ</th>
              <th>在庫数</th>
              <th>単価</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((product) => (
              <tr key={product.id}>
                <td><Link to={`/products/${product.id}`} className="link">{product.id}</Link></td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>
                  <span className={product.stock === 0 ? 'stock-out' : product.stock < 10 ? 'stock-low' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td>¥{product.price.toLocaleString()}</td>
                <td>
                  <Link to={`/products/${product.id}`} className="btn btn-small">詳細</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
