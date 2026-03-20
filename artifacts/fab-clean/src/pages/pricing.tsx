import { AppLayout } from "@/components/layout";
import { SectionHeading, Card, FadeIn } from "@/components/ui";
import { useListPricing } from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function Pricing() {
  const { data, isLoading } = useListPricing();

  return (
    <AppLayout>
      <div className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Transparent Pricing" 
          subtitle="No hidden fees"
          className="mb-16"
        />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-12">
            {data?.data.map((category, i) => (
              <FadeIn key={category.category} delay={i * 0.1}>
                <h3 className="text-2xl font-display font-bold text-foreground mb-6 pl-4 border-l-4 border-primary">
                  {category.category}
                </h3>
                <Card className="overflow-hidden border-border shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="py-4 px-6 font-semibold text-muted-foreground text-sm">Item</th>
                        <th className="py-4 px-6 font-semibold text-muted-foreground text-sm">Type</th>
                        <th className="py-4 px-6 font-semibold text-muted-foreground text-sm text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {category.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-muted/60 transition-colors">
                          <td className="py-4 px-6 text-foreground font-medium">{item.item}</td>
                          <td className="py-4 px-6 text-muted-foreground text-sm">{item.type || '-'}</td>
                          <td className="py-4 px-6 text-right font-bold text-primary">
                            {formatCurrency(item.price)}
                            {item.unit && <span className="text-muted-foreground text-xs font-normal ml-1">/{item.unit}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
