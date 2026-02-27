import React from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { logout } from '../../store/slices/authSlice'
import { toggleSidebar } from '../../store/slices/uiSlice'
import { Button } from '../ui/Button'

type NavItem = { to: string; label: string }

type BaseLayoutProps = {
  title: string
  navItems: NavItem[]
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ title, navItems }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen)
  const location = useLocation()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-56' : 'w-0'
        } flex-shrink-0 overflow-hidden bg-slate-900 text-slate-100 transition-all duration-200`}
      >
        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-sm font-semibold">
            PS
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{title}</h2>
            <p className="truncate text-[11px] text-slate-400">Pruthviraj Portal</p>
          </div>
        </div>
        <nav className="space-y-1 p-2">
          {navItems.map(({ to, label }) => {
            const active = location.pathname === to || location.pathname === `${to}/`
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span className="truncate">{label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full p-2"
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-3 py-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                  {(user.name || user.email || '?')
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <span className="max-w-[140px] truncate text-sm text-gray-700">{user.name ?? user.email}</span>
              </div>
            )}
            <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-50 p-6">
          <div className="mx-auto flex max-w-6xl flex-col space-y-6 h-full">
          <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default BaseLayout
