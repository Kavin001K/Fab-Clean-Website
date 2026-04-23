import { Link } from "wouter";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <AppLayout>
      <div className="page-shell">
        <section className="container-tight section-padding">
          <div className="visual-card p-10 text-center">
            <p className="eyebrow justify-center">404</p>
            <h1 className="mt-6 font-display text-6xl text-ink">This page got lost between pickup and delivery.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              The route does not exist or has moved. The redesign keeps the error state cleaner and gives the customer a fast route back to the primary actions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/">
                <Button>Back home</Button>
              </Link>
              <Link href="/schedule-pickup">
                <Button variant="outline">Book pickup</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
