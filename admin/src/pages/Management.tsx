import { useAuth } from '../AuthContext'

export default function Management() {
  const { logout } = useAuth()

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <button
        onClick={logout}
        className="mt-4 rounded bg-gray-800 px-4 py-2 text-white"
      >
        Logout
      </button>
    </main>
  )
}
