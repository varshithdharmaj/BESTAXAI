import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServicesGrid from "@/components/services-grid";
import StatsSection from "@/components/stats-section";
import UserTypes from "@/components/user-types";
import FeaturesSection from "@/components/features-section";
import TestimonialsSection from "@/components/testimonials";
import Footer from "@/components/footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      
      {/* AI Assistant Section */}
      <section className="py-16 bg-white" data-testid="section-ai-assistant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="heading-ai-assistant">
              India'''s first AI-powered Tax GPT Assistant
            </h2>
            <p className="text-xl text-gray-600" data-testid="text-ai-description">
              Just chat, file, and get your maximum refund – guaranteed.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl" data-testid="chat-interface">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-white text-sm">👋 Hi! I'''m your Tax Assistant. Upload your Form-16 or salary slips to get started.</p>
                  </div>
                  <div className="bg-primary rounded-lg p-3 ml-8">
                    <p className="text-white text-sm">I uploaded my Form-16. Can you help me file my ITR?</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-white text-sm">Perfect! I'''ve analyzed your Form-16. You'''re eligible for ₹18,450 refund. Shall I proceed with filing?</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4" data-testid="feature-document-processing">
                <div className="bg-primary/10 p-3 rounded-full">
                  <i className="fas fa-upload text-primary"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Smart Document Processing</h3>
                  <p className="text-gray-600">Upload Form-16, bank statements, or investment proofs. Our AI extracts all data automatically.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4" data-testid="feature-refund-calculation">
                <div className="bg-secondary/10 p-3 rounded-full">
                  <i className="fas fa-calculator text-secondary"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Maximum Refund Calculation</h3>
                  <p className="text-gray-600">AI identifies all eligible deductions and calculates your maximum possible refund.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4" data-testid="feature-instant-filing">
                <div className="bg-green-100 p-3 rounded-full">
                  <i className="fas fa-rocket text-green-600"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Instant Filing</h3>
                  <p className="text-gray-600">File your ITR in under 3 minutes with pre-filled forms and e-verification.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesGrid />
      <StatsSection />
      <UserTypes />
      <FeaturesSection />

      {/* ITR Filing Services Section */}
      <section className="py-16 bg-gray-50" data-testid="section-itr-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="heading-itr-services">
              Looking for ITR filing Services?
            </h2>
            <p className="text-xl text-gray-600" data-testid="text-itr-services-description">
              India'''s best tax experts at your service for a tailored, accurate and premium tax filing experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg" data-testid="service-itr-filing">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mb-6 flex items-center justify-center">
                <i className="fas fa-file-alt text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">ITR Filing Assistance</h3>
              <p className="text-gray-600 mb-6">Get Expert assistance in tax filing for Salaried and self-employed individuals, NRIs, Capital gains, and more.</p>
              <button className="text-primary font-medium hover:text-primary/80 transition-colors" data-testid="button-learn-more-itr">
                Learn more →
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg" data-testid="service-tds-property">
              <div className="bg-secondary/10 p-4 rounded-full w-16 h-16 mb-6 flex items-center justify-center">
                <i className="fas fa-home text-secondary text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">TDS on Sale of Property</h3>
              <p className="text-gray-600 mb-6">Hassle-free 26QB compliance on sale of property</p>
              <button className="text-primary font-medium hover:text-primary/80 transition-colors" data-testid="button-learn-more-tds">
                Learn more →
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg" data-testid="service-legal">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mb-6 flex items-center justify-center">
                <i className="fas fa-gavel text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Legal Services</h3>
              <p className="text-gray-600 mb-6">For drafting and review of legal documents such as Sale deed, Vendor agreement, Co-founders agreement etc</p>
              <button className="text-primary font-medium hover:text-primary/80 transition-colors" data-testid="button-learn-more-legal">
                Learn more →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-16 bg-white" data-testid="section-dashboard-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="heading-dashboard">
              Powerful Dashboard for All Your Tax Needs
            </h2>
            <p className="text-xl text-gray-600" data-testid="text-dashboard-description">
              Manage your filings, track refunds, and access expert help all in one place
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-2xl p-8 shadow-xl" data-testid="dashboard-preview">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-primary text-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold" data-testid="dashboard-header">Tax Dashboard</h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <span data-testid="financial-year">FY 2024-25</span>
                    <div className="w-8 h-8 bg-primary/70 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-green-50 p-4 rounded-lg" data-testid="stat-expected-refund">
                    <div className="text-2xl font-bold text-green-600 mb-1">₹18,450</div>
                    <div className="text-sm text-gray-600">Expected Refund</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg" data-testid="stat-returns-filed">
                    <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
                    <div className="text-sm text-gray-600">Returns Filed</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg" data-testid="stat-tax-saved">
                    <div className="text-2xl font-bold text-orange-600 mb-1">₹1,50,000</div>
                    <div className="text-sm text-gray-600">Tax Saved</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg" data-testid="stat-documents">
                    <div className="text-2xl font-bold text-purple-600 mb-1">5</div>
                    <div className="text-sm text-gray-600">Documents</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div data-testid="recent-filings">
                    <h4 className="font-semibold text-gray-900 mb-4">Recent Filings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-testid="filing-itr-2023">
                        <div>
                          <div className="font-medium text-gray-900">ITR-1 FY 2023-24</div>
                          <div className="text-sm text-gray-600">Submitted on 15 Jul 2024</div>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Processed</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-testid="filing-gst-march">
                        <div>
                          <div className="font-medium text-gray-900">GST Return Mar 2024</div>
                          <div className="text-sm text-gray-600">Submitted on 20 Apr 2024</div>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Filed</span>
                      </div>
                    </div>
                  </div>
                  
                  <div data-testid="quick-actions">
                    <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center" data-testid="action-upload-documents">
                        <i className="fas fa-upload text-primary mb-2 block"></i>
                        <div className="text-sm font-medium">Upload Documents</div>
                      </button>
                      <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center" data-testid="action-tax-calculator">
                        <i className="fas fa-calculator text-secondary mb-2 block"></i>
                        <div className="text-sm font-medium">Tax Calculator</div>
                      </button>
                      <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center" data-testid="action-book-expert">
                        <i className="fas fa-user-tie text-green-600 mb-2 block"></i>
                        <div className="text-sm font-medium">Book Expert</div>
                      </button>
                      <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center" data-testid="action-reports">
                        <i className="fas fa-chart-bar text-purple-600 mb-2 block"></i>
                        <div className="text-sm font-medium">Reports</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 bg-gray-900 text-white" data-testid="section-security">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-security">Committed to security</h2>
            <p className="text-xl text-gray-300" data-testid="text-security-description">
              We value your data as if it were ours. All our certifications and licenses were awarded after rigorous scrutiny.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="security-encryption">
              <div className="bg-primary p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <i className="fas fa-lock text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Encryption</h3>
              <p className="text-gray-300">Your data is transmitted across SSL certified pathways. We are SOC 2 compliant.</p>
            </div>
            
            <div className="text-center" data-testid="security-privacy">
              <div className="bg-secondary p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <i className="fas fa-user-shield text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Privacy</h3>
              <p className="text-gray-300">We do not share your or your clients''' data with unaffiliated third parties for their own purposes.</p>
            </div>
            
            <div className="text-center" data-testid="security-storage">
              <div className="bg-green-600 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <i className="fas fa-database text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Data Storage</h3>
              <p className="text-gray-300">We use ISO 27001 certified data centres, which are quarterly VAPT tested and externally audited.</p>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-16 gradient-cta text-white" data-testid="section-cta">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="heading-cta">
            Ready to get your maximum tax refund?
          </h2>
          <p className="text-xl mb-8 text-white/90" data-testid="text-cta-description">
            Join 7.5M+ users who trust BETTERTAXAI for their AI-powered tax filing needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              data-testid="button-start-filing"
              onClick={() => window.location.href = '/api/login'}
            >
              Start Filing Now
            </button>
            <button 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-colors"
              data-testid="button-talk-expert"
              onClick={() => window.location.href = '/api/login'}
            >
              Talk to Expert
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
