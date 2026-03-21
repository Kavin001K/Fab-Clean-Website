import { Link } from "wouter";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <AppLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-[150px] font-black font-display text-primary/10 leading-none select-none relative">
          404
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white">
            Oops!
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4 mt-8">We lost this page in the wash.</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          The page you are looking for doesn't exist or has been moved to another basket.
        </p>
        <Link href="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </div>
    </AppLayout>
  );
}
