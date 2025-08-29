import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";

export default function HeroSection() {
  return (
    <section className="gradient-hero py-16" data-testid="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium" data-testid="refund-processed-badge">
              ₹294.39 Cr Refund processed this year
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6" data-testid="hero-heading">
            Get Maximum <span className="text-primary">Tax Refund</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto" data-testid="hero-description">
            India's most advanced AI-powered tax assistant. File ITR in 3 minutes with 100% accuracy, get expert help, or use our revolutionary AI tax tools.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 glass-card" data-testid="ai-filing-card">
              <div className="flex items-center mb-4">
                <Logo size="md" showText={false} className="mr-3" />
                <span className="font-semibold" data-testid="ai-filing-title">AI-Powered Filing</span>
              </div>
              <p className="text-gray-600 mb-4" data-testid="ai-filing-description">Self ITR filing with 100% accuracy</p>
              <Button 
                className="w-full bg-primary text-white hover:bg-primary/90"
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-file-now"
              >
                File Now
              </Button>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 glass-card" data-testid="expert-support-card">
              <div className="flex items-center mb-4">
                <i className="fas fa-user-tie text-secondary text-2xl mr-3"></i>
                <span className="font-semibold" data-testid="expert-support-title">Expert Support</span>
              </div>
              <p className="text-gray-600 mb-4" data-testid="expert-support-description">ITR filed by experts in 24 hours</p>
              <Button 
                className="w-full bg-secondary text-white hover:bg-secondary/90"
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-book-expert"
              >
                Book Expert
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600" data-testid="hero-stats">
            <div className="flex items-center" data-testid="rating-stat">
              <i className="fas fa-star text-yellow-400 mr-1"></i>
              <span>4.9/5 • 45K+ Reviews</span>
            </div>
            <div data-testid="refunds-delivered-stat">₹1,050 Cr+ Refunds delivered</div>
            <div data-testid="users-trust-stat">7.5M+ Users Trust Us</div>
          </div>
        </div>
      </div>
    </section>
  );
}
