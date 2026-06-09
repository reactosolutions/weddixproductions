import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const revalidate = 60

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
