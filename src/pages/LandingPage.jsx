import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 to-blue-600 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-blue-700 bg-opacity-80 shadow-md">
        <div className="text-3xl font-bold tracking-wide">MyCloud</div>
        <div>
          <Link to="/login">
            <button className="mr-4 px-6 py-2 bg-white text-blue-700 rounded-full hover:bg-gray-200 transition">
              Войти
            </button>
          </Link>
          <Link to="/register">
            <button className="px-6 py-2 bg-yellow-400 text-blue-800 rounded-full hover:bg-yellow-300 transition">
              Регистрация
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-grow text-center p-8">
        <h1 className="text-5xl font-extrabold mb-6">
          Добро пожаловать в <span className="text-yellow-300">MyCloud</span>!
        </h1>
        <p className="text-lg text-gray-100 mb-8 max-w-2xl">
          Ваши файлы всегда под рукой. Удобно, безопасно, быстро.
        </p>
        <Link to="/register">
          <button className="px-8 py-4 bg-yellow-500 text-blue-800 rounded-lg text-lg shadow-md hover:bg-yellow-400 transition">
            Начать сейчас
          </button>
        </Link>
      </main>

      {/* Footer */}
      <footer className="text-center bg-blue-800 bg-opacity-90 py-6">
        <p className="text-sm">MyCloud © 2024</p>
        <p>
          <Link to="/privacy" className="text-yellow-300 hover:underline">Политика конфиденциальности</Link> |{' '}
          <Link to="/contact" className="text-yellow-300 hover:underline">Контакты</Link>
        </p>
      </footer>
    </div>
  )
}

export default LandingPage;
