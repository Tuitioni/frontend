import React from "react";
import { Button } from "@/components/ui/button";
import { Post } from "@/types/Post";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Calendar, BookOpen, IndianRupee } from "lucide-react";

interface JobCardProps extends Post {
  onApply: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  firstName,
  lastName,
  district,
  area,
  subjects,
  salary,
  numberOfDays,
  medium,
  class: studentClass,
  createdAt,
  onApply,
}) => {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer bg-white">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">
              {firstName} {lastName}
            </h3>
            <p className="text-sm text-gray-600">
              Class {studentClass} • {medium.replace(/_/g, " ").toLowerCase()}
            </p>
          </div>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} />
          <span>
            {area}, {district}
          </span>
        </div>

        {/* Subjects */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen size={16} />
          <span>
            {subjects.slice(0, 2).join(", ")}
            {subjects.length > 2 ? ` +${subjects.length - 2} more` : ""}
          </span>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-gray-600" />
            <span>{numberOfDays} days/week</span>
          </div>
          <div className="flex items-center gap-1">
            <IndianRupee size={16} className="text-gray-600" />
            <span className="font-semibold">{salary}/month</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onApply(id);
            }}
            className="w-full"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
