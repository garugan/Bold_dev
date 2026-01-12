import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './PageStyles.css'

interface User {
  id: number
  name: string
  email: string
  created_at: string
}

export function UserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/users/${id}`)
      const data = await res.json()
      setUser(data)
      setName(data.name)
      setEmail(data.email)
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      setUser(data)
      setEditing(false)
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('このユーザーを削除しますか？')) return

    try {
      await fetch(`http://localhost:3001/api/users/${id}`, {
        method: 'DELETE',
      })
      navigate('/users')
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  if (loading) {
    return <div className="page">読み込み中...</div>
  }

  if (!user) {
    return <div className="page">ユーザーが見つかりません</div>
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/users" className="link">ユーザー管理</Link>
          <span> / </span>
          <span>{user.name}</span>
        </div>
        <div className="header-actions">
          {!editing && (
            <>
              <button onClick={() => setEditing(true)} className="btn btn-secondary">編集</button>
              <button onClick={handleDelete} className="btn btn-danger">削除</button>
            </>
          )}
        </div>
      </div>

      <div className="detail-card">
        <h3 className="card-title">ユーザー情報</h3>
        {editing ? (
          <form onSubmit={handleUpdate} className="edit-form">
            <div className="form-row">
              <label>名前</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-row">
              <label>メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary">キャンセル</button>
              <button type="submit" className="btn btn-primary">保存</button>
            </div>
          </form>
        ) : (
          <dl className="detail-list">
            <dt>ID</dt>
            <dd>{user.id}</dd>
            <dt>名前</dt>
            <dd>{user.name}</dd>
            <dt>メールアドレス</dt>
            <dd>{user.email}</dd>
            <dt>登録日</dt>
            <dd>{new Date(user.created_at).toLocaleDateString('ja-JP')}</dd>
          </dl>
        )}
      </div>
    </div>
  )
}
