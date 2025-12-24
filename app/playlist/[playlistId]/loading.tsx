import { Card, CardContent } from "@/components/ui/Card";

export default function Loading() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 w-full max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="h-6 w-24 rounded-full bg-slate-200 animate-pulse" />
              <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
            </div>
            <div className="h-10 w-3/4 rounded-lg bg-slate-200 animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-slate-200 animate-pulse" />
              <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
              <div className="h-4 w-16 rounded bg-slate-200 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-20 rounded-md bg-slate-200 animate-pulse" />
            <div className="h-9 w-20 rounded-md bg-slate-200 animate-pulse" />
          </div>
        </div>

        <div className="h-32 w-full rounded-2xl bg-slate-100 animate-pulse" />
      </div>

      <div className="space-y-6">
        <div className="h-8 w-48 rounded-lg bg-slate-200 animate-pulse" />

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-slate-200">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="mt-1 shrink-0">
                  <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 rounded bg-slate-200 animate-pulse" />
                  <div className="h-4 w-1/2 rounded bg-slate-200 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
