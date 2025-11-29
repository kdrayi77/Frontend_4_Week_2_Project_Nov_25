// src/components/PincodeLookup.jsx

import React, { useState } from "react";

const PincodeLookup = () => {
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    if (pincode.length !== 6) {
      setError("Pincode must be 6 digits");
      setData([]);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const result = await response.json();

      if (result[0].Status !== "Success") {
        setError("Invalid Pincode or no data found.");
        setData([]);
      } else {
        setData(result[0].PostOffice);
      }
    } catch (err) {
      setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) =>
    item.Name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1>Pincode Lookup</h1>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Enter 6-digit pincode"
          value={pincode}
          maxLength={6}
          onChange={(e) => setPincode(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleFetch} style={styles.button}>
          Lookup
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <div className="loader"></div>}

      {!loading && data.length > 0 && (
        <>
          <input
            type="text"
            placeholder="Filter by Post Office Name"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.input}
          />

          {filteredData.length === 0 ? (
            <p>Couldn’t find the postal data you’re looking for…</p>
          ) : (
            <div style={styles.cardContainer}>
              {filteredData.map((office, index) => (
                <div key={index} style={styles.card}>
                  <p><strong>Post Office Name:</strong> {office.Name}</p>
                  <p><strong>Pincode:</strong> {office.Pincode}</p>
                  <p><strong>District:</strong> {office.District}</p>
                  <p><strong>State:</strong> {office.State}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <style>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin: 10px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "8px",
    fontSize: "16px",
    width: "250px",
  },
  button: {
    padding: "8px 15px",
    fontSize: "16px",
    cursor: "pointer",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
  },
  card: {
    border: "1px solid #ddd",
    padding: "10px",
    width: "250px",
    borderRadius: "8px",
    background: "#f9f9f9",
    textAlign: "left",
  },
  error: {
    color: "red",
  },
};

export default PincodeLookup;
