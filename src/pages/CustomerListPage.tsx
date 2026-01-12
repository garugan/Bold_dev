import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './PageStyles.css'

interface Customer {
  id: number
  name: string
  address: string
  phone: string
  email: string
  created_at: string
}

export function CustomerListPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/customers')
      const data = await res.json()
      setCustomers(data)
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('この顧客を削除しますか？')) return

    try {
      await fetch(`http://localhost:3001/api/customers/${id}`, {
        method: 'DELETE',
      })
      setCustomers(customers.filter((customer) => customer.id !== id))
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
        <h2 className="page-title">顧客管理</h2>
        <Link to="/customers/new" className="btn btn-primary">+ 新規顧客登録</Link>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>顧客名</th>
              <th>住所</th>
              <th>電話番号</th>
              <th>メールアドレス</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">顧客がいません</td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.address}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.email}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/customers/${customer.id}`} className="btn btn-small">詳細</Link>
                      <button onClick={() => handleDelete(customer.id)} className="btn btn-small btn-danger-small">削除</button>
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
