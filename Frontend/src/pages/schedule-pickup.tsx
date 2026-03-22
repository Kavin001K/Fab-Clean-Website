import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { SectionHeading, Card, Input, Button, FadeIn } from "@/components/ui";
import { useListServices, useSchedulePickup } from "@workspace/api-client-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCircle2, ChevronRight, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const pickupSchema = z.object({
  name: z.string().min(2),
  phone: z.string().length(10),
  address: z.string().min(10),
  services: z.array(z.string()).min(1, "Select at least one service"),
  preferredDate: z.string(),
  timeSlot: z.enum(["morning", "afternoon", "evening"]),
  branch: z.enum(["pollachi", "kinathukadavu"]),
  specialInstructions: z.string().optional()
});

type PickupForm = z.infer<typeof pickupSchema>;

export default function SchedulePickup() {
  const [step, setStep] = useState(1);
  const { data: servicesData } = useListServices();
  const { toast } = useToast();
  const [successData, setSuccessData] = useState<{ref: string, msg: string} | null>(null);

  const { control, register, handleSubmit, watch, formState: { errors, isValid } } = useForm<PickupForm>({
    resolver: zodResolver(pickupSchema),
    mode: "onChange",
    defaultValues: {
      services: [],
      branch: "pollachi",
      timeSlot: "morning"
    }
  });

  const { mutate: schedule, isPending } = useSchedulePickup({
    mutation: {
      onSuccess: (res) => setSuccessData({ ref: res.data.bookingReference, msg: res.data.message }),
      onError: () => toast({ title: "Error", description: "Failed to schedule pickup", variant: "destructive" })
    }
  });

  const onSubmit = (data: PickupForm) => {
    schedule({ data });
  };

  const nextStep = () => {
    if (step === 1 && !errors.name && !errors.phone && !errors.address && watch('name') && watch('phone') && watch('address')) setStep(2);
    if (step === 2 && watch('services').length > 0) setStep(3);
  };

  if (successData) {
    return (
      <AppLayout>
        <div className="relative min-h-[80vh] flex items-center justify-center pt-20 px-4 overflow-hidden">
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-[820px] h-[820px] bg-primary/10 rounded-full blur-[220px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[650px] h-[650px] bg-secondary/7 rounded-full blur-[190px] translate-x-1/2 translate-y-1/2" />
          </div>

          <FadeIn className="relative z-10 text-center max-w-md">
            <div className="w-20 h-20 bg-primary/15 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Pickup Scheduled!</h2>
            <p className="text-muted-foreground mb-6">{successData.msg}</p>
            <div className="bg-muted border border-border rounded-xl p-6 mb-8">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Booking Reference</p>
              <p className="text-2xl font-mono font-bold text-primary">{successData.ref}</p>
            </div>
            <Link href="/dashboard">
              <Button size="lg" className="w-full">Track My Order</Button>
            </Link>
          </FadeIn>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative pt-32 pb-24 max-w-3xl mx-auto px-4 overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-primary/10 rounded-full blur-[220px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[680px] h-[680px] bg-secondary/6 rounded-full blur-[190px] -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
        <SectionHeading title="Schedule Pickup" subtitle="Fast & Free within 3km" className="mb-12" />

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
          {[1, 2, 3].map((num) => (
            <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-background transition-colors ${step >= num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border-border"}`}>
              {num}
            </div>
          ))}
        </div>

        <Card className="p-6 md:p-10 border-border shadow-lg relative overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground mb-6">Contact Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input placeholder="Full Name" {...register("name")} />
                      {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
                    </div>
                    <div>
                      <Input placeholder="Phone (10 digits)" {...register("phone")} maxLength={10} />
                      {errors.phone && <span className="text-xs text-destructive">{errors.phone.message}</span>}
                    </div>
                  </div>
                  <div>
                    <textarea
                      className="flex min-h-[100px] w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                      placeholder="Full Pickup Address with landmarks"
                      {...register("address")}
                    />
                    {errors.address && <span className="text-xs text-destructive">{errors.address.message}</span>}
                  </div>
                  <Button type="button" onClick={nextStep} className="w-full h-12" disabled={!watch('name') || !watch('phone') || !watch('address')}>
                    Next Step <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground mb-6">Select Services</h3>
                  
                  <Controller
                    name="services"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {servicesData?.data.map((srv) => {
                          const isSelected = field.value.includes(srv.id);
                          return (
                            <div 
                              key={srv.id}
                              onClick={() => {
                                const newValues = isSelected ? field.value.filter(id => id !== srv.id) : [...field.value, srv.id];
                                field.onChange(newValues);
                              }}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3 relative ${isSelected ? 'border-primary bg-primary/10' : 'border-border bg-white hover:border-primary/50 hover:bg-muted/50'}`}
                            >
                              {isSelected && <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground"><Check className="w-3 h-3" /></div>}
                              <img src={`https://api.dicebear.com/7.x/icons/svg?seed=${srv.icon}&backgroundColor=transparent`} className="w-8 h-8 opacity-80" alt="icon"/>
                              <span className="text-sm font-medium text-foreground">{srv.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  />
                  {errors.services && <span className="text-xs text-destructive">{errors.services.message}</span>}

                  <Button type="button" onClick={nextStep} className="w-full h-12" disabled={watch('services').length === 0}>
                    Next Step <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground mb-6">Schedule Time &amp; Branch</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-foreground">Preferred Branch</label>
                      <Controller
                        name="branch"
                        control={control}
                        render={({ field }) => (
                          <div className="flex gap-4">
                            {['pollachi', 'kinathukadavu'].map(b => (
                              <button
                                type="button"
                                key={b}
                                onClick={() => field.onChange(b)}
                                className={`flex-1 py-3 rounded-xl border-2 capitalize text-sm font-semibold transition-all ${field.value === b ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-white text-muted-foreground hover:border-primary/50'}`}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-foreground">Pickup Date</label>
                      <Input type="date" {...register("preferredDate")} min={new Date().toISOString().split('T')[0]} />
                      {errors.preferredDate && <span className="text-xs text-destructive">Required</span>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-foreground">Time Slot</label>
                    <Controller
                      name="timeSlot"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { id: 'morning', label: 'Morning', time: '10 AM - 1 PM' },
                            { id: 'afternoon', label: 'Afternoon', time: '1 PM - 4 PM' },
                            { id: 'evening', label: 'Evening', time: '4 PM - 8 PM' },
                          ].map(t => (
                            <button
                              type="button"
                              key={t.id}
                              onClick={() => field.onChange(t.id)}
                              className={`p-3 rounded-xl border-2 flex flex-col items-center transition-all ${field.value === t.id ? 'border-primary bg-primary/10' : 'border-border bg-white hover:border-primary/40'}`}
                            >
                              <span className={`font-semibold ${field.value === t.id ? 'text-primary' : 'text-foreground'}`}>{t.label}</span>
                              <span className="text-xs text-muted-foreground mt-1">{t.time}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  <Button type="submit" isLoading={isPending} disabled={!isValid} className="w-full h-14 text-lg mt-8 shadow-primary/30 shadow-xl">
                    Confirm Booking
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="absolute top-8 right-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Go Back
              </button>
            )}
          </form>
        </Card>
        </div>
      </div>
    </AppLayout>
  );
}
