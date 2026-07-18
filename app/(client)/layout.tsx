export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-app bg-white sm:my-6 sm:min-h-[calc(100vh-3rem)] sm:overflow-hidden sm:rounded-4xl sm:shadow-soft">
      {children}
    </div>
  );
}
