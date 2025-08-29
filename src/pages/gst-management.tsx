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
import type { GstReturn } from "@/types/schema";

const gstReturnSchema = z.object({
  gstin: z.string().min(15, "Valid GSTIN is required"),
  returnType: z.string().min(1, "Please select return type"),
  period: z.string().min(1, "Period is required"),
  returnData: z.object({
    outwardSupplies: z.number().min(0).default(0),
    inwardSupplies: z.number().min(0).default(0),
    igst: z.number().min(0).default(0),
    cgst: z.number().min(0).default(0),
    sgst: z.number().min(0).default(0),
    cess: z.number().min(0).default(0),
  }),
});

type GstReturnData = z.infer<typeof gstReturnSchema>;

export default function GstManagement() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const form = useForm<GstReturnData>({
    resolver: zodResolver(gstReturnSchema),
    defaultValues: {
      gstin: "",
      returnType: "",
      period: "",
      returnData: {
        outwardSupplies: 0,
        inwardSupplies: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        cess: 0,
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

  const { data: gstReturns, isLoading: returnsLoading } = useQuery<GstReturn[]>({
    queryKey: ["/api/gst-returns"],
    enabled: isAuthenticated,
  });

  const createReturnMutation = useMutation({
    mutationFn: async (data: GstReturnData) => {
      const response = await apiRequest("POST", "/api/gst-returns", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "GST return created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/gst-returns"] });
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
        description: "Failed to create GST return",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GstReturnData) => {
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

  const calculateTotalTax = () => {
    const data = form.watch("returnData");
    return data.igst + data.cgst + data.sgst + data.cess;
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
              GST Management
            </h1>
            <p className="text-gray-600" data-testid="page-description">
              Manage your GST returns and compliance
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-return">
                <i className="fas fa-plus mr-2"></i>
                New GST Return
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" data-testid="create-return-dialog">
              <DialogHeader>
                <DialogTitle data-testid="dialog-title">Create New GST Return</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gstin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GSTIN</FormLabel>
                          <FormControl>
                            <Input placeholder="07ABCDE1234F1Z5" {...field} data-testid="input-gstin" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="returnType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Return Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-return-type">
                                <SelectValue placeholder="Select return type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="GSTR-1">GSTR-1 (Outward Supplies)</SelectItem>
                              <SelectItem value="GSTR-3B">GSTR-3B (Monthly Return)</SelectItem>
                              <SelectItem value="GSTR-2A">GSTR-2A (Auto-drafted ITC)</SelectItem>
                              <SelectItem value="GSTR-9">GSTR-9 (Annual Return)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="period"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Period (MM-YYYY)</FormLabel>
                          <FormControl>
                            <Input placeholder="12-2024" {...field} data-testid="input-period" />
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
                        name="returnData.outwardSupplies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Outward Supplies</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-outward-supplies"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="returnData.inwardSupplies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Inward Supplies</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-inward-supplies"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="returnData.igst"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IGST</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-igst"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="returnData.cgst"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CGST</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-cgst"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="returnData.sgst"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SGST</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-sgst"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="returnData.cess"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cess</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-cess"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg" data-testid="tax-summary">
                      <p className="font-semibold text-blue-900">
                        Total Tax: ₹{calculateTotalTax().toLocaleString('en-IN')}
                      </p>
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

        {/* GST Returns List */}
        <Card data-testid="returns-list-card">
          <CardHeader>
            <CardTitle data-testid="returns-list-title">GST Returns</CardTitle>
          </CardHeader>
          <CardContent>
            {returnsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 h-20 rounded" data-testid={`skeleton-${i}`} />
                ))}
              </div>
            ) : gstReturns?.length ? (
              <div className="space-y-4">
                {gstReturns.map((gstReturn, index) => (
                  <div
                    key={gstReturn.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    data-testid={`return-item-${index}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-secondary/10 p-3 rounded-lg">
                        <i className="fas fa-receipt text-secondary text-xl"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900" data-testid={`return-title-${index}`}>
                          {gstReturn.returnType} - {gstReturn.period}
                        </h3>
                        <p className="text-sm text-gray-600" data-testid={`return-gstin-${index}`}>
                          GSTIN: {gstReturn.gstin}
                        </p>
                        <p className="text-sm text-gray-600" data-testid={`return-date-${index}`}>
                          {gstReturn.filingDate 
                            ? `Filed on ${new Date(gstReturn.filingDate).toLocaleDateString('en-IN')}`
                            : "Draft"
                          }
                        </p>
                        {gstReturn.arn && (
                          <p className="text-xs text-gray-500" data-testid={`return-arn-${index}`}>
                            ARN: {gstReturn.arn}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(gstReturn.status)} data-testid={`return-status-${index}`}>
                        {gstReturn.status}
                      </Badge>
                      {gstReturn.taxLiability && (
                        <p className="text-sm text-orange-600 mt-1" data-testid={`return-tax-${index}`}>
                          Tax: ₹{parseFloat(gstReturn.taxLiability).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12" data-testid="no-returns">
                <i className="fas fa-receipt text-gray-400 text-4xl mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No GST returns yet</h3>
                <p className="text-gray-600 mb-4">Create your first GST return to get started</p>
                <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-first">
                  Create First Return
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Tools */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card data-testid="quick-tools-calculator">
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-calculator text-primary mr-2"></i>
                GST Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Calculate GST on your transactions</p>
              <Button variant="outline" className="w-full" data-testid="button-calculator">
                Open Calculator
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="quick-tools-reconciliation">
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-balance-scale text-secondary mr-2"></i>
                Reconciliation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Match invoices with 2A/2B data</p>
              <Button variant="outline" className="w-full" data-testid="button-reconciliation">
                Start Reconciliation
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="quick-tools-compliance">
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-shield-check text-green-600 mr-2"></i>
                Compliance Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Verify GST compliance status</p>
              <Button variant="outline" className="w-full" data-testid="button-compliance">
                Check Compliance
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
