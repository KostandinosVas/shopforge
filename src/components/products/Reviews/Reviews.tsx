'use client';

import { useState } from 'react';
import styles from './Reviews.module.css';

type Review = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: Date | null;
  userName: string | null;
};

type Props = {
  productId: number;
  initialReviews: Review[];
  isLoggedIn: boolean;
  hasReviewed: boolean;
};

function Stars({ rating, interactive = false, onChange }: {
  rating: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${styles.star} ${star <= (hovered || rating) ? styles.starFilled : ''}`}
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function Reviews({ productId, initialReviews, isLoggedIn, hasReviewed }: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(hasReviewed);

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError('Please select a rating'); return; }
    setSubmitting(true);
    setError('');

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, rating, comment }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setSubmitting(false);
      return;
    }

    setReviews((prev) => [
      { id: Date.now(), rating, comment, createdAt: new Date(), userName: 'You' },
      ...prev,
    ]);
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Reviews</h2>
        {reviews.length > 0 && (
          <div className={styles.avgRating}>
            <Stars rating={Math.round(avgRating)} />
            <span>{avgRating.toFixed(1)} ({reviews.length})</span>
          </div>
        )}
      </div>

      {!submitted && isLoggedIn && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.formTitle}>Write a review</h3>
          <Stars rating={rating} interactive onChange={setRating} />
          <textarea
            className={styles.textarea}
            placeholder="Share your experience (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {!isLoggedIn && (
        <p className={styles.loginPrompt}>
          <a href="/login">Log in</a> to leave a review.
        </p>
      )}

      {submitted && !hasReviewed && (
        <p className={styles.thankYou}>Thanks for your review!</p>
      )}

      {reviews.length === 0 ? (
        <p className={styles.empty}>No reviews yet. Be the first!</p>
      ) : (
        <div className={styles.list}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.review}>
              <div className={styles.reviewHeader}>
                <Stars rating={review.rating} />
                <span className={styles.reviewer}>{review.userName ?? 'Anonymous'}</span>
                <span className={styles.date}>
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                </span>
              </div>
              {review.comment && <p className={styles.comment}>{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}