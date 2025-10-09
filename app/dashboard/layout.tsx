const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
