import React from 'react';
import { Star } from 'lucide-react';

interface ReviewTestimonialProps {
  toolName: string;
  ratingValue: string;
  ratingCount: string;
  authorName: string;
  reviewText: string;
}

export default function ReviewTestimonial({ toolName, ratingValue, ratingCount, authorName, reviewText }: ReviewTestimonialProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `CosmoxHub ${toolName}`,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "ratingCount": ratingCount
    },
    "review": {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": authorName
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": ratingValue,
        "bestRating": "5"
      },
      "reviewBody": reviewText
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-6 h-6 ${i < Math.floor(parseFloat(ratingValue)) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
          ))}
        </div>
        <p className="text-lg text-slate-300 italic">
          "{reviewText}"
        </p>
        <div className="mt-4">
          <p className="font-semibold text-white">{authorName}</p>
          <p className="text-sm text-slate-500">Verified User</p>
        </div>
        <div className="text-xs text-slate-500 mt-2">
          Rated {ratingValue}/5 based on {ratingCount} reviews
        </div>
      </div>
    </div>
  );
}
