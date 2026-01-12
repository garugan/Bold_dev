import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './PageStyles.css'

interface SlipItem {
  id?: number
  product_id: number
  product_code?: string
  product_name?: string
  quantity: number
  price: number
}

interface Slip {
  id: number
  slip_number: string
  customer_id: number
  customer_name: string
  customer_address: string
  customer_phone: string
  status: string
  delivery_date: string
  notes: string
  items: SlipItem[]
  created_at: string
}

interface Customer {
  id: number
  name: string
}

interface Product {
  id: number
  code: string
  name: string
  price: number
}

export function SlipDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [slip, setSlip] = useState<Slip | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [slipNumber, setSlipNumber] = useState('')
  const [customerId, setCustomerId] = useState(0)
  const [status, setStatus] = useState('準備中')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<SlipItem[]>([])

  useEffect(() => {
    fetchMasterData()
    if (id === 'new') {
      setLoading(false)
      setEditing(true)
      generateSlipNumber()
    } else {
      fetchSlip()
    }
  }, [id])

  const generateSlipNumber = () => {
    const date = new Date()
    const num = `SLP-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    setSlipNumber(num)
  }

  const fetchMasterData = async () => {
    try {
      const [customersRes, productsRes] = await Promise.all([
        fetch('http://localhost:3001/api/customers'),
        fetch('http://localhost:3001/api/products'),
      ])
      setCustomers(await customersRes.json())
      setProducts(await productsRes.json())
    } catch (error) {
      console.error('Failed to fetch master data:', error)
    }
  }

  const fetchSlip = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/slips/${id}`)
      const data = await res.json()
      setSlip(data)
      setSlipNumber(data.slip_number)
      setCustomerId(data.customer_id)
      setStatus(data.status)
      setDeliveryDate(data.delivery_date ? data.delivery_date.split('T')[0] : '')
      setNotes(data.notes || '')
      setItems(data.items || [])
    } catch (error) {
      console.error('Failed to fetch slip:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = () => {
    if (products.length === 0) return
    const product = products[0]
    setItems([...items, { product_id: product.id, quantity: 1, price: product.price }])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: string, value: number) => {
    const newItems = [...items]
    if (field === 'product_id') {
      const product = products.find(p => p.id === value)
      newItems[index] = { ...newItems[index], product_id: value, price: product?.price || 0 }
    } else {
      newItems[index] = { ...newItems[index], [field]: value }
    }
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId) {
      alert('顧客を選択してください')
      return
    }
    try {
      const payload = {
        slip_number: slipNumber,
        customer_id: customerId,
        status,
        delivery_date: deliveryDate || null,
        notes,
        items,
      }
      if (id === 'new') {
        const res = await fetch('http://localhost:3001/api/slips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) {
          alert(data.error)
          return
        }
        navigate(`/slips/${data.id}`)
      } else {
        await fetch(`http://localhost:3001/api/slips/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        fetchSlip()
        setEditing(false)
      }
    } catch (error) {
      console.error('Failed to save slip:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('この伝票を削除しますか？')) return
    try {
      await fetch(`http://localhost:3001/api/slips/${id}`, { method: 'DELETE' })
      navigate('/slips')
    } catch (error) {
      console.error('Failed to delete slip:', error)
    }
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0)

  if (loading) {
    return <div className="page">読み込み中...</div>
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/slips" className="link">伝票一覧</Link>
          <span> / </span>
          <span>{id === 'new' ? '新規作成' : slip?.slip_number}</span>
        </div>
        <div className="header-actions">
          {id !== 'new' && !editing && (
            <>
              <button onClick={() => setEditing(true)} className="btn btn-secondary">編集</button>
              <button onClick={handleDelete} className="btn btn-danger">削除</button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit}>
          <div className="detail-grid">
            <div className="detail-card">
              <h3 className="card-title">伝票情報</h3>
              <div className="edit-form">
                <div className="form-row">
                  <label>伝票番号</label>
                  <input type="text" value={slipNumber} onChange={(e) => setSlipNumber(e.target.value)} required readOnly={id !== 'new'} />
                </div>
                <div className="form-row">
                  <label>顧客</label>
                  <select value={customerId} onChange={(e) => setCustomerId(Number(e.target.value))} required>
                    <option value="">選択してください</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label>ステータス</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="準備中">準備中</option>
                    <option value="配送中">配送中</option>
                    <option value="配送済">配送済</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>配送予定日</label>
                  <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                </div>
                <div className="form-row">
                  <label>備考</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
                </div>
              </div>
            </div>
          </div>

          <div className="detail-card full-width">
            <h3 className="card-title">商品明細</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>商品</th>
                  <th>数量</th>
                  <th>単価</th>
                  <th>小計</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <select value={item.product_id} onChange={(e) => handleItemChange(index, 'product_id', Number(e.target.value))}>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))} min="1" style={{ width: '80px' }} />
                    </td>
                    <td>¥{item.price.toLocaleString()}</td>
                    <td>¥{(item.quantity * item.price).toLocaleString()}</td>
                    <td>
                      <button type="button" onClick={() => handleRemoveItem(index)} className="btn btn-small btn-danger-small">削除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right"><strong>合計</strong></td>
                  <td colSpan={2}><strong>¥{total.toLocaleString()}</strong></td>
                </tr>
              </tfoot>
            </table>
            <button type="button" onClick={handleAddItem} className="btn btn-secondary" style={{ marginTop: '1rem' }}>+ 商品を追加</button>
          </div>

          <div className="form-actions" style={{ marginTop: '1rem' }}>
            {id !== 'new' && <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary">キャンセル</button>}
            <button type="submit" className="btn btn-primary">{id === 'new' ? '作成' : '保存'}</button>
          </div>
        </form>
      ) : (
        <>
          <div className="detail-grid">
            <div className="detail-card">
              <h3 className="card-title">伝票情報</h3>
              <dl className="detail-list">
                <dt>伝票番号</dt>
                <dd>{slip?.slip_number}</dd>
                <dt>作成日</dt>
                <dd>{slip && new Date(slip.created_at).toLocaleDateString('ja-JP')}</dd>
                <dt>配送予定日</dt>
                <dd>{slip?.delivery_date ? new Date(slip.delivery_date).toLocaleDateString('ja-JP') : '-'}</dd>
                <dt>ステータス</dt>
                <dd><span className={`status status-${slip?.status === '配送済' ? 'done' : slip?.status === '配送中' ? 'progress' : 'pending'}`}>{slip?.status}</span></dd>
              </dl>
            </div>
            <div className="detail-card">
              <h3 className="card-title">配送先情報</h3>
              <dl className="detail-list">
                <dt>顧客名</dt>
                <dd>{slip?.customer_name}</dd>
                <dt>住所</dt>
                <dd>{slip?.customer_address}</dd>
                <dt>電話番号</dt>
                <dd>{slip?.customer_phone}</dd>
                <dt>備考</dt>
                <dd>{slip?.notes || '-'}</dd>
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
                {slip?.items.map((item) => (
                  <tr key={item.id}>
                    <td><Link to={`/products/${item.product_id}`} className="link">{item.product_code}</Link></td>
                    <td>{item.product_name}</td>
                    <td>{item.quantity}</td>
                    <td>¥{item.price.toLocaleString()}</td>
                    <td>¥{(item.quantity * item.price).toLocaleString()}</td>
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
        </>
      )}
    </div>
  )
}
