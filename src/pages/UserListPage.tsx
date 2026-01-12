import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './PageStyles.css'

interface User {
  id: number
  name: string
  email: string
  created_at: string
}

export function UserListPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/users')
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('このユーザーを削除しますか？')) return

    try {
      await fetch(`http://localhost:3001/api/users/${id}`, {
        method: 'DELETE',
      })
      setUsers(users.filter((user) => user.id !== id))
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  if (loading) {
    return <div className="page">読み込み中...</div>
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">ユーザー管理</h2>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名前</th>
              <th>メールアドレス</th>
              <th>登録日</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">ユーザーがいません</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleDateString('ja-JP')}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/users/${user.id}`} className="btn btn-small">詳細</Link>
                      <button onClick={() => handleDelete(user.id)} className="btn btn-small btn-danger-small">削除</button>
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
