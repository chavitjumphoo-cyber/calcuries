import { Link, useLocation } from 'react-router-dom'

export default function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: '🏠', label: 'หน้าหลัก' },
    { path: '/add', icon: '➕', label: 'เพิ่ม' },
    { path: '/stats', icon: '📊', label: 'สถิติ' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-white border-t border-border backdrop-blur-lg bg-opacity-95">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-around py-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-colors ${
                location.pathname === item.path
                  ? 'text-terracotta bg-terracotta-tint'
                  : 'text-muted'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
