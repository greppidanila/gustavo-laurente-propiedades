import type {Metadata} from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Gustavo Laurente Propiedades | Pergamino',
  description: 'Más de 20 años acompañando a nuestros clientes en la compra, venta y alquiler de propiedades en Pergamino y la región.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased text-slate-800 bg-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
