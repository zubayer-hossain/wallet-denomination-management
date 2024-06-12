import React from 'react';

const TextArea = ({ value, onChange, placeholder, className }) => {
    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
        />
    );
};

export default TextArea;
