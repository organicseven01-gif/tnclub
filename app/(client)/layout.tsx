export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-app bg-white sm:my-8 sm:min-h-[calc(100vh-4rem)] sm:overflow-hidden sm:rounded-[2.75rem] sm:shadow-premium sm:ring-1 sm:ring-black/5">
      {children}
    </div>
  );
}
