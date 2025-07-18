import { jwtDecode } from 'jwt-decode';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RestaurantDetails.css";

function isTokenValid(token) {
    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        return decoded.exp > now;
    } catch (e) {
        return false;
    }
}

function StarRating({ rating, size = "main" }) {
    const percentage = (Math.min(rating, 5) / 5) * 100;
    const outerClass = size === "main" ? "main-stars-outer" : "review-stars-outer";
    const innerClass = size === "main" ? "main-stars-inner" : "review-stars-inner";

    return (
        <div className={outerClass}>
            <div className={innerClass} style={{ width: `${percentage}%` }}></div>
        </div>
    );
}

export default function RestaurantDetails({ restaurant, onClose }) {
    const navigate = useNavigate();
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    if (!restaurant) return null;

    const accessToken = localStorage.getItem("accessToken");

    const handleSubmit = async () => {
        // Kiểm tra token tồn tại và hợp lệ
        if (!accessToken || !isTokenValid(accessToken)) {
            localStorage.removeItem("accessToken");
            sessionStorage.setItem("postLoginRedirect", window.location.pathname);
            return navigate("/login");
        }

        if (!comment.trim() || rating === 0) {
            alert("Please enter both comment and rating.");
            return;
        }

        try {
            setSubmitting(true);
            const res = await fetch(`http://localhost:8080/api/restaurant/${restaurant.id}/review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify({ comment, rating })
            });

            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem("accessToken");
                    sessionStorage.setItem("postLoginRedirect", window.location.pathname);
                    return navigate("/login");
                }
                throw new Error("Failed to submit review");
            }

            const updatedAvgRating = await res.json();
            const user = JSON.parse(localStorage.getItem("user"));
            const username = user?.username || "Anonymous";

            restaurant.reviewDTOList.unshift({
                id: Date.now(),
                username,
                comment,
                rating,
                createDate: new Date().toISOString()
            });

            restaurant.rating = updatedAvgRating;
            setComment("");
            setRating(0);
        } catch (err) {
            console.error(err);
            alert("Failed to submit review.");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="restaurant-detail-card">
            <button className="close-btn" onClick={onClose}>✕</button>

            <h2>{restaurant.name}</h2>
            <p><strong>Address:</strong> {restaurant.address}</p>
            <p><strong>Opening Hours:</strong> {restaurant.openTime} - {restaurant.closingTime}</p>
            <p><strong>City:</strong> {restaurant.cityName}</p>

            <div className="rating">
                <strong>Rating:</strong>
                <StarRating rating={restaurant.rating} size="main" />
                <span className="rating-number">({restaurant.rating.toFixed(1)})</span>
            </div>

            <div className="dish-list">
                <strong>Dishes:</strong> {restaurant.dishResponseDTOList.map(d => d.name).join(", ")}
            </div>

            <div className="image-gallery">
                {restaurant.restaurantImageDTOList.map((img, idx) => (
                    <img key={idx} src={img.imageUrl} alt={`restaurant-${idx}`} />
                ))}
            </div>

            <div className="reviews">
                <strong>Customer Reviews:</strong>
                {restaurant.reviewDTOList.map((rev) => (
                    <div key={rev.id} className="review-card">
                        <p><strong>{rev.username}</strong> ({new Date(rev.createDate).toLocaleDateString()}):</p>
                        <p className="review-comment">"{rev.comment}"</p>
                        <div className="review-stars">
                            <StarRating rating={rev.rating} size="review" />
                        </div>
                    </div>
                ))}
            </div>


            <div className="review-form">
                <h4>Leave a Review</h4>
                <textarea
                    className="form-control"
                    placeholder="Write your comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div className="rating-select">
                    <label>Rating:</label>
                    {[1, 2, 3, 4, 5].map((val) => (
                        <button
                            key={val}
                            className={`rating-btn ${val <= rating ? "selected" : ""}`}
                            onClick={() => setRating(val)}
                            type="button"
                        >
                            ★
                        </button>
                    ))}
                </div>
                <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? "Submitting..." : "Submit"}
                </button>
            </div>

        </div>
    );
}
