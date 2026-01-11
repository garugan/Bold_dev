import { useState } from 'react'
import { Link } from 'react-router-dom'
import './LoginPage.css'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: パスワードリセットメール送信処理を実装
    setSubmitted(true)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">パスワードをお忘れの方</h1>
        {submitted ? (
          <div className="success-message">
            <p>パスワードリセット用のメールを送信しました。</p>
            <p>メールに記載されたリンクからパスワードを再設定してください。</p>
            <div className="login-links">
              <Link to="/login" className="login-link">ログイン画面に戻る</Link>
            </div>
          </div>
        ) : (
          <>
            <p className="form-description">
              登録済みのメールアドレスを入力してください。パスワードリセット用のリンクをお送りします。
            </p>
            <form onSubmit={handleSubmit} className="login-form">
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
              <button type="submit" className="login-button">
                送信する
              </button>
            </form>
            <div className="login-links">
              <Link to="/login" className="login-link">ログイン画面に戻る</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
