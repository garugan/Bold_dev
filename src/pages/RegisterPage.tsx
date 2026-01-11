import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './LoginPage.css'

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 登録処理を実装
    if (password !== passwordConfirm) {
      alert('パスワードが一致しません')
      return
    }
    navigate('/login')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">新規登録</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">名前</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@company.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordConfirm">パスワード（確認）</label>
            <input
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="パスワードを再入力"
              required
            />
          </div>
          <button type="submit" className="login-button">
            登録する
          </button>
        </form>
        <div className="login-links">
          <Link to="/login" className="login-link">ログイン画面に戻る</Link>
        </div>
      </div>
    </div>
  )
}
