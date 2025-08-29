export default function UserTypes() {
  const userTypes = [
    {
      title: "For Individuals",
      subtitle: "For salaried, self employed professionals.",
      description: "File income tax returns in 3 min, invest and grow your wealth, get expert assistance.",
      gradient: "from-smarttax-blue-500 to-smarttax-blue-600",
      icon: "fas fa-user",
    },
    {
      title: "For Tax Experts",
      subtitle: "For tax experts and professionals.",
      description: "Explore how tax experts save 2-7% in taxes for their clients with our GST, ITR and TDS suite.",
      gradient: "from-smarttax-orange-500 to-smarttax-orange-600",
      icon: "fas fa-user-tie",
    },
    {
      title: "For SMEs",
      subtitle: "For less than ₹50Cr turnover businesses.",
      description: "Explore SME suite including GST, Invoicing and TDS solution along with Smart app.",
      gradient: "from-smarttax-green-500 to-smarttax-green-600",
      icon: "fas fa-store",
    },
    {
      title: "For Enterprise",
      subtitle: "For more than ₹50Cr turnover businesses.",
      description: "Explore enterprise-grade stack of GST, e-Invoicing, e-Waybill, Vendor solutions and more.",
      gradient: "from-smarttax-purple-500 to-smarttax-purple-600",
      icon: "fas fa-building",
    },
  ];

  return (
    <section className="py-16 bg-gray-50" data-testid="user-types-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userTypes.map((userType, index) => (
            <div 
              key={userType.title}
              className={`bg-gradient-to-br ${userType.gradient} rounded-2xl p-8 text-white hover:shadow-xl transition-shadow cursor-pointer`}
              data-testid={`user-type-${index}`}
            >
              <div className="mb-6">
                <i className={`${userType.icon} text-3xl mb-4`}></i>
                <h3 className="text-2xl font-bold mb-2" data-testid={`user-type-title-${index}`}>
                  {userType.title}
                </h3>
                <p className="text-white/90 mb-4" data-testid={`user-type-subtitle-${index}`}>
                  {userType.subtitle}
                </p>
                <p className="text-sm text-white/80" data-testid={`user-type-description-${index}`}>
                  {userType.description}
                </p>
              </div>
              <i className="fas fa-arrow-right text-xl"></i>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
