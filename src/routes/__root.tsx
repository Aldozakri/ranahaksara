import { createRootRoute, HeadContent, Link, Scripts } from '@tanstack/react-router'
import ThemeToggle from '@/components/ThemeToggle'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Ranah Aksara' },
      { name: 'description', content: 'Kumpulan novel dan cerita bersambung karya pribadi.' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Prevent flash of unstyled theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
          rel="stylesheet"
        />
        <HeadContent />
      </head>
      <body>
        <Nav />
        <div className="page">{children}</div>
        <Scripts />
      </body>
    </html>
  )
}

function Nav() {
  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">
        Ranah Aksara
      </Link>
      <div className="nav-links">
        <Link to="/cerita" className="nav-link" activeProps={{ className: 'active' }}>
          Cerita
        </Link>
        <Link to="/upload" className="nav-link" activeProps={{ className: 'active' }}>
          Upload
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  )
}
