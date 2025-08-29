import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Receipt, Percent, Upload, Calculator, Bus, BarChart } from "lucide-react";
import type { ItrForm, GstReturn, TdsReturn, Document } from "@shared/schema";

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

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard-stats"],
    enabled: isAuthenticated,
  });

  const { data: itrForms, isLoading: itrLoading } = useQuery<ItrForm[]>({
    queryKey: ["/api/itr-forms"],
    enabled: isAuthenticated,
  });

  const { data: gstReturns, isLoading: gstLoading } = useQuery<GstReturn[]>({
    queryKey: ["/api/gst-returns"],
    enabled: isAuthenticated,
  });

  const { data: tdsReturns, isLoading: tdsLoading } = useQuery<TdsReturn[]>({
    queryKey: ["/api/tds-returns"],
    enabled: isAuthenticated,
  });

  const { data: documents, isLoading: documentsLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    enabled: isAuthenticated,
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

  const getCompletionPercentage = () => {
    const totalTasks = 4; // ITR, GST, TDS, Documents
    let completed = 0;
    
    if (stats?.totalItrForms && stats.totalItrForms > 0) completed++;
    if (stats?.totalGstReturns && stats.totalGstReturns > 0) completed++;
    if (stats?.totalTdsReturns && stats.totalTdsReturns > 0) completed++;
    if (stats?.totalDocuments && stats.totalDocuments > 0) completed++;
    
    return (completed / totalTasks) * 100;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8" data-testid="dashboard-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="dashboard-title">
                Tax Dashboard
              </h1>
              <p className="text-gray-600" data-testid="dashboard-subtitle">
                Welcome back, {user?.firstName}! Here'''s your tax management overview for FY 2024-25
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button 
                onClick={() => navigate("/itr-filing")}
                className="bg-primary hover:bg-primary/90"
                data-testid="button-quick-file"
              >
                <FileText className="w-4 h-4 mr-2" />
                Quick File ITR
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="stats-grid">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200" data-testid="stat-expected-refund">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 mb-1 font-medium">Expected Refund</p>
                  <p className="text-3xl font-bold text-green-700">
                    ₹{statsLoading ? "..." : stats?.expectedRefund?.toLocaleString('en-IN') || "0"}
                  </p>
                  <p className="text-xs text-green-600 mt-1">This financial year</p>
                </div>
                <div className="bg-green-200 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" data-testid="stat-itr-forms">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 mb-1 font-medium">ITR Forms Filed</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {statsLoading ? "..." : stats?.totalItrForms || 0}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Income tax returns</p>
                </div>
                <div className="bg-blue-200 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200" data-testid="stat-gst-returns">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 mb-1 font-medium">GST Returns</p>
                  <p className="text-3xl font-bold text-orange-700">
                    {statsLoading ? "..." : stats?.totalGstReturns || 0}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">Filed this year</p>
                </div>
                <div className="bg-orange-200 p-3 rounded-full">
                  <Receipt className="h-6 w-6 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" data-testid="stat-documents">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 mb-1 font-medium">Documents</p>
                  <p className="text-3xl font-bold text-purple-700">
                    {statsLoading ? "..." : stats?.totalDocuments || 0}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">Uploaded & verified</p>
                </div>
                <div className="bg-purple-200 p-3 rounded-full">
                  <Upload className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tax Year Progress */}
        <Card className="mb-8" data-testid="tax-year-progress">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="w-5 h-5 mr-2" />
              Tax Year 2024-25 Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                <span className="text-sm text-gray-600">{Math.round(getCompletionPercentage())}%</span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-3" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center" data-testid="progress-itr">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    stats?.totalItrForms ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <FileText className={`w-6 h-6 ${stats?.totalItrForms ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-xs font-medium text-gray-700">ITR Filing</p>
                  <p className="text-xs text-gray-500">
                    {stats?.totalItrForms ? 'Completed' : 'Pending'}
                  </p>
                </div>
                
                <div className="text-center" data-testid="progress-gst">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    stats?.totalGstReturns ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Receipt className={`w-6 h-6 ${stats?.totalGstReturns ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-xs font-medium text-gray-700">GST Returns</p>
                  <p className="text-xs text-gray-500">
                    {stats?.totalGstReturns ? 'Updated' : 'Pending'}
                  </p>
                </div>
                
                <div className="text-center" data-testid="progress-tds">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    stats?.totalTdsReturns ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Percent className={`w-6 h-6 ${stats?.totalTdsReturns ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-xs font-medium text-gray-700">TDS Returns</p>
                  <p className="text-xs text-gray-500">
                    {stats?.totalTdsReturns ? 'Filed' : 'Pending'}
                  </p>
                </div>
                
                <div className="text-center" data-testid="progress-docs">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    stats?.totalDocuments ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Upload className={`w-6 h-6 ${stats?.totalDocuments ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-xs font-medium text-gray-700">Documents</p>
                  <p className="text-xs text-gray-500">
                    {stats?.totalDocuments ? 'Uploaded' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6" data-testid="dashboard-tabs">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="filings" data-testid="tab-filings">Filings</TabsTrigger>
            <TabsTrigger value="documents" data-testid="tab-documents">Documents</TabsTrigger>
            <TabsTrigger value="tools" data-testid="tab-tools">Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6" data-testid="overview-content">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card data-testid="recent-activity">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse bg-gray-200 h-16 rounded" />
                        ))}
                      </div>
                    ) : stats?.recentForms?.length ? (
                      <div className="space-y-4">
                        {stats.recentForms.map((form, index) => (
                          <div
                            key={form.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            data-testid={`activity-item-${index}`}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="bg-primary/10 p-2 rounded">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{form.formType}</p>
                                <p className="text-sm text-gray-600">
                                  {form.filingDate 
                                    ? `Filed on ${new Date(form.filingDate).toLocaleDateString('en-IN')}`
                                    : "Draft"
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(form.status)}>
                                {form.status}
                              </Badge>
                              {form.refundAmount && (
                                <p className="text-sm text-green-600 mt-1">
                                  ₹{parseFloat(form.refundAmount).toLocaleString('en-IN')}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8" data-testid="no-activity">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-4">No recent activity</p>
                        <Button onClick={() => navigate("/itr-filing")}>
                          Start Filing
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card data-testid="quick-actions">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate("/itr-filing")}
                      data-testid="action-file-itr"
                    >
                      <FileText className="mr-3 h-4 w-4 text-primary" />
                      File ITR
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate("/gst-management")}
                      data-testid="action-manage-gst"
                    >
                      <Receipt className="mr-3 h-4 w-4 text-secondary" />
                      Manage GST
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate("/tds-services")}
                      data-testid="action-tds-services"
                    >
                      <Percent className="mr-3 h-4 w-4 text-green-600" />
                      TDS Services
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate("/experts")}
                      data-testid="action-book-expert"
                    >
                      <Bus className="mr-3 h-4 w-4 text-purple-600" />
                      Book Expert
                    </Button>

                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full justify-start" data-testid="action-calculator">
                        <Calculator className="mr-3 h-4 w-4 text-blue-600" />
                        Tax Calculator
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="filings" className="space-y-6" data-testid="filings-content">
            <div className="grid md:grid-cols-3 gap-6">
              <Card data-testid="itr-filings">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    ITR Filings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary mb-2">
                    {itrLoading ? "..." : itrForms?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">Total filings this year</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate("/itr-filing")}
                    data-testid="button-view-itr"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="gst-filings">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Receipt className="w-5 h-5 mr-2" />
                    GST Returns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-secondary mb-2">
                    {gstLoading ? "..." : gstReturns?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">Returns filed</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate("/gst-management")}
                    data-testid="button-view-gst"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="tds-filings">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Percent className="w-5 h-5 mr-2" />
                    TDS Returns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600 mb-2">
                    {tdsLoading ? "..." : tdsReturns?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">Returns submitted</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate("/tds-services")}
                    data-testid="button-view-tds"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6" data-testid="documents-content">
            <Card data-testid="documents-overview">
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Upload Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Documents</span>
                        <span className="font-medium">
                          {documentsLoading ? "..." : documents?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Form 16 Documents</span>
                        <span className="font-medium">
                          {documentsLoading ? "..." : documents?.filter(d => d.fileType === 'form16').length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Investment Proofs</span>
                        <span className="font-medium">
                          {documentsLoading ? "..." : documents?.filter(d => d.fileType === 'investment-proof').length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer" data-testid="upload-area">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      Drop files here or click to upload
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6" data-testid="tools-content">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="tool-calculator">
                <CardContent className="p-6 text-center">
                  <Calculator className="mx-auto h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Tax Calculator</h3>
                  <p className="text-sm text-gray-600 mb-4">Calculate your tax liability and savings</p>
                  <Button variant="outline" size="sm">Open Calculator</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="tool-planner">
                <CardContent className="p-6 text-center">
                  <BarChart className="mx-auto h-8 w-8 text-green-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Tax Planner</h3>
                  <p className="text-sm text-gray-600 mb-4">Plan your investments for maximum savings</p>
                  <Button variant="outline" size="sm">Start Planning</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="tool-tracker">
                <CardContent className="p-6 text-center">
                  <Calendar className="mx-auto h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Refund Tracker</h3>
                  <p className="text-sm text-gray-600 mb-4">Track your tax refund status</p>
                  <Button variant="outline" size="sm">Track Refund</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
