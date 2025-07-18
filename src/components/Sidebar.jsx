import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            <button
                className="btn position-fixed top-0 start-0 m-2"
                style={{ 
                    zIndex: 1060 ,
                    backgroundColor: "#ffffff",
                }}
                onClick={toggleSidebar}
            >
                ☰
            </button>

            <div
                className="position-fixed top-0 start-0 h-100 border-end shadow"
                style={{
                    backgroundColor: "#ffffff",
                    width: "600px",
                    zIndex: 1050,
                    transform: isOpen ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.3s ease-in-out",
                    paddingTop: "70px",
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                }}
            >

                <h5>Menu</h5>
                <ul className="list-unstyled">
                    <li>
                        <Link to="/" className="text-decoration-none d-block py-2" onClick={toggleSidebar}>
                            Trang chính
                        </Link>
                    </li>
                    <li>
                        <Link to="/da-nang" className="text-decoration-none d-block py-2" onClick={toggleSidebar}>
                            Đà Nẵng
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="text-decoration-none d-block py-2" onClick={toggleSidebar}>
                            Đăng nhập
                        </Link>
                    </li>
                </ul>
            </div>

            {isOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ zIndex: 1040, backgroundColor: "rgba(0,0,0,0)" }}
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
}
