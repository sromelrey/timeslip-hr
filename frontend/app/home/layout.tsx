export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="employee-layout">
      {children}
    </div>
  );
}
