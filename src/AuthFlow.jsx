import { useState } from 'react';
import './AuthFlow.css';
const DEMO_CODE = '8421';
const Field = ({ label, ...props }) => <label className="auth-field">{label}<input {...props} /></label>;

export default function AuthFlow({ onComplete, isDark, onToggleTheme }) {
  const [step, setStep] = useState('role');
  const [role, setRole] = useState('sender');
  const [mode, setMode] = useState('register');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const update = callback => event => { setError(''); callback(event.target.value); };
  const finish = (cardAdded = false) => onComplete({ role, fullName, email, phone, cardAdded });

  function continueWithAccount(event) {
    event.preventDefault(); setError('');
    const form = event.currentTarget;
    const name = form.querySelector('[autocomplete="name"]');
    const emailField = form.querySelector('input[type="email"]');
    const tel = form.querySelector('input[type="tel"]');
    const password = form.querySelector('input[type="password"]');
    if (name && fullName.trim().split(/\s+/).length < 2) { setError('Вкажіть, будь ласка, ім’я та прізвище.'); name.focus(); return; }
    if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Введіть коректну адресу електронної пошти, наприклад name@example.com.'); emailField.focus(); return; }
    if (!phone.trim()) { setError('Введіть номер телефону.'); tel.focus(); return; }
    if (password && password.value.length < 8) { setError('Пароль має містити щонайменше 8 символів.'); password.focus(); return; }
    setStep('phone');
  }
  function confirmCode(event) {
    event.preventDefault();
    if (code.length !== 4) { setError('Введіть чотири цифри з SMS.'); return; }
    if (code !== DEMO_CODE) { setError(`Для демонстрації введіть код ${DEMO_CODE}.`); return; }
    setError(''); setStep('verified');
  }
  function completeCard(event) {
    event.preventDefault();
    const input = [...event.currentTarget.querySelectorAll('input')].find(item => !item.value.trim());
    if (input) { setError(`Заповніть поле «${input.closest('label')?.childNodes[0]?.textContent?.trim() || 'поле'}».`); input.focus(); return; }
    setError(''); finish(true);
  }
  const themeButton = <button className="theme-toggle" type="button" onClick={onToggleTheme}>{isDark ? '☀️ Світла тема' : '🌙 Темна тема'}</button>;

  return <main className="auth-layout">
    <header className="auth-header"><div className="auth-brand"><img src="/passby-icon.png" alt=""/><span>PassBy</span></div><span>Сервіс доставки</span>{themeButton}</header>
    <section className="auth-panel">
      {step === 'role' && <><div className="auth-step">ПОЧАТОК · КРОК 1 З 3</div><h1>Оберіть роль</h1><p className="auth-muted">Оберіть, як ви плануєте користуватися PassBy.</p><div className="role-options">
        <button className={`role-choice ${role === 'sender' ? 'is-selected' : ''}`} onClick={() => setRole('sender')}><span className="role-symbol">📦</span><span><b>Відправник</b><small>Створювати відправлення та знаходити кур’єрів</small></span><i/></button>
        <button className={`role-choice ${role === 'courier' ? 'is-selected' : ''}`} onClick={() => setRole('courier')}><span className="role-symbol">🚴</span><span><b>Кур’єр</b><small>Приймати доставки та отримувати оплату</small></span><i/></button>
      </div><button className="auth-primary" onClick={() => setStep('account')}>Продовжити <span>→</span></button></>}
      {step === 'account' && <><button className="auth-back" onClick={() => setStep('role')}>← Назад</button><div className="auth-step">{role === 'courier' ? 'КАБІНЕТ КУР’ЄРА' : 'КАБІНЕТ ВІДПРАВНИКА'}</div><h1>{mode === 'register' ? 'Створити акаунт' : 'Увійти в акаунт'}</h1><p className="auth-muted">{mode === 'register' ? 'Заповніть дані та підтвердьте номер телефону.' : 'Введіть дані акаунта й підтвердьте номер телефону.'}</p>
        <div className="auth-tabs"><button className={mode === 'login' ? 'current' : ''} onClick={() => setMode('login')}>Вхід</button><button className={mode === 'register' ? 'current' : ''} onClick={() => setMode('register')}>Реєстрація</button></div>
        <form className="auth-form" onSubmit={continueWithAccount} noValidate>{mode === 'register' && <><Field label="Ім’я та прізвище" required autoComplete="name" placeholder="Наприклад, Анна Іваненко" value={fullName} onChange={update(setFullName)}/><Field label="Електронна пошта" required type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={update(setEmail)}/></>}<Field label="Номер телефону" required type="tel" autoComplete="tel" placeholder="+380 67 123 45 67" value={phone} onChange={update(setPhone)}/>{role === 'courier' && <Field label="Пароль" required type="password" minLength="8" placeholder="Щонайменше 8 символів"/>}{error && <p className="auth-error" role="alert">{error}</p>}<button className="auth-primary" type="submit">{mode === 'register' ? 'Продовжити' : 'Увійти та підтвердити телефон'} <span>→</span></button></form></>}
      {step === 'phone' && <><button className="auth-back" onClick={() => setStep('account')}>← Назад</button><div className="auth-step">ПІДТВЕРДЖЕННЯ ТЕЛЕФОНУ</div><h1>Введіть код із SMS</h1><p className="auth-muted">Надіслали код на <b>{phone}</b></p><form className="auth-form" onSubmit={confirmCode} noValidate><Field label="Код підтвердження" inputMode="numeric" autoComplete="one-time-code" maxLength="4" placeholder="4 цифри" value={code} onChange={update(value => setCode(value.replace(/\D/g, '').slice(0,4)))} />{error && <p className="auth-error" role="alert">{error}</p>}<p className="auth-demo">Демо-режим: SMS не надсилаються. Введіть код {DEMO_CODE}.</p><button className="auth-primary">Підтвердити номер <span>→</span></button></form></>}
      {step === 'verified' && <><button className="auth-back" onClick={() => setStep('phone')}>← Назад</button><div className="auth-success">✓</div><div className="auth-step">НОМЕР ПІДТВЕРДЖЕНО</div><h1>{role === 'courier' ? 'Дані кур’єра' : 'Акаунт готовий'}</h1><p className="auth-muted">{role === 'courier' ? 'Додайте картку для виплат. Це демонстраційна форма.' : 'Можна перейти на головний екран.'}</p>{role === 'courier' ? <form className="auth-form" onSubmit={completeCard} noValidate><Field label="Номер картки (демо)" inputMode="numeric" placeholder="0000 0000 0000 0000"/><div className="card-fields"><Field label="Термін дії" placeholder="ММ/РР"/><Field label="CVV" type="password" placeholder="•••"/></div>{error && <p className="auth-error" role="alert">{error}</p>}<p className="auth-demo">Не вводьте справжні платіжні дані: вони не зберігаються.</p><button className="auth-primary">Зберегти та продовжити <span>→</span></button><button type="button" className="auth-skip" onClick={() => finish()}>Додати картку пізніше</button></form> : <button className="auth-primary" onClick={() => finish()}>Відкрити головний екран <span>→</span></button>}</>}
    </section><footer className="auth-footer">PassBy · Доставка починається тут</footer>
  </main>;
}
