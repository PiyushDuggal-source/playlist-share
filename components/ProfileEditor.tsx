"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { UserProfile } from "@/types";
import { getUserProfile, updateUserProfile } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Pencil, Save, X, Plus, Trash } from "lucide-react";

interface ProfileEditorProps {
  user: User;
}

export function ProfileEditor({ user }: ProfileEditorProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [level, setLevel] = useState<number>(1);
  const [bio, setBio] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);

  // Input state for arrays
  const [newSubject, setNewSubject] = useState("");
  const [newProject, setNewProject] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile(user.uid);
        if (data) {
          setProfile(data);
          setLevel(data.level || 1);
          setBio(data.bio || "");
          setSubjects(data.subjects || []);
          setProjects(data.projects || []);
        } else {
          // Initialize with basic auth data if no profile exists
          setProfile({
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "",
            photoURL: user.photoURL || undefined,
          });
        }
      } catch (error) {
        console.error("Error loading profile", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedData: Partial<UserProfile> = {
        level,
        bio,
        subjects,
        projects,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || undefined,
      };

      await updateUserProfile(user.uid, updatedData);
      setProfile({ ...profile!, ...updatedData });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile", error);
    } finally {
      setSaving(false);
    }
  };

  const addSubject = () => {
    if (newSubject.trim() && subjects.length < 4) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject("");
    }
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const addProject = () => {
    if (newProject.trim() && projects.length < 4) {
      setProjects([...projects, newProject.trim()]);
      setNewProject("");
    }
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="h-40 animate-pulse bg-slate-100 rounded-xl" />;
  }

  if (isEditing) {
    return (
      <Card className="border-indigo-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold text-slate-900">
            Edit Profile
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Degree Level
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    level === l
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full min-h-[100px] rounded-md border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Subjects */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Current Subjects{" "}
              <span className="text-slate-400 font-normal">(Max 4)</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {subjects.map((subject, index) => (
                <Badge key={index} variant="secondary" className="gap-1 pr-1">
                  {subject}
                  <button
                    onClick={() => removeSubject(index)}
                    className="hover:bg-slate-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {subjects.length < 4 && (
              <div className="flex gap-2">
                <input
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSubject()}
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add a subject..."
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSubject}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Current Projects{" "}
              <span className="text-slate-400 font-normal">(Max 4)</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {projects.map((project, index) => (
                <Badge key={index} variant="outline" className="gap-1 pr-1">
                  {project}
                  <button
                    onClick={() => removeProject(index)}
                    className="hover:bg-slate-100 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {projects.length < 4 && (
              <div className="flex gap-2">
                <input
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addProject()}
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add a project..."
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addProject}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="shrink-0">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-4xl font-bold text-indigo-600">
                {user.displayName?.charAt(0) || "U"}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {user.displayName}
              </h2>
              <p className="text-slate-500">{user.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500">Level</span>
              <Badge className="bg-indigo-600 hover:bg-indigo-700">
                {profile?.level || 1}
              </Badge>
            </div>
          </div>

          {profile?.bio && (
            <p className="text-slate-700 leading-relaxed max-w-2xl">
              {profile.bio}
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-6 pt-4">
            {profile?.subjects && profile.subjects.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  Current Subjects
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.subjects.map((subject, i) => (
                    <Badge key={i} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {profile?.projects && profile.projects.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  Projects
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.projects.map((project, i) => (
                    <Badge key={i} variant="outline">
                      {project}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
