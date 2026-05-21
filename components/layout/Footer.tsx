export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="max-w-4xl mx-auto flex items-center justify-center h-14 px-4 text-sm text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} frostsalix blog</span>
      </div>
    </footer>
  )
}
