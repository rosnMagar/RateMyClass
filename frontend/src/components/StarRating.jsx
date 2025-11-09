import React, { useState } from 'react';
import { StarIcon } from './StarIcon';

function StarRating({ rating, onRatingChange }) {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none transition-transform hover:scale-110"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <StarIcon filled={star <= (hoveredRating || rating)} />
        </button>
      ))}
    </div>
  );
}

export default StarRating;

