import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { TdsReturn } from "@/types/schema";

const tdsReturnSchema = z.object({
  tan: z.string().min(10, "Valid TAN is required"),
  quarter: z.string().min(1, "Please select quarter"),
  financialYear: z.string().min(1, "Financial year is required"),
  formType: z.string().min(1, "Please select form type"),
  returnData: z.object({
    totalTdsDeducted: z.number().min(0).default(0),
    totalTdsDeposited: z.number().min(0).default(0),
    totalDeductees: z.number().min(0).default(0),
    totalChallanAmount: z.number().min(0).default(0),
  }),
});

type TdsReturnData = z.infer<typeof tdsReturnSchema>;

export default function TdsServices() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const form = useForm<TdsReturnData>({
    resolver: zodResolver(tdsReturnSchema),
    defaultValues: {
      tan: "",
      quarter: "",
      financialYear: "2024-25",
      formType: "",
      returnData: {
        totalTdsDeducted: 0,
        totalTdsDeposited: 0,
        totalDeductees: 0,
        totalChallanAmount: 0,
      },
    },
  });

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

  const { data: tdsReturns, isLoading: returnsLoading } = useQuery<TdsReturn[]>({
    queryKey: ["/api/tds-returns"],
    enabled: isAuthenticated,
  });

  const createReturnMutation = useMutation({
    mutationFn: async (data: TdsReturnData) => {
      const response = await apiRequest("POST", "/api/tds-returns", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "TDS return created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tds-returns"] });
      form.reset();
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create TDS return",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TdsReturnData) => {
    createReturnMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
        <div className="flex justify-between items-center mb-8" data-testid="header-section">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="page-title">
              TDS Services
            </h1>
            <p className="text-gray-600" data-testid="page-description">
              Manage TDS returns, challans, and compliance
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-return">
                <i className="fas fa-plus mr-2"></i>
                New TDS Return
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" data-testid="create-return-dialog">
              <DialogHeader>
                <DialogTitle data-testid="dialog-title">Create New TDS Return</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TAN Number</FormLabel>
                          <FormControl>
                            <Input placeholder="ABCD12345E" {...field} data-testid="input-tan" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="formType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Form Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-form-type">
                                <SelectValue placeholder="Select form type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="24Q">24Q (TDS on Salary)</SelectItem>
                              <SelectItem value="26Q">26Q (TDS other than Salary)</SelectItem>
                              <SelectItem value="27Q">27Q (TDS on Property)</SelectItem>
                              <SelectItem value="27EQ">27EQ (TCS)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quarter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quarter</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-quarter">
                                <SelectValue placeholder="Select quarter" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Q1">Q1 (Apr-Jun)</SelectItem>
                              <SelectItem value="Q2">Q2 (Jul-Sep)</SelectItem>
                              <SelectItem value="Q3">Q3 (Oct-Dec)</SelectItem>
                              <SelectItem value="Q4">Q4 (Jan-Mar)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="financialYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Financial Year</FormLabel>
                          <FormControl>
                            <Input placeholder="2024-25" {...field} data-testid="input-financial-year" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Return Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="returnData.totalTdsDeducted"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total TDS Deducted</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-tds-deducted"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="returnData.totalTdsDeposited"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total TDS Deposited</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-tds-deposited"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="returnData.totalDeductees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Deductees</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-total-deductees"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="returnData.totalChallanAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Challan Amount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-challan-amount"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createReturnMutation.isPending}
                      data-testid="button-create"
                    >
                      {createReturnMutation.isPending ? "Creating..." : "Create Return"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="returns" className="space-y-6" data-testid="main-tabs">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="returns" data-testid="tab-returns">TDS Returns</TabsTrigger>
            <TabsTrigger value="challans" data-testid="tab-challans">Challans</TabsTrigger>
            <TabsTrigger value="tools" data-testid="tab-tools">Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="returns" className="space-y-6" data-testid="returns-content">
            <Card data-testid="returns-list-card">
              <CardHeader>
                <CardTitle data-testid="returns-list-title">TDS Returns</CardTitle>
              </CardHeader>
              <CardContent>
                {returnsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-20 rounded" data-testid={`skeleton-${i}`} />
                    ))}
                  </div>
                ) : tdsReturns?.length ? (
                  <div className="space-y-4">
                    {tdsReturns.map((tdsReturn, index) => (
                      <div
                        key={tdsReturn.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        data-testid={`return-item-${index}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-100 p-3 rounded-lg">
                            <i className="fas fa-percentage text-green-600 text-xl"></i>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900" data-testid={`return-title-${index}`}>
                              {tdsReturn.formType} - {tdsReturn.quarter} {tdsReturn.financialYear}
                            </h3>
                            <p className="text-sm text-gray-600" data-testid={`return-tan-${index}`}>
                              TAN: {tdsReturn.tan}
                            </p>
                            <p className="text-sm text-gray-600" data-testid={`return-date-${index}`}>
                              {tdsReturn.filingDate 
                                ? `Filed on ${new Date(tdsReturn.filingDate).toLocaleDateString('en-IN')}`
                                : "Draft"
                              }
                            </p>
                            {tdsReturn.token && (
                              <p className="text-xs text-gray-500" data-testid={`return-token-${index}`}>
                                Token: {tdsReturn.token}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(tdsReturn.status)} data-testid={`return-status-${index}`}>
                            {tdsReturn.status}
                          </Badge>
                          {tdsReturn.tdsDeposited && (
                            <p className="text-sm text-green-600 mt-1" data-testid={`return-deposited-${index}`}>
                              Deposited: ₹{parseFloat(tdsReturn.tdsDeposited).toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12" data-testid="no-returns">
                    <i className="fas fa-percentage text-gray-400 text-4xl mb-4"></i>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No TDS returns yet</h3>
                    <p className="text-gray-600 mb-4">Create your first TDS return to get started</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-first">
                      Create First Return
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challans" className="space-y-6" data-testid="challans-content">
            <Card data-testid="challans-card">
              <CardHeader>
                <CardTitle data-testid="challans-title">TDS Challans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12" data-testid="no-challans">
                  <i className="fas fa-receipt text-gray-400 text-4xl mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No challans generated</h3>
                  <p className="text-gray-600 mb-4">Generate challans for TDS deposits</p>
                  <Button variant="outline" data-testid="button-generate-challan">
                    Generate Challan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6" data-testid="tools-content">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card data-testid="tool-calculator">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-calculator text-primary mr-2"></i>
                    TDS Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Calculate TDS on different types of payments</p>
                  <Button variant="outline" className="w-full" data-testid="button-calculator">
                    Open Calculator
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="tool-form16">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-file-alt text-secondary mr-2"></i>
                    Form 16 Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Generate Form 16 for employees</p>
                  <Button variant="outline" className="w-full" data-testid="button-form16">
                    Generate Form 16
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="tool-rates">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-percentage text-green-600 mr-2"></i>
                    TDS Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">View current TDS rates and sections</p>
                  <Button variant="outline" className="w-full" data-testid="button-rates">
                    View Rates
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="tool-certificate">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-certificate text-purple-600 mr-2"></i>
                    TDS Certificate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Download TDS certificates</p>
                  <Button variant="outline" className="w-full" data-testid="button-certificate">
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="tool-reconciliation">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-balance-scale text-yellow-600 mr-2"></i>
                    TDS Reconciliation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Reconcile TDS deducted vs deposited</p>
                  <Button variant="outline" className="w-full" data-testid="button-reconciliation">
                    Start Reconciliation
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="tool-compliance">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-shield-check text-blue-600 mr-2"></i>
                    Compliance Check
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Check TDS compliance status</p>
                  <Button variant="outline" className="w-full" data-testid="button-compliance">
                    Check Compliance
                  </Button>
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
