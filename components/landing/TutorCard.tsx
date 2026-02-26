import Image from 'next/image';
import { AiFillStar } from 'react-icons/ai'; // Using react-icons

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
    <div className="group flex flex-col bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-[220px] w-full">
        <Image
          fill
          style={{ objectFit: 'cover' }}
          src={tutor.imageUrl}
          alt={`Tutor ${tutor.name}`}
          className="transition-transform group-hover:scale-110"
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>

        <div className="flex items-center space-x-1">
          <AiFillStar className="h-5 w-5 text-yellow-400" />
          <span className="text-sm text-gray-600">{tutor.rating}</span>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Subject:</span> {tutor.subject}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Institute:</span> {tutor.institute}
          </p>
        </div>
      </div>
    </div>
  );
}
