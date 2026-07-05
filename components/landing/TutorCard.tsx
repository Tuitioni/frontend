import Image from 'next/image';
import { AiFillStar } from 'react-icons/ai';

import { Button } from '@/components/ui/button';

interface TutorCardProps {
  tutor: {
    id: string;
    name: string;
    subject: string;
    institute: string;
    imageUrl: string;
    rating: number;
  };
}

export function TutorCard({ tutor }: TutorCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
      <div className="relative h-[200px] w-full overflow-hidden">
        <Image
          fill
          style={{ objectFit: 'cover' }}
          src={tutor.imageUrl}
          alt={`Tutor ${tutor.name}`}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-pill bg-card/90 px-2.5 py-1 text-xs font-bold tabular shadow-soft-sm backdrop-blur">
          <AiFillStar className="h-3.5 w-3.5 text-amber" />
          {tutor.rating}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold">{tutor.name}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{tutor.institute}</p>

        <div className="mt-3">
          <span className="inline-flex items-center rounded-pill bg-secondary px-3 py-1 text-xs font-semibold text-primary">
            {tutor.subject}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs font-medium text-muted-foreground">Verified tutor</span>
          <Button size="sm" className="rounded-pill">
            View profile
          </Button>
        </div>
      </div>
    </div>
  );
}
