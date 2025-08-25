import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const responses = {
    "Get a Ticket": "Please select ",
    "Ticket Prices": "The ticket prices are as follows: Adults - $10, Children - $5.",
    "Booking Process": "To book a ticket, click on the 'Get a Ticket' link and follow the instructions.",
    "Cancel Ticket": "To cancel a ticket, please contact our support team at support@example.com.",
    "Cultural Heritage": "India has a rich cultural heritage, including classical dance forms, music, and art. Do you want to learn about a specific aspect?",
    "Dance Forms": "India's classical dance forms include Bharatanatyam, Kathak, Kuchipudi, and more.",
    "Music": "Indian classical music includes genres like Hindustani and Carnatic music.",
    "Art": "Indian art encompasses a wide range of styles, from ancient cave paintings to modern art.",
    "Return to Main Menu": "Taking you to the main menus",
    "Exit": "Goodbye! Feel free to reopen the chatbot anytime.",
    "Museum Timings": "The museum is open from 9 AM to 5 PM daily.",
    "Fare": "The fare details are as follows: Adults - $10, Children - $5.",
    "Find My Museum": "Please provide your location to find the nearest museum.",
    "Enquiry": "What do you want to enquire",
};

const buttonSets = {
    default: ["Get a Ticket", "Cultural Heritage", "Enquiry", "Exit"],
    "Get a Ticket": [],
    "Enquiry": ["Museum Timings", "Fare", "Find My Museum", "Return to Main Menu", "Exit"],
    "Cultural Heritage": ["Dance Forms", "Music", "Art", "Return to Main Menu", "Exit"],
};

const Chatbot = () => {
    const [messages, setMessages] = useState([{ text: "NAMASTE, How can I assist you?", sender: 'bot' }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentButtons, setCurrentButtons] = useState('default');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [options, setOptions] = useState([]);
    const [isChatbotVisible, setIsChatbotVisible] = useState(true);
    const [tableData, setTableData] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetch('http://localhost:5000/state-data')
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((data) => setOptions(data))
            .catch((error) => console.error("Error fetching state data:", error));
    }, []);

    const handleSend = () => {
        if (input.trim()) {
            const userMessage = { text: input, sender: 'user' };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setInput('');
            simulateBotResponse(input);
        }
    };

    const simulateBotResponse = (userInput) => {
        setIsTyping(true);
        setTimeout(() => {
            const botMessage = {
                text: getBotResponse(userInput),
                sender: 'bot',
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
            setIsTyping(false);

            if (userInput === "Exit") {
                setIsChatbotVisible(false);
            } else if (userInput === "Get a Ticket") {
                setShowDropdown(true);
                setCurrentButtons(userInput);
            return;
            } else if (buttonSets[userInput]) {
                setCurrentButtons(userInput);
                setShowDropdown(false);
            }

            if (userInput === "Return to Main Menu") {
                setCurrentButtons('default');
            }
        }, 1000);
    };

    const getBotResponse = (userInput) => {
        return responses[userInput] || "Sorry, I don't have that information. Can I help you with something else?";
    };

    const quickReply = (reply) => {
        const userMessage = { text: reply, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        simulateBotResponse(reply);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:5000/get-museum-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state: selectedOption }),
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setTableData(data);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const renderButtons = () => {
        return buttonSets[currentButtons]?.map((buttonText) => (
            <button key={buttonText} onClick={() => quickReply(buttonText)}>{buttonText}</button>
        ));
    };

    return (
        <>
            {isChatbotVisible && (
                <div className="chatbot-container">
                    <button
                        className="close-chatbot"
                        onClick={() => setIsChatbotVisible(false)}
                    >
                        &times;
                    </button>

                    <div className="chat-window">
                        <div className="messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={msg.sender}>
                                    {msg.text}
                                </div>
                            ))}
                            {isTyping && <div className="bot typing">Bot is typing...</div>}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="quick-replies">
                            
                            {renderButtons()}
                        </div>
                    </div>

                    {showDropdown && (
                        <div className="dropdown-container">
                            <form onSubmit={handleSubmit}>
                                <select
                                    value={selectedOption}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="" disabled>Select a state</option>
                                    {options.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                                <center><button type="submit" className="btn btn-primary mt-2">Explore</button></center>
                            </form>

                            <div className='chatbot-container'>
                                {tableData.length > 0 && (
                                    <table className="table table-striped table-bordered mt-3">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>Museum Name</th>
                                                <th>Ticket Price</th>
                                                <th>Book ticket</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.map((row) => (
                                                <tr key={row._id}>
                                                    <td>{row.nameofmuseum}</td>
                                                    <td>{row.ticketprice}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                window.open(
                                                                    `/form.html?price=${row.ticketprice}&museum=${encodeURIComponent(row.nameofmuseum)}`,
                                                                    '_blank'
                                                                )
                                                            }
                                                            
                                                            className="btn btn-success btn-sm"
                                                        >
                                                            Book Ticket
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Chatbot;
