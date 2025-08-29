import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

interface DashboardStats {
  totalItrForms: number;
  totalGstReturns: number;
  totalTdsReturns: number;
  totalDocuments: number;
  expectedRefund: number;
  recentForms: Array<{
    id: string;
    formType: string;
    status: string;
    filingDate: string;
    refundAmount: string;
  }>;
}

export default function Home() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard-stats"],
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processed":
      case "filed":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8" data-testid="welcome-section">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="welcome-heading">
            Welcome back, {user?.firstName || "User"}!
          </h1>
          <p className="text-gray-600" data-testid="welcome-description">
            Here'''s your tax management dashboard for FY 2024-25
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="quick-stats">
          <Card className="bg-green-50 border-green-200" data-testid="stat-expected-refund">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 mb-1">Expected Refund</p>
                  <p className="text-2xl font-bold text-green-700">
                    ₹{isLoading ? "..." : stats?.expectedRefund?.toLocaleString('en-IN') || "0"}
                  </p>
                </div>
                <i className="fas fa-piggy-bank text-green-600 text-2xl"></i>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200" data-testid="stat-itr-forms">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 mb-1">ITR Forms</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {isLoading ? "..." : stats?.totalItrForms || 0}
                  </p>
                </div>
                <i className="fas fa-file-alt text-blue-600 text-2xl"></i>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200" data-testid="stat-gst-returns">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 mb-1">GST Returns</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {isLoading ? "..." : stats?.totalGstReturns || 0}
                  </p>
                </div>
                <i className="fas fa-receipt text-orange-600 text-2xl"></i>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200" data-testid="stat-documents">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 mb-1">Documents</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {isLoading ? "..." : stats?.totalDocuments || 0}
                  </p>
                </div>
                <i className="fas fa-folder text-purple-600 text-2xl"></i>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Filings */}
          <div className="lg:col-span-2">
            <Card data-testid="recent-filings-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span data-testid="recent-filings-title">Recent Filings</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                    data-testid="button-view-all"
                  >
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse" data-testid={`skeleton-${i}`}>
                        <div className="bg-gray-200 h-16 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : stats?.recentForms?.length ? (
                  <div className="space-y-4">
                    {stats.recentForms.map((form, index) => (
                      <div
                        key={form.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        data-testid={`recent-form-${index}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary/10 p-2 rounded">
                            <i className="fas fa-file-alt text-primary"></i>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900" data-testid={`form-type-${index}`}>
                              {form.formType}
                            </p>
                            <p className="text-sm text-gray-600" data-testid={`filing-date-${index}`}>
                              Filed on {new Date(form.filingDate).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(form.status)} data-testid={`form-status-${index}`}>
                            {form.status}
                          </Badge>
                          {form.refundAmount && (
                            <p className="text-sm text-green-600 mt-1" data-testid={`refund-amount-${index}`}>
                              ₹{parseFloat(form.refundAmount).toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8" data-testid="no-filings">
                    <i className="fas fa-file-alt text-gray-400 text-4xl mb-4"></i>
                    <p className="text-gray-600 mb-4">No filings yet</p>
                    <Button onClick={() => navigate("/itr-filing")} data-testid="button-start-first-filing">
                      Start Your First Filing
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card data-testid="quick-actions-card">
              <CardHeader>
                <CardTitle data-testid="quick-actions-title">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/itr-filing")}
                  data-testid="action-file-itr"
                >
                  <i className="fas fa-file-alt mr-3 text-primary"></i>
                  File ITR
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/gst-management")}
                  data-testid="action-manage-gst"
                >
                  <i className="fas fa-receipt mr-3 text-secondary"></i>
                  Manage GST
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/tds-services")}
                  data-testid="action-tds-services"
                >
                  <i className="fas fa-percentage mr-3 text-green-600"></i>
                  TDS Services
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/experts")}
                  data-testid="action-book-expert"
                >
                  <i className="fas fa-user-tie mr-3 text-purple-600"></i>
                  Book Expert
                </Button>

                <div className="pt-4 border-t" data-testid="document-upload-section">
                  <p className="text-sm text-gray-600 mb-2">Upload Documents</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer" data-testid="upload-area">
                    <i className="fas fa-cloud-upload-alt text-gray-400 text-2xl mb-2"></i>
                    <p className="text-sm text-gray-600">
                      Drop files here or click to upload
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tax Year Progress */}
            <Card className="mt-6" data-testid="tax-year-progress-card">
              <CardHeader>
                <CardTitle data-testid="tax-year-progress-title">Tax Year Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div data-testid="progress-itr">
                    <div className="flex justify-between text-sm mb-2">
                      <span>ITR Filing</span>
                      <span>{stats?.totalItrForms ? "100%" : "0%"}</span>
                    </div>
                    <Progress value={stats?.totalItrForms ? 100 : 0} />
                  </div>
                  
                  <div data-testid="progress-gst">
                    <div className="flex justify-between text-sm mb-2">
                      <span>GST Returns</span>
                      <span>{Math.min((stats?.totalGstReturns || 0) * 25, 100)}%</span>
                    </div>
                    <Progress value={Math.min((stats?.totalGstReturns || 0) * 25, 100)} />
                  </div>
                  
                  <div data-testid="progress-documents">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Document Upload</span>
                      <span>{Math.min((stats?.totalDocuments || 0) * 20, 100)}%</span>
                    </div>
                    <Progress value={Math.min((stats?.totalDocuments || 0) * 20, 100)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
