import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "wouter";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useListServices, useSchedulePickup } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Button, Input, Textarea } from "@/components/ui";
import { FormPanel } from "@/components/site";
import { useToast } from "@/hooks/use-toast";

const pickupSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.string().length(10, "Enter a 10-digit phone number"),
  address: z.string().min(10, "Enter the full pickup address"),
  services: z.array(z.string()).min(1, "Select at least one service"),
  preferredDate: z.string().min(1, "Pick a date"),
  timeSlot: z.enum(["morning", "afternoon", "evening"]),
  branch: z.enum(["pollachi", "kinathukadavu"]),
  specialInstructions: z.string().optional(),
});

type PickupForm = z.infer<typeof pickupSchema>;

const steps = [
  { label: "Contact", title: "Customer details and pickup location." },
  { label: "Services", title: "Select the categories in the order." },
  { label: "Schedule", title: "Choose branch, slot, and date." },
];

export default function SchedulePickup() {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState<{ ref: string; msg: string } | null>(null);
  const { data: servicesData } = useListServices();
  const { toast } = useToast();

  const {
    control,
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<PickupForm>({
    resolver: zodResolver(pickupSchema),
    mode: "onChange",
    defaultValues: {
      services: [],
      branch: "pollachi",
      timeSlot: "morning",
    },
  });

  const values = watch();

  const { mutate: schedule, isPending } = useSchedulePickup({
    mutation: {
      onSuccess: (result) => setSuccess({ ref: result.data.bookingReference, msg: result.data.message }),
      onError: () => {
        toast({ title: "Unable to schedule pickup", description: "Please try again in a moment.", variant: "destructive" });
      },
    },
  });

  const nextStep = async () => {
    if (step === 1) {
      const ok = await trigger(["name", "phone", "address"]);
      if (ok) setStep(2);
      return;
    }
    if (step === 2) {
      const ok = await trigger(["services"]);
      if (ok) setStep(3);
    }
  };

  if (success) {
    return (
      <AppLayout>
        <SEO
          title="Pickup confirmed | Fab Clean"
          description="Your Fab Clean pickup request has been saved."
          canonical="https://myfabclean.com/schedule-pickup"
        />
        <div className="page-shell">
          <section className="container-tight section-padding">
            <div className="visual-card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h1 className="mt-6 font-display text-5xl text-ink">Pickup request saved</h1>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{success.msg}</p>
              <div className="mt-8 rounded-[1.75rem] border border-line bg-background/70 p-5">
                <p className="eyebrow justify-center">Booking reference</p>
                <p className="mt-4 text-2xl font-semibold text-ink">{success.ref}</p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/dashboard/orders">
                  <Button>Open dashboard</Button>
                </Link>
                <Link href="/track-order">
                  <Button variant="outline">Track an order</Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <SEO
        title="Schedule Pickup | Fab Clean"
        description="Book a Fab Clean pickup in a shorter, cleaner, mobile-first flow."
        canonical="https://myfabclean.com/schedule-pickup"
      />

      <div className="page-shell">
        <section className="container-wide section-padding">
          <FormPanel
            eyebrow="Schedule pickup"
            title="A premium booking flow should still be fast."
            description="The new form reduces visual clutter, clarifies each step, and keeps the customer summary visible while they complete the request."
            sideNote={
              <div className="space-y-3">
                {steps.map((item, index) => (
                  <div
                    key={item.label}
                    className={`rounded-[1.4rem] border px-4 py-4 text-sm ${step === index + 1 ? "border-primary/20 bg-primary/10 text-primary" : "border-line bg-background/70 text-muted-foreground"}`}
                  >
                    <p className="font-semibold uppercase tracking-[0.16em]">{item.label}</p>
                    <p className="mt-2 text-sm leading-7">{item.title}</p>
                  </div>
                ))}
              </div>
            }
          >
            <form onSubmit={handleSubmit((formValues) => schedule({ data: formValues }))}>
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div key="pickup-step-1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Input placeholder="Full name" {...register("name")} />
                        {errors.name ? <p className="mt-2 text-sm text-red-700">{errors.name.message}</p> : null}
                      </div>
                      <div>
                        <Input
                          placeholder="10-digit phone number"
                          maxLength={10}
                          {...register("phone")}
                          onInput={(event) => {
                            const target = event.currentTarget as HTMLInputElement;
                            target.value = target.value.replace(/\D/g, "").slice(0, 10);
                          }}
                        />
                        {errors.phone ? <p className="mt-2 text-sm text-red-700">{errors.phone.message}</p> : null}
                      </div>
                    </div>
                    <div>
                      <Textarea placeholder="Pickup address with landmark." {...register("address")} />
                      {errors.address ? <p className="mt-2 text-sm text-red-700">{errors.address.message}</p> : null}
                    </div>
                  </motion.div>
                ) : null}

                {step === 2 ? (
                  <motion.div key="pickup-step-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
                    <Controller
                      name="services"
                      control={control}
                      render={({ field }) => (
                        <div className="grid gap-4 sm:grid-cols-2">
                          {servicesData?.data?.map((service) => {
                            const selected = field.value.includes(service.id);
                            return (
                              <button
                                key={service.id}
                                type="button"
                                onClick={() => field.onChange(selected ? field.value.filter((value) => value !== service.id) : [...field.value, service.id])}
                                className={`rounded-[1.5rem] border px-5 py-5 text-left transition-colors ${selected ? "border-primary/20 bg-primary/10" : "border-line bg-background/70"}`}
                              >
                                <p className="font-medium text-ink">{service.name}</p>
                                <p className="mt-2 text-sm leading-7 text-muted-foreground">{service.description}</p>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    />
                    {errors.services ? <p className="text-sm text-red-700">{errors.services.message}</p> : null}
                  </motion.div>
                ) : null}

                {step === 3 ? (
                  <motion.div key="pickup-step-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-ink">Preferred date</label>
                        <Input type="date" min={new Date().toISOString().split("T")[0]} {...register("preferredDate")} />
                        {errors.preferredDate ? <p className="mt-2 text-sm text-red-700">{errors.preferredDate.message}</p> : null}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-ink">Branch</label>
                        <Controller
                          name="branch"
                          control={control}
                          render={({ field }) => (
                            <div className="grid grid-cols-2 gap-3">
                              {["pollachi", "kinathukadavu"].map((branch) => (
                                <button
                                  key={branch}
                                  type="button"
                                  onClick={() => field.onChange(branch)}
                                  className={`rounded-[1.2rem] border px-4 py-3 text-sm capitalize ${field.value === branch ? "border-primary/20 bg-primary/10 text-primary" : "border-line bg-background/70 text-ink"}`}
                                >
                                  {branch}
                                </button>
                              ))}
                            </div>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-ink">Time slot</label>
                      <Controller
                        name="timeSlot"
                        control={control}
                        render={({ field }) => (
                          <div className="grid gap-3 sm:grid-cols-3">
                            {[
                              { id: "morning", label: "Morning", meta: "10 AM to 1 PM" },
                              { id: "afternoon", label: "Afternoon", meta: "1 PM to 4 PM" },
                              { id: "evening", label: "Evening", meta: "4 PM to 8 PM" },
                            ].map((slot) => (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => field.onChange(slot.id)}
                                className={`rounded-[1.4rem] border px-4 py-4 text-left ${field.value === slot.id ? "border-primary/20 bg-primary/10" : "border-line bg-background/70"}`}
                              >
                                <p className="font-medium text-ink">{slot.label}</p>
                                <p className="mt-2 text-sm text-muted-foreground">{slot.meta}</p>
                              </button>
                            ))}
                          </div>
                        )}
                      />
                    </div>

                    <Textarea placeholder="Special instructions for the pickup team." {...register("specialInstructions")} />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="rounded-[1.5rem] border border-line bg-background/70 p-5 text-sm text-muted-foreground">
                  <p className="font-medium text-ink">Pickup summary</p>
                  <p className="mt-2">Branch: {values.branch || "pollachi"} • Slot: {values.timeSlot || "morning"}</p>
                  <p className="mt-1">Selected services: {values.services?.length || 0}</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={() => setStep((value) => Math.max(1, value - 1))}>
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </Button>
                  ) : null}
                  {step < 3 ? (
                    <Button type="button" onClick={() => void nextStep()}>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" isLoading={isPending} disabled={!isValid}>
                      Confirm pickup
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </FormPanel>
        </section>
      </div>
    </AppLayout>
  );
}
