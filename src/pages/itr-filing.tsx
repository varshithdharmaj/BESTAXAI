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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ItrForm } from "@/types/schema";

const itrFormSchema = z.object({
  formType: z.string().min(1, "Please select ITR form type"),
  assessmentYear: z.string().min(1, "Assessment year is required"),
  financialYear: z.string().min(1, "Financial year is required"),
  formData: z.object({
    personalInfo: z.object({
      pan: z.string().min(10, "Valid PAN is required"),
      aadhaar: z.string().optional(),
      mobile: z.string().min(10, "Valid mobile number is required"),
      email: z.string().email("Valid email is required"),
    }),
    income: z.object({
      salary: z.number().min(0).default(0),
      houseProperty: z.number().min(0).default(0),
      capitalGains: z.number().min(0).default(0),
      otherSources: z.number().min(0).default(0),
    }),
    deductions: z.object({
      section80C: z.number().min(0).default(0),
      section80D: z.number().min(0).default(0),
      otherDeductions: z.number().min(0).default(0),
    }),
  }),
});

type ItrFormData = z.infer<typeof itrFormSchema>;

export default function ItrFiling() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFormType, setSelectedFormType] = useState("");

  const form = useForm<ItrFormData>({
    resolver: zodResolver(itrFormSchema),
    defaultValues: {
      assessmentYear: "2025-26",
      financialYear: "2024-25",
      formData: {
        personalInfo: {
          pan: "",
          aadhaar: "",
          mobile: "",
          email: "",
        },
        income: {
          salary: 0,
          houseProperty: 0,
          capitalGains: 0,
          otherSources: 0,
        },
        deductions: {
          section80C: 0,
          section80D: 0,
          otherDeductions: 0,
        },
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

  const { data: itrForms, isLoading: formsLoading } = useQuery<ItrForm[]>({
    queryKey: ["/api/itr-forms"],
    enabled: isAuthenticated,
  });

  const createFormMutation = useMutation({
    mutationFn: async (data: ItrFormData) => {
      const response = await apiRequest("POST", "/api/itr-forms", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "ITR form created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/itr-forms"] });
      form.reset();
      setCurrentStep(1);
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
        description: "Failed to create ITR form",
        variant: "destructive",
      });
    },
  });

  const updateFormMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ItrFormData> }) => {
      const response = await apiRequest("PUT", `/api/itr-forms/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "ITR form updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/itr-forms"] });
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
        description: "Failed to update ITR form",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ItrFormData) => {
    createFormMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "filed":
      case "processed":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateTotalIncome = () => {
    const income = form.watch("formData.income");
    return income.salary + income.houseProperty + income.capitalGains + income.otherSources;
  };

  const calculateTotalDeductions = () => {
    const deductions = form.watch("formData.deductions");
    return deductions.section80C + deductions.section80D + deductions.otherDeductions;
  };

  const calculateTaxableIncome = () => {
    return Math.max(0, calculateTotalIncome() - calculateTotalDeductions());
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
        <div className="mb-8" data-testid="header-section">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="page-title">
            ITR Filing
          </h1>
          <p className="text-gray-600" data-testid="page-description">
            File your Income Tax Return quickly and accurately for FY 2024-25
          </p>
        </div>

        <Tabs defaultValue="file-new" className="space-y-6" data-testid="main-tabs">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file-new" data-testid="tab-file-new">File New ITR</TabsTrigger>
            <TabsTrigger value="my-returns" data-testid="tab-my-returns">My Returns</TabsTrigger>
          </TabsList>

          <TabsContent value="file-new" className="space-y-6" data-testid="file-new-content">
            {/* ITR Form Selection */}
            <Card data-testid="form-selection-card">
              <CardHeader>
                <CardTitle data-testid="form-selection-title">Select ITR Form Type</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { type: "ITR-1", description: "For salary income up to ₹50 lakh", suitable: "Salaried individuals" },
                  { type: "ITR-2", description: "For individuals with capital gains", suitable: "Capital gains income" },
                  { type: "ITR-3", description: "For business and professional income", suitable: "Business owners" },
                  { type: "ITR-4", description: "For presumptive business income", suitable: "Small businesses" },
                ].map((formType) => (
                  <div
                    key={formType.type}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedFormType === formType.type
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => {
                      setSelectedFormType(formType.type);
                      form.setValue("formType", formType.type);
                    }}
                    data-testid={`form-type-${formType.type.toLowerCase()}`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{formType.type}</h3>
                    <p className="text-sm text-gray-600 mb-2">{formType.description}</p>
                    <p className="text-xs text-gray-500">{formType.suitable}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Filing Form */}
            {selectedFormType && (
              <Card data-testid="filing-form-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span data-testid="filing-form-title">File {selectedFormType}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Step {currentStep} of 4</span>
                      <Progress value={(currentStep / 4) * 100} className="w-20" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {currentStep === 1 && (
                        <div className="space-y-4" data-testid="step-personal-info">
                          <h3 className="text-lg font-semibold">Personal Information</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="formData.personalInfo.pan"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>PAN Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="ABCDE1234F" {...field} data-testid="input-pan" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="formData.personalInfo.aadhaar"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Aadhaar Number (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="1234 5678 9012" {...field} data-testid="input-aadhaar" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="formData.personalInfo.mobile"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Mobile Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="9876543210" {...field} data-testid="input-mobile" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="formData.personalInfo.email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="email@example.com" type="email" {...field} data-testid="input-email" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-4" data-testid="step-income">
                          <h3 className="text-lg font-semibold">Income Details</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="formData.income.salary"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Salary Income</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                      data-testid="input-salary"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="formData.income.houseProperty"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>House Property Income</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                      data-testid="input-house-property"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="formData.income.capitalGains"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Capital Gains</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                      data-testid="input-capital-gains"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="formData.income.otherSources"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Other Sources</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                      data-testid="input-other-sources"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg" data-testid="income-summary">
                            <p className="font-semibold text-blue-900">
                              Total Income: ₹{calculateTotalIncome().toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-4" data-testid="step-deductions">
                          <h3 className="text-lg font-semibold">Deductions</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="formData.deductions.section80C"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Section 80C (Max ₹1.5L)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                      data-testid="input-section-80c"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="formData.deductions.section80D"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Section 80D (Health Insurance)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                      data-testid="input-section-80d"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="formData.deductions.otherDeductions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Other Deductions</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                      data-testid="input-other-deductions"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg" data-testid="deductions-summary">
                            <p className="font-semibold text-green-900">
                              Total Deductions: ₹{calculateTotalDeductions().toLocaleString('en-IN')}
                            </p>
                            <p className="font-semibold text-green-900 mt-2">
                              Taxable Income: ₹{calculateTaxableIncome().toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      )}

                      {currentStep === 4 && (
                        <div className="space-y-4" data-testid="step-review">
                          <h3 className="text-lg font-semibold">Review & Submit</h3>
                          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                            <div data-testid="review-summary">
                              <h4 className="font-semibold mb-2">Summary</h4>
                              <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Form Type</p>
                                  <p className="font-semibold">{selectedFormType}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Total Income</p>
                                  <p className="font-semibold">₹{calculateTotalIncome().toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Total Deductions</p>
                                  <p className="font-semibold">₹{calculateTotalDeductions().toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Taxable Income</p>
                                  <p className="font-semibold">₹{calculateTaxableIncome().toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Assessment Year</p>
                                  <p className="font-semibold">{form.watch("assessmentYear")}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Financial Year</p>
                                  <p className="font-semibold">{form.watch("financialYear")}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between pt-6" data-testid="form-navigation">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                          disabled={currentStep === 1}
                          data-testid="button-previous"
                        >
                          Previous
                        </Button>
                        {currentStep < 4 ? (
                          <Button
                            type="button"
                            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                            data-testid="button-next"
                          >
                            Next
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            disabled={createFormMutation.isPending}
                            data-testid="button-submit"
                          >
                            {createFormMutation.isPending ? "Filing..." : "File ITR"}
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="my-returns" className="space-y-6" data-testid="my-returns-content">
            <Card data-testid="returns-list-card">
              <CardHeader>
                <CardTitle data-testid="returns-list-title">My ITR Filings</CardTitle>
              </CardHeader>
              <CardContent>
                {formsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-20 rounded" data-testid={`skeleton-${i}`} />
                    ))}
                  </div>
                ) : itrForms?.length ? (
                  <div className="space-y-4">
                    {itrForms.map((form, index) => (
                      <div
                        key={form.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        data-testid={`return-item-${index}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <i className="fas fa-file-alt text-primary text-xl"></i>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900" data-testid={`return-title-${index}`}>
                              {form.formType} - {form.assessmentYear}
                            </h3>
                            <p className="text-sm text-gray-600" data-testid={`return-date-${index}`}>
                              {form.filingDate 
                                ? `Filed on ${new Date(form.filingDate).toLocaleDateString('en-IN')}`
                                : "Draft"
                              }
                            </p>
                            {form.acknowledgmentNumber && (
                              <p className="text-xs text-gray-500" data-testid={`return-ack-${index}`}>
                                ACK: {form.acknowledgmentNumber}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(form.status)} data-testid={`return-status-${index}`}>
                            {form.status}
                          </Badge>
                          {form.refundAmount && (
                            <p className="text-sm text-green-600 mt-1" data-testid={`return-refund-${index}`}>
                              Refund: ₹{parseFloat(form.refundAmount).toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12" data-testid="no-returns">
                    <i className="fas fa-file-alt text-gray-400 text-4xl mb-4"></i>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No ITR filings yet</h3>
                    <p className="text-gray-600 mb-4">Start filing your first Income Tax Return</p>
                    <Button onClick={() => setCurrentStep(1)} data-testid="button-start-filing">
                      Start Filing
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
