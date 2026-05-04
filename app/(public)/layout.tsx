export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-black/10 px-6 py-4">
        <span className="font-semibold">BPM Parket</span>
        <span className="ml-3 text-sm text-black/60">— site komt eraan</span>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-black/10 px-6 py-4 text-sm text-black/60">
        © {new Date().getFullYear()} BPM Parket
      </footer>
    </div>
  );
}
