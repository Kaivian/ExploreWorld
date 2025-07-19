import { useEffect, useRef, useState } from "react";

/* ========================= Helpers ========================= */
function toYouTubeEmbed(raw) {
    if (!raw) return null;
    const url = raw.trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(url))
        return `https://www.youtube-nocookie.com/embed/${url}?rel=0`;
    if (/youtube\.com\/embed\//i.test(url)) return ensureRelParam(url);
    const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{11})/);
    if (m && m[1]) return `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0`;
    return null;
}
function ensureRelParam(embedUrl) {
    return /[?&]rel=/.test(embedUrl)
        ? embedUrl
        : embedUrl + (embedUrl.includes("?") ? "&" : "?") + "rel=0";
}
function toAbsoluteImageUrl(u) {
    if (!u) return "";
    if (/^(https?:|data:)/i.test(u)) return u;
    return `https://comtamthuankieu.com.vn${u.startsWith("/") ? "" : "/"}${u}`;
}
const FALLBACK_DISH_IMAGE = "/images/fallback-dish.png";

/* ========================= Component ========================= */
export default function HeaderWithSidebar({ onSearchResults, onClearSearch }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [dishList, setDishList] = useState([]);
    const [selectedDish, setSelectedDish] = useState(null);
    const searchAbortRef = useRef(null);

    /* Load list */
    useEffect(() => {
        const cityID = sessionStorage.getItem("cityID") || 1;
        fetch(`http://localhost:8080/api/city/${cityID}/dishes`)
            .then(r => r.json())
            .then(setDishList)
            .catch(e => console.error("Error loading city dishes:", e));
    }, []);

    /* Open sidebar when typing */
    useEffect(() => {
        if (query.trim()) setSidebarOpen(true);
    }, [query]);

    const filteredDishes = query.trim()
        ? dishList.filter(d =>
            d.name.toLowerCase().includes(query.trim().toLowerCase())
        )
        : [];

    /* Debounced search for restaurants */
    useEffect(() => {
        const trimmed = query.trim();
        if (searchAbortRef.current) searchAbortRef.current.abort();
        if (!trimmed) {
            onClearSearch?.();
            return;
        }

        const controller = new AbortController();
        searchAbortRef.current = controller;

        const t = setTimeout(() => {
            const url = new URL("http://localhost:8080/api/restaurants/search");
            url.searchParams.append("dishName", trimmed);
            fetch(url, { signal: controller.signal })
                .then(r => {
                    if (!r.ok) throw new Error("Search failed");
                    return r.json();
                })
                .then(data => onSearchResults?.(data))
                .catch(e => {
                    if (e.name !== "AbortError") {
                        console.error(e);
                        onSearchResults?.([]);
                    }
                });
        }, 450); // <- đây là thời gian debounce (450ms)

        return () => {
            clearTimeout(t);
            controller.abort();
        };
    }, [query]);

    const handleDishClick = id => {
        fetch(`http://localhost:8080/api/dish/${id}`)
            .then(r => r.json())
            .then(data => {
                setSelectedDish(data);
                setSidebarOpen(true);
            })
            .catch(e => console.error("Detail error:", e));
    };

    const toggleSidebar = () => {
        setSidebarOpen(o => !o);
        if (sidebarOpen) setSelectedDish(null);
    };

    return (
        <>
            <StyleBlock />

            {/* Toggle */}
            <button
                className={`hsb-toggle ${sidebarOpen ? "open" : ""}`}
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
            >
                <span />
                <span />
                <span />
            </button>

            {/* Sidebar */}
            <aside className={`hsb-sidebar ${sidebarOpen ? "show" : ""}`}>
                <div className="hsb-inner">
                    {selectedDish ? (
                        <SelectedDish dish={selectedDish} />
                    ) : (
                        <DishList
                            query={query}
                            dishes={query.trim() ? filteredDishes : dishList}
                            onSelect={handleDishClick}
                        />
                    )}
                </div>
            </aside>

            {/* Search */}
            <div className={`hsb-search-wrapper ${sidebarOpen ? "shift" : ""}`}>
                <div className="hsb-search-shell">
                    <input
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value);
                            setSelectedDish(null);
                        }}
                        placeholder="Search dishes or restaurants..."
                        className="hsb-search-input"
                    />
                    {query && (
                        <button
                            className="hsb-clear-btn"
                            onClick={() => {
                                setQuery("");
                                onClearSearch?.();
                            }}
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>
        </>
    );

    /* ------------ Inner Components ------------ */
    function SelectedDish({ dish }) {
        const embedUrl = toYouTubeEmbed(dish.videoUrl);

        return (
            <div className="dish-detail">
                <button
                    className="detail-close-btn"
                    onClick={() => setSelectedDish(null)}
                    aria-label="Close detail"
                >
                    ×
                </button>

                <h1 className="detail-title">{dish.name}</h1>

                <div className="detail-info-col">
                    {/* Row: City + Category */}
                    <div className="meta-row-two">
                        <MetaItem label="City" value={dish.cityName} />
                        <MetaItem label="Category" value={dish.categoryName} />
                    </div>

                    {/* Video */}
                    {dish.videoUrl && (
                        <div className="info-block full">
                            <h4 className="ib-title">Video</h4>
                            {!embedUrl ? (
                                <p className="muted small">
                                    Video URL invalid or cannot embed.
                                </p>
                            ) : (
                                <div className="video-wrapper wide">
                                    <iframe
                                        src={embedUrl}
                                        title="Dish Video"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        referrerPolicy="strict-origin-when-cross-origin"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {dish.feature && (
                        <div className="info-block full">
                            <h4 className="ib-title">Feature</h4>
                            <p className="ib-text">{dish.feature}</p>
                        </div>
                    )}

                    {dish.history && (
                        <div className="info-block full">
                            <h4 className="ib-title">History</h4>
                            <p className="ib-text">{dish.history}</p>
                        </div>
                    )}

                    <div className="info-block full">
                        <h4 className="ib-title">Gallery</h4>
                        <div className="images-grid gallery-wide">
                            {dish.dishImageDTOList?.length ? (
                                dish.dishImageDTOList.map((img, i) => (
                                    <figure className="img-card" key={i}>
                                        <img
                                            src={toAbsoluteImageUrl(img.imageUrl)}
                                            alt={dish.name}
                                            loading="lazy"
                                            onError={e => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = FALLBACK_DISH_IMAGE;
                                            }}
                                        />
                                    </figure>
                                ))
                            ) : (
                                <p className="muted small">No images.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function DishList({ query, dishes, onSelect }) {
        return (
            <div className="dish-list">
                <h3 className="list-heading">
                    {query.trim() ? "Search Results" : "Dish Suggestions"}
                </h3>

                {dishes.length === 0 && query.trim() && (
                    <p className="muted small">No dishes found.</p>
                )}

                <div className="card-grid">
                    {dishes.map(dish => {
                        const rawUrl =
                            dish.imageUrl ||
                            dish.image_url ||
                            dish.url ||
                            (dish.dishImageDTOList &&
                                dish.dishImageDTOList[0]?.imageUrl) ||
                            (dish.images && dish.images[0]?.imageUrl);
                        const imgSrc = toAbsoluteImageUrl(rawUrl);
                        return (
                            <button
                                key={dish.id}
                                className="dish-card"
                                onClick={() => onSelect(dish.id)}
                                aria-label={`Open ${dish.name}`}
                            >
                                <div className="thumb-wrapper">
                                    <img
                                        src={imgSrc}
                                        alt={dish.name}
                                        loading="lazy"
                                        onError={e => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = FALLBACK_DISH_IMAGE;
                                        }}
                                    />
                                    <div className="thumb-overlay" />
                                </div>
                                <div className="dish-info">
                                    <h4 className="dish-name">{dish.name}</h4>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    function MetaItem({ label, value }) {
        if (!value) return null;
        return (
            <div className="meta-item">
                <span className="meta-label">{label}</span>
                <span className="meta-value">{value}</span>
            </div>
        );
    }
}

/* ========================= Styles ========================= */
function StyleBlock() {
    return (
        <style>{`
:root {
  --sidebar-width: 430px;
  --transition: .35s cubic-bezier(.4,.2,.2,1);
  --blur-bg: 18px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,.05),0 0 0 1px rgba(0,0,0,.04);
  --shadow: 0 8px 24px -12px rgba(15,60,120,.2),0 4px 12px -6px rgba(15,60,120,.15);

  --bg: #f5faff;
  --bg-alt: #eef7ff;
  --panel: #ffffff;
  --panel-alt: #f9fcff;
  --glass: rgba(255,255,255,0.85);
  --border: rgba(40,70,110,0.16);
  --divider: rgba(40,70,110,0.08);
  --text: #153047;
  --text-dim: #6c7f90;
  --accent: #153047;
  --accent-grad: linear-gradient(135deg,#7bceff 0%,#43aaff 50%,#1d90ff 100%);
  --heading-grad: linear-gradient(90deg,#1d90ff 0%,#43aaff 40%,#66cfff 100%);
  --focus: #153047;
}

html,body {
  font-family: Inter, system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at 60% 25%, #ffffff 0%, #edf6ff 55%, #ddecff 100%);
  min-height:100vh;
}

/* Toggle */
.hsb-toggle {
  position:fixed; top:8px; left:8px;
  width:40px; height:40px;
  border:none;
  background: var(--glass);
  backdrop-filter: blur(var(--blur-bg)) saturate(1.3);
  border-radius:10px;
  display:flex; flex-direction:column; justify-content:center; gap:6px; align-items:center;
  cursor:pointer;
  transition: var(--transition);
  z-index:1200;
  box-shadow: var(--shadow-sm);
}
.hsb-toggle span {
  width:24px; height:3px; background: linear-gradient(90deg,#1d90ff,#5cc3ff);
}
.hsb-toggle.open span:nth-child(1){ transform:translateY(9px) rotate(45deg); }
.hsb-toggle.open span:nth-child(2){ opacity:0; }
.hsb-toggle.open span:nth-child(3){ transform:translateY(-9px) rotate(-45deg); }
.hsb-toggle:hover { transform:translateY(-3px); box-shadow:0 10px 28px -12px rgba(0,0,0,.25); }

/* Sidebar */
.hsb-sidebar {
  position:fixed; inset:0 auto 0 0;
  width:var(--sidebar-width);
  transform:translateX(-110%);
  transition: var(--transition);
  z-index:1100;
  background: linear-gradient(150deg,var(--panel) 0%,var(--panel-alt) 120%);
  backdrop-filter: blur(var(--blur-bg)) saturate(1.4);
  padding: clamp(20px,1.6vw,32px) clamp(24px,1.8vw,36px) 56px;
  box-shadow: var(--shadow);
  border-right:1px solid var(--border);
  display:flex; flex-direction:column;
  overflow:hidden;
}
.hsb-sidebar.show { transform:translateX(0); }
.hsb-inner { overflow-y:auto; padding-right:6px; scrollbar-width:thin; scrollbar-color:#6abfff transparent; }
.hsb-inner::-webkit-scrollbar { width:10px; }
.hsb-inner::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg,#6abfff,#1d90ff);
  border-radius:20px; border:2px solid var(--panel);
}

/* Search */
.hsb-search-wrapper {
  position:fixed;
  top:8px; left:50%; transform:translateX(-50%);
  width:min(340px,70%);
  transition: var(--transition);
  z-index:1150;
}
.hsb-search-wrapper.shift { left:calc(var(--sidebar-width) + 40px); transform:translateX(0); }
@media (max-width:960px){
  .hsb-search-wrapper.shift { left:50%; transform:translateX(-50%); }
}
.hsb-search-shell {
  display:flex; align-items:center; gap:8px;
  background: var(--glass);
  backdrop-filter: blur(var(--blur-bg)) saturate(1.2);
  border-radius:999px;
  padding:4px 14px;
  box-shadow: var(--shadow-sm);
}
.hsb-search-input {
  flex:1; border:none; outline:none;    
  background:transparent;
  font-size:14.5px; padding:4px 2px;
  letter-spacing:.3px; color:var(--text);
  border-radius:999px;
}
.hsb-search-input::placeholder { color:var(--text-dim); font-weight:500; opacity:.7; border-radius:999px; }
.hsb-clear-btn {
  background: var(--accent-grad);
  border:none; color:#fff;
  width:30px; height:30px;
  border-radius:50%; font-size:14px; font-weight:600;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition: var(--transition);
  box-shadow:0 6px 16px -6px rgba(18, 29, 39, 0.5);
}
.hsb-clear-btn:hover { transform:scale(1.08) rotate(90deg); }

/* List */
.dish-list { display:flex; flex-direction:column; gap:22px; animation: rise .5s ease; }
@keyframes rise { from{opacity:0; transform:translateY(12px);} to{opacity:1; transform:translateY(0);} }
.list-heading {
  text-align: center;
  margin:40px 0 0;
  font:600 2rem/1.2 Inter,sans-serif;
  background: var(--heading-grad);
  -webkit-background-clip:text;
  color:transparent;
  letter-spacing:.5px;
}
.card-grid {
  --min:190px;
  display:grid; gap:18px;
  grid-template-columns: repeat(auto-fill,minmax(var(--min),1fr));
}
@media (max-width:560px){
  .card-grid { --min:150px; }
  .hsb-sidebar { width:100%; }
}
.dish-card {
  position:relative;
  background: linear-gradient(145deg,var(--panel) 0%,var(--panel-alt) 130%);
  border:1px solid var(--border);
  border-radius:22px;
  display:flex; flex-direction:column;
  overflow:hidden;
  cursor:pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}
.dish-card:hover { transform:translateY(-4px); box-shadow:0 14px 36px -14px rgba(0,0,0,.22); border-color:rgba(29,144,255,.4); }
.thumb-wrapper { aspect-ratio:16/12; overflow:hidden; position:relative; }
.thumb-wrapper img { width:100%; height:100%; object-fit:cover; transition:.65s ease; filter:saturate(1.05); }
.dish-card:hover img { transform:scale(1.06); filter:saturate(1.16) contrast(1.05); }
.thumb-overlay { position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.35) 100%); opacity:.5; }
.dish-info { padding:12px 14px 16px; }
.dish-name { margin:0; font-size:15px; font-weight:600; line-height:1.25; letter-spacing:.25px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; color:var(--text); }

/* Detail (one column) */
.dish-detail {
  position:relative;
  display:flex;
  flex-direction:column;
  gap:26px;
  animation: detailIn .5s ease;
}
@keyframes detailIn { from{opacity:0; transform:translateY(16px);} to{opacity:1; transform:translateY(0);} }

.detail-close-btn {
  position:absolute; top:0px; right:0px;
  width:40px; height:40px;
  border:none; cursor:pointer;
  background: var(--glass);
  backdrop-filter: blur(14px) saturate(1.3);
  border:1px solid var(--border);
  border-radius:16px;
  font-size:22px; line-height:1;
  color:var(--text);
  display:flex; align-items:center; justify-content:center;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}
.detail-close-btn:hover { background:var(--accent-grad); color:#fff; transform:scale(1.05); border-color:transparent; }

.detail-title {
  margin:44px 0 4px;
  font-size: clamp(1.9rem,1.55rem + 0.9vw,2.4rem);
  line-height:1.05;
  font-weight:800;
  background: var(--heading-grad);
  -webkit-background-clip:text;
  color:transparent;
  letter-spacing:.55px;
  word-break:break-word;
}

.detail-info-col {
  display:flex;
  flex-direction:column;
  gap:26px;
}

/* Row City + Category */
.meta-row-two {
  display:grid;
  grid-template-columns: repeat(auto-fit,minmax(180px,1fr));
  gap:18px;
}
.meta-row-two .meta-item {
  background: linear-gradient(140deg,var(--panel) 0%,var(--panel-alt) 130%);
  border:1px solid var(--border);
  border-radius:20px;
  padding:16px 18px 14px;
  display:flex;
  flex-direction:column;
  gap:6px;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  min-height:94px;
}
.meta-row-two .meta-item:hover {
  transform:translateY(-3px);
  box-shadow:0 10px 24px -12px rgba(0,0,0,.18);
}
.meta-row-two .meta-label {
  font-size:11px;
  font-weight:700;
  letter-spacing:.9px;
  text-transform:uppercase;
  color:var(--text-dim);
}
.meta-row-two .meta-value {
  font-size:14px;
  font-weight:600;
  line-height:1.25;
  color:var(--text);
}

/* Info blocks */
.info-block {
  background: linear-gradient(135deg,var(--panel) 0%,var(--panel-alt) 120%);
  border:1px solid var(--border);
  border-radius:24px;
  padding:18px 20px 20px;
  display:flex;
  flex-direction:column;
  gap:14px;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  position:relative;
}
.info-block.full { width:100%; }
.info-block:hover { transform:translateY(-3px); box-shadow:0 14px 30px -14px rgba(0,0,0,.22); }
.ib-title {
  margin:0;
  font-size:13px;
  letter-spacing:.8px;
  font-weight:700;
  text-transform:uppercase;
  color:var(--text-dim);
}
.ib-text {
  margin:0;
  font-size:14.2px;
  line-height:1.55;
  color:var(--text);
  font-weight:500;
  white-space:pre-wrap;
}

/* Video */
.video-wrapper.wide {
  position:relative;
  width:100%;
  aspect-ratio:16/9;
  border-radius:22px;
  overflow:hidden;
  background:#000;
  border:1px solid var(--border);
  box-shadow: var(--shadow-sm);
}
.video-wrapper.wide iframe {
  position:absolute; inset:0; width:100%; height:100%; border:0;
}

/* Gallery */
.images-grid.gallery-wide {
  display:grid;
  grid-template-columns: repeat(auto-fill,minmax(150px,1fr));
  gap:16px;
}
@media (min-width:1000px){
  .images-grid.gallery-wide {
    grid-template-columns: repeat(auto-fill,minmax(170px,1fr));
  }
}
.img-card {
  position:relative; margin:0;
  aspect-ratio:4/3;
  border-radius:18px;
  overflow:hidden;
  background:var(--panel-alt);
  border:1px solid var(--border);
  box-shadow: var(--shadow-sm);
  cursor:zoom-in;
  transition: var(--transition);
}
.img-card img {
  width:100%; height:100%; object-fit:cover;
  transition:.6s ease; filter:saturate(1.05);
}
.img-card:hover {
  transform:translateY(-3px); box-shadow:0 10px 24px -12px rgba(0,0,0,.2);
}
.img-card:hover img {
  transform:scale(1.07); filter:saturate(1.15) contrast(1.05);
}

.muted { color:var(--text-dim); }
.small { font-size:12px; letter-spacing:.3px; }

button:focus-visible, .hsb-search-input:focus-visible {
  outline-offset:3px;
  border-radius:8px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce){
  * { animation:none !important; transition:none !important; }
}
`}</style>
    );
}
