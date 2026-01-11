import { useParams, Link } from 'react-router-dom'
import './PageStyles.css'

const mockSlipDetail = {
  id: 'SLP-001',
  date: '2024-01-15',
  customer: '株式会社ABC',
  customerAddress: '東京都渋谷区xxx-xxx',
  customerPhone: '03-1234-5678',
  status: '配送済',
  deliveryDate: '2024-01-16',
  items: [
    { id: 'PRD-001', name: 'ノートPC Dell XPS 15', quantity: 1, price: 25000 },
    { id: 'PRD-003', name: 'USBケーブル Type-C', quantity: 5, price: 2000 },
    { id: 'PRD-005', name: 'マウスパッド', quantity: 2, price: 3000 },
  ],
  notes: '午前中配送希望',
}

export function SlipDetailPage() {
  const { id } = useParams()

  const total = mockSlipDetail.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/slips" className="link">伝票一覧</Link>
          <span> / </span>
          <span>{id}</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">編集</button>
          <button className="btn btn-primary">印刷</button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3 className="card-title">伝票情報</h3>
          <dl className="detail-list">
            <dt>伝票番号</dt>
            <dd>{mockSlipDetail.id}</dd>
            <dt>作成日</dt>
            <dd>{mockSlipDetail.date}</dd>
            <dt>配送予定日</dt>
            <dd>{mockSlipDetail.deliveryDate}</dd>
            <dt>ステータス</dt>
            <dd>
              <span className="status status-done">{mockSlipDetail.status}</span>
            </dd>
          </dl>
        </div>

        <div className="detail-card">
          <h3 className="card-title">配送先情報</h3>
          <dl className="detail-list">
            <dt>顧客名</dt>
            <dd>{mockSlipDetail.customer}</dd>
            <dt>住所</dt>
            <dd>{mockSlipDetail.customerAddress}</dd>
            <dt>電話番号</dt>
            <dd>{mockSlipDetail.customerPhone}</dd>
            <dt>備考</dt>
            <dd>{mockSlipDetail.notes}</dd>
          </dl>
        </div>
      </div>

      <div className="detail-card full-width">
        <h3 className="card-title">商品明細</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>商品コード</th>
              <th>商品名</th>
              <th>数量</th>
              <th>単価</th>
              <th>小計</th>
            </tr>
          </thead>
          <tbody>
            {mockSlipDetail.items.map((item) => (
              <tr key={item.id}>
                <td><Link to={`/products/${item.id}`} className="link">{item.id}</Link></td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>¥{item.price.toLocaleString()}</td>
                <td>¥{(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="text-right"><strong>合計</strong></td>
              <td><strong>¥{total.toLocaleString()}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
