export default function StatsSection() {
  const stats = [
    {
      value: "250M+",
      label: "invoices uploaded",
      icon: "fas fa-file-invoice",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      value: "6M+",
      label: "Businesses visible",
      icon: "fas fa-building",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      value: "$300B+",
      label: "trade value filled",
      icon: "fas fa-chart-line",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      value: "35,000+",
      label: "retail investors",
      icon: "fas fa-users",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      value: "6M+",
      label: "tax returns filed",
      icon: "fas fa-file-alt",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ];

  return (
    <section className="py-16 bg-white" data-testid="stats-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="stats-heading">
            Numbers don'''t lie!
          </h2>
          <p className="text-xl text-gray-600" data-testid="stats-description">
            Products that perform seamlessly during any kind of surge
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center" data-testid={`stat-${index}`}>
              <div className={`${stat.bgColor} p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                <i className={`${stat.icon} ${stat.color} text-xl`}></i>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2" data-testid={`stat-value-${index}`}>
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm" data-testid={`stat-label-${index}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
