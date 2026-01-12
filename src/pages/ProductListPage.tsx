import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './PageStyles.css'

interface Product {
  id: number
  code: string
  name: string
  category: string
  stock: number
  price: number
}

export function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('この商品を削除しますか？')) return

    try {
      await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE',
      })
      setProducts(products.filter((product) => product.id !== id))
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
        <h2 className="page-title">商品一覧</h2>
        <Link to="/products/new" className="btn btn-primary">+ 新規商品登録</Link>
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
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">商品がありません</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td><Link to={`/products/${product.id}`} className="link">{product.code}</Link></td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>
                    <span className={product.stock === 0 ? 'stock-out' : product.stock < 10 ? 'stock-low' : ''}>
                      {product.stock}
                    </span>
                  </td>
                  <td>¥{product.price.toLocaleString()}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/products/${product.id}`} className="btn btn-small">詳細</Link>
                      <button onClick={() => handleDelete(product.id)} className="btn btn-small btn-danger-small">削除</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
