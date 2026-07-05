import React from 'react';

import { SectionTitle } from './SectionTitle';
import { SectionWrapper } from './SectionWrapper';
import { TutorCard } from './TutorCard';

interface Tutor {
  id: string;
  subject: string;
  institute: string;
  imageUrl: string;
  name: string;
  rating: number;
}

const dummyTutors: Tutor[] = [
  {
    id: '1',
    name: 'Rifat Ahsan',
    subject: 'Physics',
    institute: 'University of Dhaka',
    imageUrl: 'https://picsum.photos/seed/rifat/400/300',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Nusrat Jahan',
    subject: 'Mathematics',
    institute: 'BUET',
    imageUrl: 'https://picsum.photos/seed/nusrat/400/300',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Tanvir Rahman',
    subject: 'Chemistry',
    institute: 'North South University',
    imageUrl: 'https://picsum.photos/seed/tanvir/400/300',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Farzana Nawrin',
    subject: 'English',
    institute: 'BRAC University',
    imageUrl: 'https://picsum.photos/seed/farzana/400/300',
    rating: 4.9,
  },
];

export default function TopTutors() {
  return (
    <SectionWrapper>
      <SectionTitle
        eyebrow="Featured tutors"
        title="Meet our top-rated tutors"
        subtitle="Hand-picked, verified teachers loved by students across the country."
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dummyTutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>
    </SectionWrapper>
  );
}
