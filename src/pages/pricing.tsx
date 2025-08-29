import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PricingPlan } from "@/types/schema";

export default function Pricing() {
  const { data: pricingPlans, isLoading } = useQuery<PricingPlan[]>({
    queryKey: ["/api/pricing-plans"],
  });

  const handleSubscribe = (plan: PricingPlan) => {
    // In a real app, this would integrate with payment system
    window.location.href = "/api/login";
  };

  // Mock data for comprehensive display since we don't have seeded data
  const mockPlans = [
    {
      id: "individual-basic",
      name: "Individual Basic",
      userType: "individual",
      price: "0",
      features: [
        "Self ITR-1 filing",
        "Basic tax calculator",
        "Form 16 upload",
        "E-verification support",
        "Email support"
      ],
      isPopular: false,
      stripePriceId: null,
      active: true
    },
    {
      id: "individual-premium",
      name: "Individual Premium", 
      userType: "individual",
      price: "1299",
      features: [
        "All ITR forms (1-4)",
        "Expert review included",
        "Capital gains support",
        "Investment optimization",
        "Priority support",
        "Refund tracking",
        "Previous year data import"
      ],
      isPopular: true,
      stripePriceId: "price_premium",
      active: true
    },
    {
      id: "expert-pro",
      name: "Expert Pro",
      userType: "expert", 
      price: "4999",
      features: [
        "TaxCloud software access",
        "Unlimited client filings",
        "Bulk data upload",
        "Advanced reconciliation",
        "Client management dashboard",
        "WhatsApp integration",
        "Training & certification"
      ],
      isPopular: false,
      stripePriceId: "price_expert",
      active: true
    },
    {
      id: "sme-standard",
      name: "SME Standard",
      userType: "sme",
      price: "9999", 
      features: [
        "GST returns (GSTR 1-9)",
        "TDS returns filing",
        "Invoice management",
        "Basic reconciliation",
        "Compliance alerts",
        "Monthly reports",
        "Phone support"
      ],
      isPopular: false,
      stripePriceId: "price_sme",
      active: true
    },
    {
      id: "enterprise-custom",
      name: "Enterprise Custom",
      userType: "enterprise",
      price: "Custom",
      features: [
        "Complete tax suite",
        "E-invoicing integration",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 priority support",
        "On-premise deployment option",
        "Custom training"
      ],
      isPopular: false,
      stripePriceId: null,
      active: true
    }
  ];

  const displayPlans = pricingPlans?.length ? pricingPlans : mockPlans;

  const getPlanColor = (userType: string) => {
    switch (userType) {
      case "individual":
        return "border-primary";
      case "expert":
        return "border-secondary";
      case "sme":
        return "border-green-500";
      case "enterprise":
        return "border-purple-500";
      default:
        return "border-gray-200";
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case "individual":
        return "For Individuals";
      case "expert":
        return "For Tax Experts";
      case "sme":
        return "For SMEs";
      case "enterprise":
        return "For Enterprise";
      default:
        return userType;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12" data-testid="header-section">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="page-title">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8" data-testid="page-description">
            Choose the plan that fits your tax filing needs
          </p>
          
          <div className="bg-green-100 text-green-800 px-6 py-3 rounded-full inline-block" data-testid="refund-guarantee">
            <i className="fas fa-shield-check mr-2"></i>
            100% Maximum Refund Guarantee
          </div>
        </div>

        {/* Pricing Cards */}
        {isLoading ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse" data-testid={`pricing-skeleton-${i}`}>
                <div className="bg-white h-96 rounded-2xl shadow-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {displayPlans.map((plan, index) => (
              <Card 
                key={plan.id || index}
                className={`relative ${getPlanColor(plan.userType)} ${plan.isPopular ? 'ring-2 ring-primary' : ''} hover:shadow-xl transition-shadow`}
                data-testid={`pricing-plan-${index}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1" data-testid={`popular-badge-${index}`}>
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs" data-testid={`user-type-${index}`}>
                      {getUserTypeLabel(plan.userType)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2" data-testid={`plan-name-${index}`}>
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    {plan.price === "Custom" ? (
                      <div className="text-3xl font-bold text-gray-900" data-testid={`plan-price-${index}`}>
                        Custom
                      </div>
                    ) : plan.price === "0" ? (
                      <div data-testid={`plan-price-${index}`}>
                        <div className="text-3xl font-bold text-gray-900">Free</div>
                      </div>
                    ) : (
                      <div data-testid={`plan-price-${index}`}>
                        <div className="text-3xl font-bold text-gray-900">
                          ₹{parseFloat(plan.price).toLocaleString('en-IN')}
                        </div>
                        <div className="text-sm text-gray-600">per year</div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {(plan.features as string[]).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start" data-testid={`feature-${index}-${featureIndex}`}>
                        <i className="fas fa-check text-green-500 mr-3 mt-0.5 text-sm"></i>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full ${plan.isPopular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.isPopular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan as PricingPlan)}
                    data-testid={`subscribe-button-${index}`}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : plan.price === "0" ? "Get Started" : "Subscribe Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Features Comparison */}
        <div className="mt-16" data-testid="features-comparison">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8" data-testid="comparison-title">
            Feature Comparison
          </h2>
          
          <Card data-testid="comparison-table">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-900">Features</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Basic</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Premium</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Expert</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { feature: "ITR-1 Filing", basic: true, premium: true, expert: true, enterprise: true },
                      { feature: "All ITR Forms", basic: false, premium: true, expert: true, enterprise: true },
                      { feature: "Expert Review", basic: false, premium: true, expert: true, enterprise: true },
                      { feature: "GST Returns", basic: false, premium: false, expert: true, enterprise: true },
                      { feature: "TDS Returns", basic: false, premium: false, expert: true, enterprise: true },
                      { feature: "Bulk Processing", basic: false, premium: false, expert: true, enterprise: true },
                      { feature: "API Integration", basic: false, premium: false, expert: false, enterprise: true },
                      { feature: "Dedicated Support", basic: false, premium: false, expert: false, enterprise: true },
                    ].map((row, rowIndex) => (
                      <tr key={rowIndex} data-testid={`comparison-row-${rowIndex}`}>
                        <td className="p-4 font-medium text-gray-900">{row.feature}</td>
                        <td className="text-center p-4">
                          {row.basic ? (
                            <i className="fas fa-check text-green-500"></i>
                          ) : (
                            <i className="fas fa-times text-gray-300"></i>
                          )}
                        </td>
                        <td className="text-center p-4">
                          {row.premium ? (
                            <i className="fas fa-check text-green-500"></i>
                          ) : (
                            <i className="fas fa-times text-gray-300"></i>
                          )}
                        </td>
                        <td className="text-center p-4">
                          {row.expert ? (
                            <i className="fas fa-check text-green-500"></i>
                          ) : (
                            <i className="fas fa-times text-gray-300"></i>
                          )}
                        </td>
                        <td className="text-center p-4">
                          {row.enterprise ? (
                            <i className="fas fa-check text-green-500"></i>
                          ) : (
                            <i className="fas fa-times text-gray-300"></i>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16" data-testid="faq-section">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8" data-testid="faq-title">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: "What is included in the premium plan?",
                answer: "Premium plan includes filing of all ITR forms, expert review, capital gains support, investment optimization, and priority support."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 100% maximum refund guarantee. If you don't get the maximum eligible refund, we'll refund the difference."
              },
              {
                question: "Can I upgrade my plan anytime?",
                answer: "Yes, you can upgrade your plan at any time. The price difference will be prorated for the remaining period."
              },
              {
                question: "Is my data secure?",
                answer: "Absolutely. We use bank-grade security with 256-bit SSL encryption and are ISO 27001 certified for data protection."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets."
              },
              {
                question: "Do you provide customer support?",
                answer: "Yes, we provide email support for basic plans, phone support for premium plans, and 24/7 dedicated support for enterprise clients."
              }
            ].map((faq, index) => (
              <Card key={index} data-testid={`faq-${index}`}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2" data-testid={`faq-question-${index}`}>
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 text-sm" data-testid={`faq-answer-${index}`}>
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center" data-testid="cta-section">
          <Card className="gradient-cta text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4" data-testid="cta-title">
                Ready to get started?
              </h2>
              <p className="text-xl mb-8 text-white/90" data-testid="cta-description">
                Join millions of Indians who trust BETTERTAXAI for their AI-powered tax filing needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="cta-start-free"
                >
                  Start for Free
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="cta-contact-sales"
                >
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
