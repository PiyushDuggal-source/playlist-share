import { Badge } from "./ui/Badge";

interface LevelBadgeProps {
  level: number;
  compact?: boolean;
}

const levelConfig = {
  1: {
    name: "Foundational",
    color: "bg-gray-100 text-gray-800 border-gray-300",
  },
  2: { name: "Diploma", color: "bg-blue-100 text-blue-800 border-blue-300" },
  3: {
    name: "BSc Degree",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  4: {
    name: "BS Degree",
    color: "bg-purple-100 text-purple-800 border-purple-300",
  },
};

export function LevelBadge({ level, compact = false }: LevelBadgeProps) {
  const config =
    levelConfig[level as keyof typeof levelConfig] || levelConfig[1];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full h-4 w-4 text-[10px] font-bold border ${config.color}`}
      >
        {level}
      </span>
    );
  }

  return (
    <Badge variant="outline" className={`${config.color} font-medium`}>
      {config.name}
    </Badge>
  );
}
