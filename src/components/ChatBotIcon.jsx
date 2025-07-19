import { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";

export default function ChatBotIcon() {
    const [isOpen, setIsOpen] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [city, setCity] = useState(() => sessionStorage.getItem("city") || "không rõ");

    const toggleChat = () => {
        if (!isOpen) setAnimate(true);
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (!isOpen) {
            const timeout = setTimeout(() => setAnimate(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input;
        const fullMessage = city && city !== "không rõ"
            ? `Hiện tại tôi đang ở ${city}, và tôi muốn hỏi là ${userText}`
            : userText;

        setMessages((prev) => [...prev, { from: "user", text: userText }]);
        setInput("");

        try {
            const response = await fetch("http://localhost:8080/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: fullMessage }),
            });

            const data = await response.json();
            setMessages((prev) => [...prev, { from: "bot", text: data.response || "Không có phản hồi." }]);
        } catch (err) {
            setMessages((prev) => [...prev, { from: "bot", text: "Lỗi khi gửi tin nhắn." }]);
        }
    };

    const animatedStyle = {
        transition: "all 0.3s ease-in-out",
        opacity: animate ? 1 : 0,
        transform: animate ? "scale(1)" : "scale(0.8)",
    };

    return (
        <div style={{ position: "fixed", bottom: "20px", right: "2px", zIndex: 9999 }}>
            {isOpen ? (
                <div style={animatedStyle}>
                    <Card style={{ width: "400px", height: "400px", borderRadius: "10px" }}>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <span>Chat Bot</span>
                            <Button variant="outline-secondary" size="sm" onClick={toggleChat}>✕</Button>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: "600px", height: "600px", overflowY: "auto" }}>
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`mb-2 text-${msg.from === "user" ? "end" : "start"}`}>
                                    <span className={`p-2 rounded bg-${msg.from === "user" ? "primary text-white" : "light"}`}>
                                        {msg.text}
                                    </span>
                                </div>
                            ))}
                        </Card.Body>
                        <Card.Footer>
                            <Form onSubmit={handleSend}>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tin nhắn..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                            </Form>
                        </Card.Footer>
                    </Card>
                </div>
            ) : (
                <Button
                    variant="light"
                    className="shadow d-flex align-items-center justify-content-center m-2 z-2"
                    style={{ width: "52px", height: "52px", borderRadius: "10px" }}
                    onClick={toggleChat}
                >
                    <i className="bi bi-robot fs-4"></i>
                </Button>
            )}
        </div>
    );
}
