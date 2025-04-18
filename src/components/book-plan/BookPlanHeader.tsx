
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BookPlanHeaderProps {
  title: string;
  genre?: string;
}

const BookPlanHeader: React.FC<BookPlanHeaderProps> = ({ title, genre }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">{title || 'Book Plan'}</h1>
        {genre && <p className="text-slate-500">{genre}</p>}
      </div>
      <Button onClick={() => navigate('/dashboard')} variant="outline">
        Back to Dashboard
      </Button>
    </div>
  );
};

export default BookPlanHeader;
