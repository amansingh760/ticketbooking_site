import React, { useState, useEffect } from 'react';
import './SearchBar.css';
//import 'bootstrap/dist/css/bootstrap.min.css';

const DropdownWithSearchBar = ({ onSearch }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [options, setOptions] = useState([]);
    const [tabledata, settabledata] = useState([]);
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        fetch('https://ticketbooking-site.vercel.app/state-data')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setOptions(data);
            })
            .catch((error) => {
                console.error('Error fetching state data:', error);
                alert('Something went wrong while fetching state data!');
            });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        settabledata([]); // Clear previous table data
        setShowTable(false); // Hide table before new data loads

        try {
            const response = await fetch('https://ticketbooking-site.vercel.app/get-museum-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ state: selectedOption }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            settabledata(data);
            setShowTable(true); // Show table after data is loaded
            setSelectedOption('');
        } catch (error) {
            console.error('Error fetching museum data:', error);
            alert('Something went wrong while fetching museum data!');
        }
    };

    return (
        <div className="container mt-4">
            <form onSubmit={handleSubmit}>
                <select
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="search-input"
                >
                    <option value="" disabled>Select the state</option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <button type="submit" className="search-button">Explore</button>
            </form>

            {/* Table Display with Close Button */}
            {showTable && tabledata.length > 0 && (
                <div className="position-relative mt-4">
                    {/* Close Button */}
                    <button
                        className="btn btn-sm btn-outline-danger position-absolute top-0 end-0"
                        style={{ zIndex: 1 }}
                        onClick={() => setShowTable(false)}
                    >
                        &times;
                    </button>

                    <h2>Ticket booking </h2>
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>State</th>
                                <th>Name of Museum</th>
                                <th>Name of District</th>
                                <th>Location</th>
                                <th>Opening Time</th>
                                <th>Closing Time</th>
                                <th>Ticket Price</th>
                                <th>Closing Days</th>
                                <th>Book Ticket</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tabledata.map((row) => (
                                <tr key={row._id}>
                                    <td>{row.state}</td>
                                    <td>{row.nameofmuseum}</td>
                                    <td>{row.nameofdistrict}</td>
                                    <td>{row.location}</td>
                                    <td>{row.openingtime}</td>
                                    <td>{row.closingtime}</td>
                                    <td>{row.ticketprice}</td>
                                    <td>{row.closingdays}</td>
                                    <td>
                                         <button
                                            type="button"
                                            onClick={() => window.open(`/form.html?price=${row.ticketprice}&museum=${encodeURIComponent(row.nameofmuseum)}`, '_blank')}
                                            className="btn btn-success btn-sm"
                                        >
                                            Book Ticket
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Fallback Message */}
            {!showTable && tabledata.length === 0 && (
                <p className="mt-4"></p>/*write to display on screen*/
            )}
        </div>
    );
};

export default DropdownWithSearchBar;
