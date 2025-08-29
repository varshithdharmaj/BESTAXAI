export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Business Owner",
      location: "Mumbai",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200",
      content: "BETTERTAXAI has revolutionized our GST returns with AI automation. Instead of taking 7 to 8 days to do reconciliation, now it's just a matter of minutes. The AI assistant helps us at any given point in time.",
      rating: 5,
      category: "600,000+ businesses trust our SMB offerings"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Group Manager",
      location: "Tech Corp",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200",
      content: "Earlier I used to call multiple customers, track my bank account or check messages for payments. Now I can send UPI links in reminders and customers can pay from home. Compliance is easy.",
      rating: 5,
      category: "Over 1,200 enterprises use our compliance stack"
    },
    {
      id: 3,
      name: "Sunita Patel",
      role: "Tax Payer",
      location: "Kochi, Kerala",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200",
      content: "I have been using BETTERTAXAI's AI-powered e-filing of ITR for last 3 years. I use it for my entire family's income tax returns. Very effective and least time consuming with 100% accuracy.",
      rating: 5,
      category: "Over 5 million tax payers have filed with us"
    },
    {
      id: 4,
      name: "Anil Chakravarthy",
      role: "Tax Suite User",
      location: "CA Practice",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200",
      content: "My executives could learn it so quickly and we implemented literally in a couple of days. I am impressed with time-saving features embedded in the software like advanced reconciliation of 2A data with invoices.",
      rating: 5,
      category: "More than 60,000 tax experts use our platform"
    }
  ];

  return (
    <section className="py-16 bg-white" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="testimonials-heading">
            Trusted by experts and businesses
          </h2>
          <p className="text-xl text-gray-600" data-testid="testimonials-description">
            See what our customers have to say about BETTERTAXAI
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              data-testid={`testimonial-${index}`}
            >
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.image}
                  alt={`${testimonial.name} - ${testimonial.role}`}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                  data-testid={`testimonial-image-${index}`}
                />
                <div>
                  <div className="font-semibold text-gray-900" data-testid={`testimonial-name-${index}`}>
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-sm" data-testid={`testimonial-role-${index}`}>
                    {testimonial.role}, {testimonial.location}
                  </div>
                  <div className="flex items-center mt-1" data-testid={`testimonial-rating-${index}`}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star text-yellow-400 text-sm"></i>
                    ))}
                  </div>
                </div>
              </div>
              
              <blockquote className="text-gray-700 mb-4 italic" data-testid={`testimonial-content-${index}`}>
                "{testimonial.content}"
              </blockquote>
              
              <div className="text-sm text-gray-600 font-medium" data-testid={`testimonial-category-${index}`}>
                {testimonial.category}
              </div>
              
              {index === 0 && (
                <div className="mt-4">
                  <a 
                    href="/sme" 
                    className="text-primary font-medium hover:text-primary/80 text-sm transition-colors"
                    data-testid="testimonial-link-sme"
                  >
                    Explore products for Small Businesses →
                  </a>
                </div>
              )}
              
              {index === 1 && (
                <div className="mt-4">
                  <a 
                    href="/enterprise" 
                    className="text-primary font-medium hover:text-primary/80 text-sm transition-colors"
                    data-testid="testimonial-link-enterprise"
                  >
                    Explore our products for Large Enterprises →
                  </a>
                </div>
              )}
              
              {index === 2 && (
                <div className="mt-4">
                  <a 
                    href="/you" 
                    className="text-primary font-medium hover:text-primary/80 text-sm transition-colors"
                    data-testid="testimonial-link-individuals"
                  >
                    File ITRs yourself or seek expert assistance →
                  </a>
                </div>
              )}
              
              {index === 3 && (
                <div className="mt-4">
                  <a 
                    href="/tax-experts" 
                    className="text-primary font-medium hover:text-primary/80 text-sm transition-colors"
                    data-testid="testimonial-link-experts"
                  >
                    Explore products for tax experts →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Carousel Navigation - Hidden for now but structure ready */}
        <div className="flex justify-center mt-8 space-x-2" data-testid="testimonials-navigation">
          <button 
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
            aria-label="Previous testimonials"
            data-testid="testimonials-prev"
          >
            <i className="fas fa-chevron-left text-gray-600"></i>
          </button>
          <button 
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
            aria-label="Next testimonials"
            data-testid="testimonials-next"
          >
            <i className="fas fa-chevron-right text-gray-600"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
