import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../SearchResults.css'; // Import the CSS file for styling
import { buildApiUrl, API_ENDPOINTS } from '../config/api';

function SearchResults() {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        try {
          const response = await fetch(`${buildApiUrl(API_ENDPOINTS.SEARCH)}?query=${query}`);
          const data = await response.json();
          console.log('API response:', data);
          if (Array.isArray(data)) {
            setSearchResults(data);
          } else {
            console.error('Unexpected response format:', data);
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      }
    };

    fetchResults();
  }, [query]);

  const handleViewDetails = (productId) => {
    navigate(`/view-details/${productId}`);
  };

  return (
    <div className="search-results-container">
      <h2>Search Results for: "{query}"</h2>

      <div className="search-results-grid">
        {searchResults.length > 0 ? (
          searchResults.map((product) => (
            <div key={product._id} className="search-result-item">
              <img
                src={product._source.image_url}
                alt={product._source.name}
                className="search-result-img"
              />
              <div className="search-result-details">
                <h4>{product._source.name}</h4>
                <p><strong>Price:</strong> ${product._source.price}</p>
                <button onClick={() => handleViewDetails(product._id)} className="view-details-btn">
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
