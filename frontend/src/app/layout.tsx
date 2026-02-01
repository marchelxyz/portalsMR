import "./globals.css";

export const metadata = {
  title: "Portal 2.0",
  description: "Digital управляющий для франчайзи",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
