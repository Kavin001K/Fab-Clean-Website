import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "wouter";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useListServices, useSchedulePickup } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout";
import { Button, Card, FadeIn, Input, SectionHeading } from "@/components/ui";
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

const steps = ["Your details", "Services", "Date and branch"];

export default function SchedulePickup() {
  const [step, setStep] = useState(1);
  const [successData, setSuccessData] = useState<{ ref: string; msg: string } | null>(null);
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

  const { mutate: schedule, isPending } = useSchedulePickup({
    mutation: {
      onSuccess: (result) => setSuccessData({ ref: result.data.bookingReference, msg: result.data.message }),
      onError: () => {
        toast({ title: "Unable to schedule pickup", description: "Please try again in a moment.", variant: "destructive" });
      },
    },
  });

  const onSubmit = (values: PickupForm) => {
    schedule({ data: values });
  };

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

  if (successData) {
    return (
      <AppLayout>
        <div className="page-shell">
          <section className="container-tight section-padding">
            <FadeIn className="mx-auto max-w-2xl">
              <Card className="p-8 text-center sm:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h1 className="mt-6 text-4xl font-black sm:text-5xl">Pickup request saved</h1>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">{successData.msg}</p>
                <div className="mt-6 rounded-[1.5rem] bg-muted/70 px-6 py-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Booking reference</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{successData.ref}</p>
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link href="/dashboard/orders">
                    <Button>Open dashboard</Button>
                  </Link>
                  <Link href="/track-order">
                    <Button variant="outline">Track an order</Button>
                  </Link>
                </div>
              </Card>
            </FadeIn>
          </section>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="page-shell">
        <section className="container-tight section-padding">
          <SectionHeading title="Book a pickup in a few short steps" subtitle="Schedule pickup" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            This form is designed to keep the booking flow simple. Start with contact details, choose the services you need, then confirm the date and branch.
          </p>

          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {steps.map((label, index) => {
              const active = index + 1 === step;
              const complete = index + 1 < step;
              return (
                <div
                  key={label}
                  className={`rounded-[1.25rem] border px-4 py-4 text-sm font-bold transition-colors ${
                    active ? "border-primary bg-primary/10 text-primary" : complete ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-border bg-white text-muted-foreground"
                  }`}
                >
                  <div className="text-[11px] uppercase tracking-[0.14em]">{`Step ${index + 1}`}</div>
                  <div className="mt-1">{label}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="container-tight pb-20">
          <FadeIn className="mx-auto max-w-3xl">
            <Card className="p-6 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div key="pickup-step-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                      <div>
                        <h2 className="text-3xl font-black">Tell us where to reach you</h2>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">We use these details to assign the pickup and create the booking reference.</p>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Input placeholder="Full name" {...register("name")} />
                          {errors.name ? <p className="mt-2 text-sm text-destructive">{errors.name.message}</p> : null}
                        </div>
                        <div>
                          <Input
                            placeholder="Phone number"
                            maxLength={10}
                            {...register("phone")}
                            onInput={(event) => {
                              const target = event.currentTarget as HTMLInputElement;
                              target.value = target.value.replace(/\D/g, "").slice(0, 10);
                            }}
                          />
                          {errors.phone ? <p className="mt-2 text-sm text-destructive">{errors.phone.message}</p> : null}
                        </div>
                      </div>
                      <div>
                        <textarea
                          className="min-h-[140px] w-full rounded-[1.4rem] border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/12"
                          placeholder="Full pickup address with nearby landmark"
                          {...register("address")}
                        />
                        {errors.address ? <p className="mt-2 text-sm text-destructive">{errors.address.message}</p> : null}
                      </div>
                    </motion.div>
                  ) : null}

                  {step === 2 ? (
                    <motion.div key="pickup-step-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                      <div>
                        <h2 className="text-3xl font-black">Choose your service type</h2>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">Pick one or more service categories. The team can still refine the exact items later.</p>
                      </div>
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
                                  onClick={() => {
                                    field.onChange(
                                      selected ? field.value.filter((value) => value !== service.id) : [...field.value, service.id],
                                    );
                                  }}
                                  className={`rounded-[1.5rem] border px-5 py-5 text-left transition-all ${
                                    selected ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-white hover:border-primary/35 hover:bg-muted/70"
                                  }`}
                                >
                                  <p className="font-black text-foreground">{service.name}</p>
                                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{service.description}</p>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      />
                      {errors.services ? <p className="text-sm text-destructive">{errors.services.message}</p> : null}
                    </motion.div>
                  ) : null}

                  {step === 3 ? (
                    <motion.div key="pickup-step-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                      <div>
                        <h2 className="text-3xl font-black">Pick the date, branch, and time</h2>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">This gives the store a clean booking window to work with.</p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-bold text-foreground">Preferred date</label>
                          <Input type="date" min={new Date().toISOString().split("T")[0]} {...register("preferredDate")} />
                          {errors.preferredDate ? <p className="mt-2 text-sm text-destructive">{errors.preferredDate.message}</p> : null}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-bold text-foreground">Preferred branch</label>
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
                                    className={`rounded-[1.2rem] border px-4 py-3 text-sm font-bold capitalize ${
                                      field.value === branch ? "border-primary bg-primary/10 text-primary" : "border-border bg-white text-foreground"
                                    }`}
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
                        <label className="mb-2 block text-sm font-bold text-foreground">Time slot</label>
                        <Controller
                          name="timeSlot"
                          control={control}
                          render={({ field }) => (
                            <div className="grid gap-3 sm:grid-cols-3">
                              {[
                                { id: "morning", label: "Morning", time: "10 AM to 1 PM" },
                                { id: "afternoon", label: "Afternoon", time: "1 PM to 4 PM" },
                                { id: "evening", label: "Evening", time: "4 PM to 8 PM" },
                              ].map((slot) => (
                                <button
                                  key={slot.id}
                                  type="button"
                                  onClick={() => field.onChange(slot.id)}
                                  className={`rounded-[1.2rem] border px-4 py-4 text-left ${
                                    field.value === slot.id ? "border-primary bg-primary/10" : "border-border bg-white"
                                  }`}
                                >
                                  <p className="font-black text-foreground">{slot.label}</p>
                                  <p className="mt-1 text-sm text-muted-foreground">{slot.time}</p>
                                </button>
                              ))}
                            </div>
                          )}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold text-foreground">Special instructions (optional)</label>
                        <textarea
                          className="min-h-[120px] w-full rounded-[1.4rem] border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/12"
                          placeholder="Anything the pickup team should know?"
                          {...register("specialInstructions")}
                        />
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-3">
                    {step > 1 ? (
                      <Button type="button" variant="outline" onClick={() => setStep((value) => Math.max(1, value - 1))}>
                        <ChevronLeft className="h-4 w-4" />
                        Back
                      </Button>
                    ) : null}
                  </div>

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
              </form>
            </Card>
          </FadeIn>
        </section>
      </div>
    </AppLayout>
  );
}
