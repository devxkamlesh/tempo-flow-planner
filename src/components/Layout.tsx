
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <main className={`flex-1 ${isMobile ? 'p-4' : 'p-6'} overflow-auto`}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
