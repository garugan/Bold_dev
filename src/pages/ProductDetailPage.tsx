import { useParams, Link } from 'react-router-dom'
import './PageStyles.css'

const mockProductDetail = {
  id: 'PRD-001',
  name: 'ノートPC Dell XPS 15',
  category: 'PC',
  stock: 15,
  price: 25000,
  description: '15.6インチ FHD ディスプレイ、Intel Core i7、16GB RAM、512GB SSD搭載の高性能ノートPC。ビジネス用途に最適。',
  supplier: 'Dell Japan株式会社',
  lastUpdated: '2024-01-10',
  recentSlips: [
    { id: 'SLP-001', date: '2024-01-15', customer: '株式会社ABC', quantity: 1 },
    { id: 'SLP-008', date: '2024-01-12', customer: '山田電機', quantity: 3 },
    { id: 'SLP-012', date: '2024-01-08', customer: 'テック商事', quantity: 2 },
  ],
}

export function ProductDetailPage() {
  const { id } = useParams()

  return (
    <div className="page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/products" className="link">商品一覧</Link>
          <span> / </span>
          <span>{id}</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">編集</button>
          <button className="btn btn-danger">削除</button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3 className="card-title">商品情報</h3>
          <dl className="detail-list">
            <dt>商品コード</dt>
            <dd>{mockProductDetail.id}</dd>
            <dt>商品名</dt>
            <dd>{mockProductDetail.name}</dd>
            <dt>カテゴリ</dt>
            <dd>{mockProductDetail.category}</dd>
            <dt>仕入先</dt>
            <dd>{mockProductDetail.supplier}</dd>
            <dt>最終更新</dt>
            <dd>{mockProductDetail.lastUpdated}</dd>
          </dl>
        </div>

        <div className="detail-card">
          <h3 className="card-title">在庫・価格</h3>
          <dl className="detail-list">
            <dt>現在在庫</dt>
            <dd className="large-number">{mockProductDetail.stock} 個</dd>
            <dt>単価</dt>
            <dd className="large-number">¥{mockProductDetail.price.toLocaleString()}</dd>
          </dl>
        </div>
      </div>

      <div className="detail-card full-width">
        <h3 className="card-title">商品説明</h3>
        <p className="description">{mockProductDetail.description}</p>
      </div>

      <div className="detail-card full-width">
        <h3 className="card-title">最近の出荷履歴</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>伝票番号</th>
              <th>日付</th>
              <th>顧客</th>
              <th>数量</th>
            </tr>
          </thead>
          <tbody>
            {mockProductDetail.recentSlips.map((slip) => (
              <tr key={slip.id}>
                <td><Link to={`/slips/${slip.id}`} className="link">{slip.id}</Link></td>
                <td>{slip.date}</td>
                <td>{slip.customer}</td>
                <td>{slip.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
