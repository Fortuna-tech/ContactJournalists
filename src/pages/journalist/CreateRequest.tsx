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
      <div className="bg-white/60 border-2 border-black rounded-2xl p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <SubmitRequestForm />
      </div>
    </div>
  );
}
