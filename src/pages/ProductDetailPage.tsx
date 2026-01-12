import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './PageStyles.css'

interface Product {
  id: number
  code: string
  name: string
  category: string
  stock: number
  price: number
  description: string
  created_at: string
}

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState(0)
  const [stock, setStock] = useState(0)
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (id === 'new') {
      setLoading(false)
      setEditing(true)
    } else {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/products/${id}`)
      const data = await res.json()
      setProduct(data)
      setCode(data.code)
      setName(data.name)
      setCategory(data.category)
      setPrice(data.price)
      setStock(data.stock)
      setDescription(data.description || '')
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (id === 'new') {
        const res = await fetch('http://localhost:3001/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, name, category, price, stock, description }),
        })
        const data = await res.json()
        if (!res.ok) {
          alert(data.error)
          return
        }
        navigate(`/products/${data.id}`)
      } else {
        const res = await fetch(`http://localhost:3001/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, name, category, price, stock, description }),
        })
        const data = await res.json()
        setProduct(data)
        setEditing(false)
      }
    } catch (error) {
      console.error('Failed to save product:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('この商品を削除しますか？')) return

    try {
      await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE',
      })
      navigate('/products')
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  if (loading) {
    return <div className="page">読み込み中...</div>
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/products" className="link">商品一覧</Link>
          <span> / </span>
          <span>{id === 'new' ? '新規登録' : product?.name}</span>
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
        <h3 className="card-title">{id === 'new' ? '新規商品登録' : '商品情報'}</h3>
        {editing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-grid">
              <div className="form-row">
                <label>商品コード</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="PRD-001"
                  required
                />
              </div>
              <div className="form-row">
                <label>商品名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="商品名"
                  required
                />
              </div>
              <div className="form-row">
                <label>カテゴリ</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="PC"
                  required
                />
              </div>
              <div className="form-row">
                <label>単価</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min="0"
                  required
                />
              </div>
              <div className="form-row">
                <label>在庫数</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <label>説明</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="商品の説明"
                rows={3}
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
          <>
            <dl className="detail-list">
              <dt>商品コード</dt>
              <dd>{product?.code}</dd>
              <dt>商品名</dt>
              <dd>{product?.name}</dd>
              <dt>カテゴリ</dt>
              <dd>{product?.category}</dd>
              <dt>単価</dt>
              <dd className="large-number">¥{product?.price.toLocaleString()}</dd>
              <dt>在庫数</dt>
              <dd className="large-number">{product?.stock} 個</dd>
              <dt>登録日</dt>
              <dd>{product && new Date(product.created_at).toLocaleDateString('ja-JP')}</dd>
            </dl>
            {product?.description && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem', color: '#64748b', fontSize: '0.875rem' }}>説明</h4>
                <p className="description">{product.description}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
