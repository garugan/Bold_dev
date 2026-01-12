import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './PageStyles.css'

interface Customer {
  id: number
  name: string
  address: string
  phone: string
  email: string
  created_at: string
}

export function CustomerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (id === 'new') {
      setLoading(false)
      setEditing(true)
    } else {
      fetchCustomer()
    }
  }, [id])

  const fetchCustomer = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/customers/${id}`)
      const data = await res.json()
      setCustomer(data)
      setName(data.name)
      setAddress(data.address)
      setPhone(data.phone)
      setEmail(data.email)
    } catch (error) {
      console.error('Failed to fetch customer:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (id === 'new') {
        const res = await fetch('http://localhost:3001/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, address, phone, email }),
        })
        const data = await res.json()
        navigate(`/customers/${data.id}`)
      } else {
        const res = await fetch(`http://localhost:3001/api/customers/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, address, phone, email }),
        })
        const data = await res.json()
        setCustomer(data)
        setEditing(false)
      }
    } catch (error) {
      console.error('Failed to save customer:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('この顧客を削除しますか？')) return

    try {
      await fetch(`http://localhost:3001/api/customers/${id}`, {
        method: 'DELETE',
      })
      navigate('/customers')
    } catch (error) {
      console.error('Failed to delete customer:', error)
    }
  }

  if (loading) {
    return <div className="page">読み込み中...</div>
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/customers" className="link">顧客管理</Link>
          <span> / </span>
          <span>{id === 'new' ? '新規登録' : customer?.name}</span>
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

      <div className="detail-card">
        <h3 className="card-title">{id === 'new' ? '新規顧客登録' : '顧客情報'}</h3>
        {editing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-row">
              <label>顧客名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="株式会社ABC"
                required
              />
            </div>
            <div className="form-row">
              <label>住所</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="東京都渋谷区xxx-xxx"
                required
              />
            </div>
            <div className="form-row">
              <label>電話番号</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03-1234-5678"
                required
              />
            </div>
            <div className="form-row">
              <label>メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@example.com"
                required
              />
            </div>
            <div className="form-actions">
              {id !== 'new' && (
                <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary">キャンセル</button>
              )}
              <button type="submit" className="btn btn-primary">
                {id === 'new' ? '登録' : '保存'}
              </button>
            </div>
          </form>
        ) : (
          <dl className="detail-list">
            <dt>ID</dt>
            <dd>{customer?.id}</dd>
            <dt>顧客名</dt>
            <dd>{customer?.name}</dd>
            <dt>住所</dt>
            <dd>{customer?.address}</dd>
            <dt>電話番号</dt>
            <dd>{customer?.phone}</dd>
            <dt>メールアドレス</dt>
            <dd>{customer?.email}</dd>
            <dt>登録日</dt>
            <dd>{customer && new Date(customer.created_at).toLocaleDateString('ja-JP')}</dd>
          </dl>
        )}
      </div>
    </div>
  )
}
