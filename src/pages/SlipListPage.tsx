import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './PageStyles.css'

interface Slip {
  id: number
  slip_number: string
  customer_name: string
  status: string
  item_count: number
  total: number
  created_at: string
}

export function SlipListPage() {
  const [slips, setSlips] = useState<Slip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSlips()
  }, [])

  const fetchSlips = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/slips')
      const data = await res.json()
      setSlips(data)
    } catch (error) {
      console.error('Failed to fetch slips:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('この伝票を削除しますか？')) return

    try {
      await fetch(`http://localhost:3001/api/slips/${id}`, {
        method: 'DELETE',
      })
      setSlips(slips.filter((slip) => slip.id !== id))
    } catch (error) {
      console.error('Failed to delete slip:', error)
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case '配送済': return 'status-done'
      case '配送中': return 'status-progress'
      default: return 'status-pending'
    }
  }

  if (loading) {
    return <div className="page">読み込み中...</div>
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">伝票一覧</h2>
        <Link to="/slips/new" className="btn btn-primary">+ 新規伝票作成</Link>
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
            {slips.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">伝票がありません</td>
              </tr>
            ) : (
              slips.map((slip) => (
                <tr key={slip.id}>
                  <td><Link to={`/slips/${slip.id}`} className="link">{slip.slip_number}</Link></td>
                  <td>{new Date(slip.created_at).toLocaleDateString('ja-JP')}</td>
                  <td>{slip.customer_name}</td>
                  <td>{slip.item_count}点</td>
                  <td>¥{(slip.total || 0).toLocaleString()}</td>
                  <td>
                    <span className={`status ${getStatusClass(slip.status)}`}>
                      {slip.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/slips/${slip.id}`} className="btn btn-small">詳細</Link>
                      <button onClick={() => handleDelete(slip.id)} className="btn btn-small btn-danger-small">削除</button>
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
