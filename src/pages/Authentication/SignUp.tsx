import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import '../../styles/game-ui.css'
import '../Authentication/Login.css'
import './SignUp.css'
import { ApiError, register } from '../../api/authApi'

import background from '../../assets/Log In Sign Up/Log In Sign Up Background.png'
import parchment from '../../assets/Log In Sign Up/Log In Sign Up Pergament.png'
import signUpButton from '../../assets/Log In Sign Up/Sign In.png'

type SignUpProps = {
  onSignUp: () => void
  onBackToLogin: () => void
}

/** Mirrors AccountService.MinimumPasswordLength on the backend. */
const MINIMUM_PASSWORD_LENGTH = 8

function SignUp({ onSignUp, onBackToLogin }: SignUpProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Complete all fields to continue.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < MINIMUM_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters.`)
      return
    }

    if (!termsAccepted) {
      setError('Accept the Terms of Service and Privacy Policy to continue.')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      await register({ username, email, password })
      onSignUp()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to create an account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page signup-page" style={{ backgroundImage: `url("${background}")` }}>
      <section className="login-parchment">
        <img className="login-parchment-image" src={parchment} alt="" aria-hidden="true" />

        <form className="login-form signup-form" onSubmit={handleSubmit} noValidate>
          <h1>Sign Up</h1>
          <div className="login-heading-line" aria-hidden="true" />

          <label className="login-field">
            <UserRound className="field-icon" size={18} strokeWidth={2.25} aria-hidden="true" />
            <span className="visually-hidden">Username</span>
            <input
              type="text"
              value={username}
              placeholder="Username"
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
          </label>

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
              autoComplete="new-password"
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

          <label className="login-field">
            <LockKeyhole className="field-icon" size={18} strokeWidth={2.25} aria-hidden="true" />
            <span className="visually-hidden">Confirm Password</span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
            />
            <button
              className="password-toggle"
              type="button"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              onClick={() => setShowConfirmPassword((isVisible) => !isVisible)}
            >
              {showConfirmPassword ? <EyeOff size={18} strokeWidth={2.25} /> : <Eye size={18} strokeWidth={2.25} />}
            </button>
          </label>

          <label className="terms-option">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
            />
            <span>
              I agree to the <a href="#terms" onClick={(event) => event.preventDefault()}>Terms of Service</a>{' '}
              and <a href="#privacy" onClick={(event) => event.preventDefault()}>Privacy Policy</a>
            </span>
          </label>

          <p className={`login-error${error ? ' login-error--visible' : ''}`} role="alert" aria-live="polite">
            {error || '\u00a0'}
          </p>

          <button className="game-button login-submit" type="submit" disabled={isSubmitting}>
            <img src={signUpButton} alt="Sign Up" />
          </button>

          <p className="create-account signup-login-link">
            Already have an account?{' '}
            <a
              href="#login"
              onClick={(event) => {
                event.preventDefault()
                onBackToLogin()
              }}
            >
              Log In
            </a>
          </p>
        </form>
      </section>
    </main>
  )
}

export default SignUp
