import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  name: string;
  createdAt: string;
  allLeads: number;
  assignees: number;
  leader: string;
  id: string;
}

const ProjectIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#F0EEF8" />
    <circle cx="22" cy="20" r="10" fill="#8B5CF6" />
    <rect x="8" y="14" width="18" height="18" rx="4" fill="#F59E0B" />
    <circle cx="14" cy="14" r="5" fill="#F59E0B" opacity="0.6" />
  </svg>
);

export default function ProjectCard({
  name = "Medical App (iOS native)",
  createdAt = "Sep 12, 2020",
  allLeads = 34,
  assignees = 5,
  leader,
  id,
}: ProjectCardProps) {
  return (
    <Link href={`/dashboard/projects/${id}`}>
      <Card className="flex max-sm:flex-col rounded-xl flex-row w-full items-center gap-8 px-6 py-5 cursor-pointer">
        {/* Left: Info */}
        <div className="flex  items-center gap-4">
          <div className="shrink-0 w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
            <ProjectIcon />
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium">{name}</p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Created {createdAt}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-14 bg-border" />

        {/* Right: Stats */}
        <div className="flex max-sm:flex-col gap-10 shrink-0 ">
          <div>
            <p className="text-sm text-muted-foreground mb-1">All leads</p>
            <p className="text-xl font-medium">{allLeads}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Assignees</p>
            <p className="text-xl font-medium">{assignees}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Team Leader</p>
            <p className="text-xl font-medium">{leader}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
