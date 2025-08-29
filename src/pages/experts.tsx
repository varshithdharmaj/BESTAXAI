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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { User, Consultation } from "@/types/schema";

const consultationSchema = z.object({
  expertId: z.string().min(1, "Please select an expert"),
  serviceType: z.string().min(1, "Please select service type"),
  scheduledDate: z.string().min(1, "Please select date and time"),
  notes: z.string().optional(),
});

type ConsultationData = z.infer<typeof consultationSchema>;

export default function Experts() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedExpert, setSelectedExpert] = useState<User | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const form = useForm<ConsultationData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      expertId: "",
      serviceType: "",
      scheduledDate: "",
      notes: "",
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

  const { data: experts, isLoading: expertsLoading } = useQuery<User[]>({
    queryKey: ["/api/experts"],
  });

  const { data: consultations, isLoading: consultationsLoading } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations"],
    enabled: isAuthenticated,
  });

  const bookConsultationMutation = useMutation({
    mutationFn: async (data: ConsultationData) => {
      const consultationData = {
        ...data,
        scheduledDate: new Date(data.scheduledDate).toISOString(),
      };
      const response = await apiRequest("POST", "/api/consultations", consultationData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Consultation booked successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
      form.reset();
      setIsBookingDialogOpen(false);
      setSelectedExpert(null);
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
        description: "Failed to book consultation",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ConsultationData) => {
    bookConsultationMutation.mutate(data);
  };

  const handleBookExpert = (expert: User) => {
    setSelectedExpert(expert);
    form.setValue("expertId", expert.id);
    setIsBookingDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 60); // Minimum 1 hour from now
    return now.toISOString().slice(0, 16);
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
            Tax Experts
          </h1>
          <p className="text-gray-600" data-testid="page-description">
            Get expert assistance from certified tax professionals
          </p>
        </div>

        {/* Service Types */}
        <div className="grid md:grid-cols-4 gap-6 mb-8" data-testid="service-types">
          {[
            { type: "ITR Filing", icon: "fas fa-file-alt", color: "text-primary", desc: "Complete ITR filing assistance" },
            { type: "GST Consultation", icon: "fas fa-receipt", color: "text-secondary", desc: "GST compliance and filing" },
            { type: "Tax Planning", icon: "fas fa-chart-line", color: "text-green-600", desc: "Strategic tax planning" },
            { type: "Legal Advisory", icon: "fas fa-gavel", color: "text-purple-600", desc: "Tax law consultation" },
          ].map((service, index) => (
            <Card key={service.type} className="text-center hover:shadow-lg transition-shadow" data-testid={`service-${index}`}>
              <CardContent className="p-6">
                <i className={`${service.icon} ${service.color} text-3xl mb-4`}></i>
                <h3 className="font-semibold text-gray-900 mb-2">{service.type}</h3>
                <p className="text-sm text-gray-600">{service.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Experts Grid */}
        <Card className="mb-8" data-testid="experts-section">
          <CardHeader>
            <CardTitle data-testid="experts-title">Available Tax Experts</CardTitle>
          </CardHeader>
          <CardContent>
            {expertsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse" data-testid={`expert-skeleton-${i}`}>
                    <div className="bg-gray-200 h-48 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : experts?.length ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experts.map((expert, index) => (
                  <Card key={expert.id} className="hover:shadow-lg transition-shadow" data-testid={`expert-card-${index}`}>
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <Avatar className="w-16 h-16 mx-auto mb-3">
                          <AvatarImage src={expert.profileImageUrl || ""} alt={expert.firstName || "Expert"} />
                          <AvatarFallback data-testid={`expert-avatar-${index}`}>
                            {expert.firstName?.[0] || "E"}{expert.lastName?.[0] || "X"}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-gray-900 mb-1" data-testid={`expert-name-${index}`}>
                          {expert.firstName} {expert.lastName}
                        </h3>
                        <p className="text-sm text-gray-600" data-testid={`expert-email-${index}`}>
                          {expert.email}
                        </p>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-star text-yellow-400 mr-2"></i>
                          <span>4.8/5 • 150+ consultations</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-clock text-gray-400 mr-2"></i>
                          <span>Usually responds in 2 hours</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-language text-gray-400 mr-2"></i>
                          <span>English, Hindi</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <h4 className="font-semibold text-sm text-gray-900">Specializations:</h4>
                        <div className="flex flex-wrap gap-1">
                          {["ITR Filing", "GST", "Tax Planning"].map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900 mb-2">₹999/session</p>
                        <Button
                          className="w-full"
                          onClick={() => handleBookExpert(expert)}
                          data-testid={`button-book-${index}`}
                        >
                          Book Consultation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12" data-testid="no-experts">
                <i className="fas fa-user-tie text-gray-400 text-4xl mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No experts available</h3>
                <p className="text-gray-600">Our tax experts will be available soon</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Consultations */}
        {isAuthenticated && (
          <Card data-testid="consultations-section">
            <CardHeader>
              <CardTitle data-testid="consultations-title">My Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              {consultationsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-gray-200 h-20 rounded" data-testid={`consultation-skeleton-${i}`} />
                  ))}
                </div>
              ) : consultations?.length ? (
                <div className="space-y-4">
                  {consultations.map((consultation, index) => (
                    <div
                      key={consultation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      data-testid={`consultation-item-${index}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <i className="fas fa-user-tie text-primary text-xl"></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900" data-testid={`consultation-service-${index}`}>
                            {consultation.serviceType}
                          </h3>
                          <p className="text-sm text-gray-600" data-testid={`consultation-date-${index}`}>
                            {consultation.scheduledDate 
                              ? `Scheduled for ${new Date(consultation.scheduledDate).toLocaleString('en-IN')}`
                              : "No date scheduled"
                            }
                          </p>
                          {consultation.meetingLink && (
                            <p className="text-xs text-blue-600" data-testid={`consultation-link-${index}`}>
                              Meeting Link Available
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(consultation.status)} data-testid={`consultation-status-${index}`}>
                          {consultation.status}
                        </Badge>
                        {consultation.price && (
                          <p className="text-sm text-gray-600 mt-1" data-testid={`consultation-price-${index}`}>
                            ₹{parseFloat(consultation.price).toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12" data-testid="no-consultations">
                  <i className="fas fa-calendar-alt text-gray-400 text-4xl mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No consultations yet</h3>
                  <p className="text-gray-600 mb-4">Book your first consultation with a tax expert</p>
                  <Button
                    onClick={() => experts?.[0] && handleBookExpert(experts[0])}
                    disabled={!experts?.length}
                    data-testid="button-book-first"
                  >
                    Book First Consultation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Booking Dialog */}
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogContent className="max-w-md" data-testid="booking-dialog">
            <DialogHeader>
              <DialogTitle data-testid="booking-dialog-title">
                Book Consultation with {selectedExpert?.firstName} {selectedExpert?.lastName}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-service-type">
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="itr-filing">ITR Filing</SelectItem>
                          <SelectItem value="gst-consultation">GST Consultation</SelectItem>
                          <SelectItem value="tax-planning">Tax Planning</SelectItem>
                          <SelectItem value="legal-advisory">Legal Advisory</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Date & Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          min={getMinDateTime()}
                          {...field}
                          data-testid="input-scheduled-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your requirements..."
                          {...field}
                          data-testid="textarea-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Session Fee:</span>
                    <span className="text-lg font-bold text-primary">₹999</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">60 minutes consultation session</p>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsBookingDialogOpen(false);
                      setSelectedExpert(null);
                      form.reset();
                    }}
                    data-testid="button-cancel-booking"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={bookConsultationMutation.isPending}
                    data-testid="button-confirm-booking"
                  >
                    {bookConsultationMutation.isPending ? "Booking..." : "Book Consultation"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  );
}
