export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <div>Theme</div>
      </div>
    </header>
  );
}
