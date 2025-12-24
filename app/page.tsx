"use client";

import { useEffect, useState } from "react";
import { getAllPlaylists } from "@/lib/firebase/firestore";
import { Playlist } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/Badge";
import { motion } from "framer-motion";
import { AuthGateButton } from "@/components/AuthGateButton";
import {
  PlayCircle,
  FileText,
  ListMusic,
  Link as LinkIcon,
  Users,
  Zap,
  BookOpen,
  Share2,
  Heart,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await getAllPlaylists();
        setPlaylists(data);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  return (
    <div className="relative overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_45%),_radial-gradient(circle_at_20%_20%,_rgba(99,102,241,0.12),_transparent_35%)]" />

      <main className="relative container mx-auto px-4 py-12 space-y-24">
        <Hero userLoggedIn={!!user} />
        <Stats playlists={playlists} loading={loading} />
        <FeaturedPlaylists playlists={playlists} loading={loading} />
        <HowItWorks />
        <CTA userLoggedIn={!!user} />
      </main>
    </div>
  );
}

// Hero Section
function Hero({ userLoggedIn }: { userLoggedIn: boolean }) {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center pt-8">
      <div className="space-y-8">
        <div className="flex flex-wrap gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Made by students who actually study
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100"
          >
            <Zap className="h-3 w-3" />
            Login with your .edu to start building
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
        >
          Stop drowning in tabs. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            One playlist
          </span>{" "}
          to rule your coursework.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl text-slate-600 max-w-2xl leading-relaxed"
        >
          Organize every lecture, PDF, and random YouTube tutorial into a
          single, binge-worthy stream. Your GPA will thank you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap gap-4"
        >
          <AuthGateButton
            href="/playlist/create"
            size="lg"
            className="h-12 px-8 text-base shadow-lg shadow-indigo-500/20"
          >
            Start a playlist
          </AuthGateButton>
          <Link href="/playlists">
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base bg-white/50 backdrop-blur-sm"
            >
              Steal a playlist
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
        className="relative"
      >
        <div className="absolute -inset-10 bg-gradient-to-tr from-indigo-200 via-purple-100 to-emerald-100 blur-3xl opacity-60" />
        <div className="relative rounded-2xl border border-slate-200 bg-white/90 shadow-2xl backdrop-blur-xl p-6 ring-1 ring-slate-900/5">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Course Playlist
              </p>
              <p className="text-xl font-bold text-slate-900 mt-1">
                CS 101: Deep Learning Survival Guide
              </p>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              12 items
            </Badge>
          </div>
          <div className="space-y-3">
            {[
              { title: "Intro to CNNs (Watch first!)", type: "video" },
              { title: "Backpropagation math explained simply", type: "video" },
              { title: "Transformer intuition", type: "video" },
              { title: "Reading: Attention is All You Need", type: "doc" },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
                className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    {idx + 1}
                  </span>
                  {item.title}
                </div>
                {item.type === "video" ? (
                  <PlayCircle className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                ) : (
                  <FileText className="h-4 w-4 text-slate-400 group-hover:text-emerald-500" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Stats section
function Stats({
  playlists,
  loading,
}: {
  playlists: Playlist[];
  loading: boolean;
}) {
  const totalItems = playlists.reduce(
    (sum, p) => sum + (p.items?.length || 0),
    0
  );
  const creators = new Set(playlists.map((p) => p.authorId)).size;
  const stats = [
    { label: "Playlists Created", value: playlists.length, icon: ListMusic },
    { label: "Resources Shared", value: totalItems, icon: LinkIcon },
    { label: "Student Curators", value: creators, icon: Users },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-3">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loading ? 0.6 : 1, y: 0 }}
          transition={{ delay: 0.05 * idx, duration: 0.4 }}
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <stat.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900">
              {loading ? "—" : stat.value}
            </p>
          </div>
        </motion.div>
      ))}
    </section>
  );
}

// Featured Playlists grid
function FeaturedPlaylists({
  playlists,
  loading,
}: {
  playlists: Playlist[];
  loading: boolean;
}) {
  const skeletons = Array.from({ length: 6 });
  const list = playlists.slice(0, 9);

  return (
    <section id="featured" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Trending Courses
          </h2>
          <p className="text-slate-600 mt-1">
            See what everyone else is using to pass.
          </p>
        </div>
        <AuthGateButton href="/playlist/create" variant="outline" size="sm">
          Share your notes
        </AuthGateButton>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(loading ? (skeletons as Playlist[]) : list).map((playlist, idx) => (
          <motion.div
            key={playlist?.id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx, duration: 0.4 }}
          >
            {loading ? (
              <div className="h-40 rounded-xl border border-slate-200 bg-slate-100 animate-pulse" />
            ) : (
              <Link href={`/playlist/${playlist.id}`}>
                <Card className="h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col border-slate-200/60 bg-white/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="line-clamp-1 text-lg">
                      {playlist.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {playlist.description}
                    </CardDescription>
                  </CardHeader>
                  <CardDescription className="px-6 pb-6 text-sm text-slate-600 flex flex-wrap gap-2 items-center mt-auto">
                    <Badge
                      variant="secondary"
                      className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    >
                      {playlist.items?.length || 0} items
                    </Badge>
                    <span className="text-xs text-slate-400">•</span>
                    <Link
                      href={`/users/${playlist.authorId}`}
                      className="text-xs font-medium text-slate-500 hover:text-indigo-600 hover:underline flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      By {playlist.authorName}
                      {playlist.authorLevel && (
                        <span className="inline-flex items-center justify-center bg-slate-100 text-slate-600 rounded-full h-4 w-4 text-[10px]">
                          {playlist.authorLevel}
                        </span>
                      )}
                    </Link>
                    {playlist.likes !== undefined && (
                      <div className="flex items-center gap-1 ml-auto text-slate-500">
                        <Heart className="h-3 w-3 fill-slate-300 text-slate-400" />
                        <span className="text-xs font-medium">
                          {playlist.likes}
                        </span>
                      </div>
                    )}
                  </CardDescription>
                </Card>
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {!loading && playlists.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
          <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            It's quiet... too quiet.
          </h3>
          <p className="text-slate-500 max-w-sm mt-2">
            No one has shared a course yet. Be the legend who starts the first
            one.
          </p>
          <div className="mt-6">
            <AuthGateButton href="/playlist/create">
              Create the first playlist
            </AuthGateButton>
          </div>
        </div>
      )}
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Curate the chaos",
      copy: "Grab links from YouTube, PDFs from Drive, and articles from the web. Put them in an order that actually makes sense.",
    },
    {
      title: "Add the context",
      copy: "Don't just dump links. Add notes like 'Watch from 10:00' or 'Skip the intro' so your friends don't waste time.",
    },
    {
      title: "Save the semester",
      copy: "Share the link with your study group. They get a clean, distraction-free feed. You get to be the hero.",
    },
  ];

  return (
    <section className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center py-12">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
        <p className="text-lg text-slate-600">
          Three simple steps to turn a messy syllabus into a followable journey.
        </p>
        <div className="space-y-4 mt-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * idx, duration: 0.4 }}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200 transition-colors"
            >
              <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                {idx + 1}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-lg">{step.title}</p>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  {step.copy}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white shadow-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />

        <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">
          Why this works
        </p>
        <h3 className="mt-4 text-3xl font-bold">
          Stay organized, stay generous.
        </h3>
        <p className="mt-4 text-indigo-100 text-lg leading-relaxed">
          Your playlist is the course map. Keep it updated, add context, and
          your classmates will thank you. Less searching, more learning.
        </p>
        <div className="mt-8 flex items-center gap-2 text-sm font-medium text-indigo-200">
          <Share2 className="h-4 w-4" />
          <span>Shareable with one click</span>
        </div>
      </motion.div>
    </section>
  );
}

function CTA({ userLoggedIn }: { userLoggedIn: boolean }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 opacity-80" />
      <div className="relative flex flex-col gap-8 px-8 py-12 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
            Ready to share?
          </p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">
            Publish your next course playlist today.
          </h3>
          <p className="text-lg text-slate-600 mt-3">
            No uploads—just links, notes, and a clean flow your peers can
            follow. Be the reason someone passes this semester.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          <AuthGateButton
            href="/playlist/create"
            size="lg"
            className="h-12 px-8 text-base"
          >
            Create playlist
          </AuthGateButton>
          <Link href="/profile">
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base bg-white"
            >
              Go to profile
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
