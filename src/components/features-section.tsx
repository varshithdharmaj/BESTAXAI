export default function FeaturesSection() {
  const features = [
    {
      title: "Maximum tax savings",
      description: "Businesses save up to 2-7% of their net GST with us every month. Individuals can save up to ₹86,500 by filing their tax returns through us.",
      icon: "fas fa-piggy-bank",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Unparalleled speed",
      description: "Experience 3x faster GST filings, 5x faster invoice reconciliation and 10x faster e-waybill generation. Individuals file their tax returns in under 3 min.",
      icon: "fas fa-bolt",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Accurate Compliance",
      description: "Our products are designed and tested by in-house tax experts, ensuring every new clause, form or feature is updated and sent to you over the cloud.",
      icon: "fas fa-shield-alt",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  return (
    <section className="py-16 bg-white" data-testid="features-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="features-heading">
            All our products are designed to deliver
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={feature.title} className="text-center" data-testid={`feature-${index}`}>
              <div className={`${feature.bgColor} p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center`}>
                <i className={`${feature.icon} ${feature.color} text-3xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4" data-testid={`feature-title-${index}`}>
                {feature.title}
              </h3>
              <p className="text-gray-600" data-testid={`feature-description-${index}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
