import React from 'react';

// eslint-disable-next-line react/prop-types
function LoadingOverlay({ isLoading }) {
    if (!isLoading) return null;

    return (
        <div className="loading-overlay" aria-busy="true" aria-live="polite">
            <div className="spinner"></div>
        </div>
    );
}

export default LoadingOverlay;