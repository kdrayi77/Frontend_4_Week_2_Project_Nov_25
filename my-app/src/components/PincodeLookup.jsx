import React, { useState, useMemo } from 'react';

export default function PincodeLookup() {
  const [pincode, setPincode] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  const handleLookup = async () => {
    setError(null);
    setData(null);

    if (!/^\d{6}$/.test(pincode.trim())) {
      setError('Postal code must be exactly 6 digits.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const json = await res.json();
      const first = Array.isArray(json) ? json[0] : null;

      if (!first) setError('Invalid response from API');
      else if (first.Status === 'Error') setError(first.Message || 'API error');
      else setData(first);
    } catch {
      setError('Network error while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const filteredList = useMemo(() => {
    if (!data?.PostOffice) return [];
    if (!filter.trim()) return data.PostOffice;
    return data.PostOffice.filter((po) =>
      po.Name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  return (
    <div className="lookup-root">
      <div className="controls">
        <input
          className="pincode-input"
          placeholder="Enter 6-digit pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          maxLength={6}
        />
        <button className="lookup-btn" onClick={handleLookup} disabled={loading}>
          Lookup
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading && (
        <div className="loader-wrapper">
          <div className="loader"></div>
          <div className="loader-text">Fetching postal data...</div>
        </div>
      )}

      {data && (
        <div className="results">
          <div className="filter-row">
            <input
              className="filter-input"
              placeholder="Filter by post office"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {filteredList.length === 0 ? (
            <div className="not-found">
              Couldn’t find the postal data you’re looking for…
            </div>
          ) : (
            <div className="po-list">
              {filteredList.map((po, index) => (
                <div key={index} className="po-card">
                  <strong>{po.Name}</strong>
                  <p>Pincode: {po.Pincode}</p>
                  <p>District: {po.District}</p>
                  <p>State: {po.State}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
