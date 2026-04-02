import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-6xl font-bold text-gray-500 mb-4">404</h1>
            <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
            <Link to="/" className="text-primary hover:underline">Return to Home</Link>
        </div>
    );
}
