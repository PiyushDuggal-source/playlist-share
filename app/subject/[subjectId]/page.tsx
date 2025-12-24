// Deprecated: subjects are no longer used. Keep this route to avoid 404s and redirect users.
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function SubjectPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">
        Subjects are deprecated
      </h1>
      <p className="text-slate-600">
        Courses are now represented directly as playlists. Browse all courses on
        the homepage.
      </p>
      <Link href="/">
        <Button>Go to Home</Button>
      </Link>
    </div>
  );
}
