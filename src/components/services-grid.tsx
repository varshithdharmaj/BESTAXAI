export default function ServicesGrid() {
  const services = [
    {
      title: "Self ITR Filing",
      description: "ITR filing for every tax situation",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      alt: "Professional working on tax documents",
    },
    {
      title: "Expert Filing",
      description: "ITR filed by India'''s top Tax Experts",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      alt: "Tax expert consulting with client",
    },
    {
      title: "TaxCloud",
      description: "ITR filing software for Tax Experts",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      alt: "Tax software on multiple monitors",
    },
    {
      title: "GST Software",
      description: "G1-G9 filings made 3x faster",
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      alt: "Business meeting about GST compliance",
    },
  ];

  return (
    <section className="py-16 bg-gray-50" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="services-heading">
            India'''s largest tax and financial services platform
          </h2>
          <p className="text-xl text-gray-600" data-testid="services-description">
            Explore our wide range of software solutions
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.title}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              data-testid={`service-card-${index}`}
            >
              <img 
                src={service.image} 
                alt={service.alt}
                className="rounded-lg w-full h-32 object-cover mb-4"
                data-testid={`service-image-${index}`}
              />
              <h3 className="font-bold text-gray-900 mb-2" data-testid={`service-title-${index}`}>
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4" data-testid={`service-description-${index}`}>
                {service.description}
              </p>
              <button 
                className="text-primary font-medium text-sm hover:text-primary/80 transition-colors"
                data-testid={`service-link-${index}`}
              >
                Know more →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
