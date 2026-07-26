import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="d-flex min-vh-100 bg-light">
      <AdminSidebar />

      <div className="flex-grow-1">
        <AdminNavbar />

        <main className="container-fluid py-4" style={{ paddingLeft: 28 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

