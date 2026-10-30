import { useState } from 'react';
import AuthFlow from './AuthFlow';

function Home({ account, onLogout, isDark, onToggleTheme }) {
  return <main className="empty-home">
    <header className="home-header"><div className="home-brand"><img src="/passby-icon.png" alt="" />PassBy</div><span>{account.role === 'courier' ? 'Кур’єр' : 'Відправник'}</span><button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}>{isDark ? '☀️ Світла тема' : '🌙 Темна тема'}</button></header>
    <section className="home-card"><div className="home-badge">✓ Номер підтверджено</div><h1>Вітаємо у PassBy</h1><p>Головний екран поки порожній. Тут згодом з’являться функції доставки.</p><button onClick={onLogout}>Вийти з акаунта</button></section>
  </main>;
}

export default function App() {
  const [account, setAccount] = useState(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('passby-theme') === 'dark');
  function toggleTheme() {
    setIsDark(current => {
      const next = !current;
      localStorage.setItem('passby-theme', next ? 'dark' : 'light');
      return next;
    });
  }
  return <div className={`app-theme${isDark ? ' theme-dark' : ''}`}>
    {account
      ? <Home account={account} onLogout={() => setAccount(null)} isDark={isDark} onToggleTheme={toggleTheme} />
      : <AuthFlow onComplete={setAccount} isDark={isDark} onToggleTheme={toggleTheme} />}
  </div>;
}
