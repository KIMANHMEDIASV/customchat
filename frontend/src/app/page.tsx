import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          AI Chat
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Powered by Azure OpenAI & Azure Foundry
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
