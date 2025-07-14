import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tìm kiếm:", query);
  };

  return (
    <div className="position-fixed top-0 start-50 translate-middle-x z-3 w-100 py-2">
      <form
        className="mx-auto"
        onSubmit={handleSubmit}
        style={{ width: "60vw", maxWidth: "500px" }}
      >
        <div className="input-group rounded-pill bg-white shadow-sm">
          <input
            type="text"
            className="form-control bg-transparent px-3 rounded-pill"
            style={{
              outline: "none",
              border: "none",
              boxShadow: isFocused
                ? "0 0 0 0.2rem rgba(0, 123, 255, 0.3)"
                : "none",
              transition: "box-shadow 0.2s ease",
            }}
            placeholder="Search for food..."
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="btn btn-link px-3"
            type="submit"
            style={{ textDecoration: "none" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#666"
              viewBox="0 0 24 24"
              style={{ marginTop: "-5px" }}
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5
                16 5.91 13.09 3 9.5 3S3 5.91 3 9.5
                5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79
                l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14
                5 11.99 5 9.5S7.01 5 9.5 5
                14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
