import { SubmitRequestForm } from "@/components/journalist/SubmitRequestForm";

export default function CreateRequest() {
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Submit a Story Request
        </h1>
        <p className="text-muted-foreground mt-2">
          Tell founders exactly what you need. You control visibility.
        </p>
      </div>
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <SubmitRequestForm />
      </div>
    </div>
  );
}
