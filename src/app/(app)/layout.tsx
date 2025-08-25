import Navbar from '@/components/layout/navbar';

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main className="">{children}</main>
    </>
  );
}
