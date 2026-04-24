import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 rounded-[1.4rem] bg-panel border border-line shadow-[0_18px_36px_rgba(23,20,18,0.06)]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-sm font-semibold text-ink",
        nav: "space-x-1 flex items-center",
        button_previous: "absolute left-1 h-8 w-8 bg-transparent p-0 opacity-60 hover:opacity-100 transition-opacity rounded-full flex items-center justify-center border border-line hover:bg-background",
        button_next: "absolute right-1 h-8 w-8 bg-transparent p-0 opacity-60 hover:opacity-100 transition-opacity rounded-full flex items-center justify-center border border-line hover:bg-background",
        month_grid: "w-full border-collapse",
        weekdays: "",
        weekday: "text-muted-foreground w-11 h-11 font-medium text-[0.85rem] text-center",
        week: "mt-2",
        day: "p-0 text-center relative focus-within:relative focus-within:z-20",
        day_button: cn(
          "h-11 w-11 mx-auto p-0 text-base hover:bg-primary/10 hover:text-primary transition-colors rounded-full text-ink flex items-center justify-center aria-selected:opacity-100"
        ),
        selected:
          "bg-primary text-background hover:bg-primary hover:text-background focus:bg-primary focus:text-background font-semibold shadow-[0_4px_12px_rgba(181,138,68,0.25)]",
        today: "bg-background/80 font-bold border border-primary/20 text-primary",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4" {...props} />
          }
          return <ChevronRight className="h-4 w-4" {...props} />
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
