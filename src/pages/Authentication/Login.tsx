import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import '../../styles/game-ui.css'
import './Login.css'

import background from '../../assets/Log In Sign Up/Log In Sign Up Background.png'
import parchment from '../../assets/Log In Sign Up/Log In Sign Up Pergament.png'
import loginButton from '../../assets/Log In Sign Up/Log In.png'

type LoginProps = {
  onLogin: () => void
  onCreateAccount: () => void
}

function MailIcon() {
  return <span className="field-icon" aria-hidden="true">✉</span>
}

function LockIcon() {
  return <span className="field-icon field-icon-lock" aria-hidden="true">♙</span>
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return <span className="eye-icon" aria-hidden="true">{hidden ? '◉' : '◌'}</span>
}

function Login({ onLogin, onCreateAccount }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim() || !password) {
      setHasError(true)
      return
    }

    setHasError(false)
    onLogin()
  }

  return (
    <main className="login-page" style={{ backgroundImage: `url("${background}")` }}>
      <section className="login-parchment">
        <img className="login-parchment-image" src={parchment} alt="" aria-hidden="true" />

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <h1>Log In</h1>
          <div className="login-heading-line" aria-hidden="true" />

          <label className="login-field">
            <Mail className="field-icon" size={18} strokeWidth={2.25} aria-hidden="true" />
            <span className="visually-hidden">Email</span>
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="login-field">
            <LockKeyhole className="field-icon" size={18} strokeWidth={2.25} aria-hidden="true" />
            <span className="visually-hidden">Password</span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
            <button
              className="password-toggle"
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((isVisible) => !isVisible)}
            >
              {showPassword ? <EyeOff size={18} strokeWidth={2.25} /> : <Eye size={18} strokeWidth={2.25} />}
            </button>
          </label>

          <div className="login-options-row">
            <label className="remember-option">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot-password" onClick={(event) => event.preventDefault()}>
              Forgot password?
            </a>
          </div>

          <p
            className={`login-error${hasError ? ' login-error--visible' : ''}`}
            role="alert"
            aria-live="polite"
          >
            {hasError ? 'Enter an email and password to continue.' : '\u00a0'}
          </p>

          <button className="game-button login-submit" type="submit">
            <img src={loginButton} alt="Log In" />
          </button>

          <div className="login-divider" aria-hidden="true">✦ ───────── ✦ ───────── ✦</div>
          <p className="create-account">
            New to our realm?{' '}
            <a
              href="#create-account"
              onClick={(event) => {
                event.preventDefault()
                onCreateAccount()
              }}
            >
              Create an account
            </a>
          </p>
        </form>
      </section>
    </main>
  )
}

export default Login
