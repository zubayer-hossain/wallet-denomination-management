import React from 'react';

const SelectInput = ({ id, value, onChange, children, className }) => {
    return (
        <select id={id} value={value} onChange={onChange} className={`form-select block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${className}`}>
            {children}
        </select>
    );
};

export default SelectInput;
