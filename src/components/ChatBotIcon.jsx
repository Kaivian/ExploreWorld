import { useEffect, useRef, useState } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";

export default function ChatBotIcon() {
    const [isOpen, setIsOpen] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [city, setCity] = useState(() => sessionStorage.getItem("city") || "không rõ");
    const [loading, setLoading] = useState(false);

    const scrollRef = useRef(null);

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

    // Tự scroll xuống cuối khi có message mới
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Hàm fetch có timeout
    function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        return fetch(url, { ...options, signal: controller.signal })
            .finally(() => clearTimeout(timer));
    }

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userText = input.trim();
        const fullMessage = city && city !== "không rõ"
            ? `Hiện tại tôi đang ở ${city}, và tôi muốn hỏi là ${userText}`
            : userText;
            
        setMessages(prev => [...prev, { from: "user", text: userText }]);
        setInput("");

        // Placeholder chờ phản hồi
        const waitingId = crypto.randomUUID();
        setMessages(prev => [...prev, { id: waitingId, from: "bot", text: "Waiting for response..." }]);
        setLoading(true);

        try {
            const response = await fetchWithTimeout("http://localhost:8080/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: fullMessage })
            }, 30000);

            if (!response.ok) throw new Error("HTTP " + response.status);
            const data = await response.json();

            setMessages(prev =>
                prev.map(m => m.id === waitingId
                    ? { ...m, text: data.reply || "Không có phản hồi." }
                    : m
                )
            );
        } catch (err) {
            const isAbort = err.name === "AbortError";
            setMessages(prev =>
                prev.map(m =>
                    m.id === waitingId
                        ? {
                            ...m, text: isAbort
                                ? "Timeout: Server không phản hồi trong 30s."
                                : "Lỗi khi gửi tin nhắn."
                        }
                        : m
                )
            );
        } finally {
            setLoading(false);
        }
    };

    // Gửi bằng Enter (Shift+Enter xuống dòng) – nếu bạn muốn chỉ input 1 dòng thì giữ code hiện tại
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    const animatedStyle = {
        transition: "all 0.3s ease-in-out",
        opacity: animate ? 1 : 0,
        transform: animate ? "scale(1)" : "scale(0.8)"
    };

    return (
        <div style={{ position: "fixed", bottom: "20px", right: "2px", zIndex: 9999 }}>
            {isOpen ? (
                <div style={animatedStyle}>
                    <Card style={{ width: "400px", height: "480px", borderRadius: "12px" }}>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Chat Bot</strong>
                                <div style={{ fontSize: "0.7rem", color: "#666" }}>City: {city}</div>
                            </div>
                            <Button variant="outline-secondary" size="sm" onClick={toggleChat}>✕</Button>
                        </Card.Header>
                        <Card.Body
                            ref={scrollRef}
                            style={{ height: "360px", overflowY: "auto", background: "#f8f9fa", padding: "12px" }}
                        >
                            {messages.map((msg, idx) => {
                                const isUser = msg.from === "user";
                                return (
                                    <div
                                        key={msg.id || idx}
                                        className="d-flex mb-2"
                                        style={{ justifyContent: isUser ? "flex-end" : "flex-start" }}
                                    >
                                        <div
                                            style={{
                                                maxWidth: "75%",
                                                padding: "8px 12px",
                                                borderRadius: "14px",
                                                background: isUser ? "#0d6efd" : "#e9ecef",
                                                color: isUser ? "#fff" : "#212529",
                                                fontSize: "0.9rem",
                                                whiteSpace: "pre-wrap",
                                                lineHeight: 1.35
                                            }}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                );
                            })}
                        </Card.Body>
                        <Card.Footer>
                            <Form onSubmit={handleSend} className="d-flex gap-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tin nhắn..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={loading}
                                />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={!input.trim() || loading}
                                    style={{ minWidth: "90px" }}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner size="sm" animation="border" className="me-1" />
                                            Sending
                                        </>
                                    ) : "Send"}
                                </Button>
                            </Form>
                        </Card.Footer>
                    </Card>
                </div>
            ) : (
                <Button
                    variant="light"
                    className="shadow d-flex align-items-center justify-content-center m-2 z-2"
                    style={{ width: "52px", height: "52px", borderRadius: "12px" }}
                    onClick={toggleChat}
                    title="Open chat"
                >
                    <i className="bi bi-robot fs-4"></i>
                </Button>
            )}
        </div>
    );
}
