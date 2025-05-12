import { useState } from 'react';
import React from 'react';

interface SpreadsheetCellProps {
    value: string;
    rawValue: string;
    isEditing: boolean;
    isReferenced: boolean;
    onEdit: (value: string) => void;
    onFocus: () => void;
    onBlur: () => void;
}

export const SpreadsheetCell: React.FC<SpreadsheetCellProps> = ({
    value,
    rawValue,
    isEditing,
    isReferenced,
    onEdit,
    onFocus,
    onBlur,
}) => {
    const [inputValue, setInputValue] = useState(rawValue);

    // Update input value when rawValue changes and we're not editing
    React.useEffect(() => {
        if (!isEditing) {
            setInputValue(rawValue);
        }
    }, [rawValue, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onEdit(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            onBlur();
        }
    };

    return (
        <td
            className={`border border-gray-700 hover:bg-gray-700 ${isReferenced ? 'outline-2 outline-purple-500 -outline-offset-2' : ''
                }`}
            onClick={onFocus}
        >
            {isEditing ? (
                <input
                    type="text"
                    value={inputValue}
                    autoFocus
                    onBlur={onBlur}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-full h-8 px-2 bg-gray-800 text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            ) : (
                <div
                    className={`w-full h-8 px-2 flex items-center cursor-text overflow-x-auto whitespace-nowrap ${!isNaN(Number(value)) ? 'justify-end' : ''
                        }`}
                >
                    {value}
                </div>
            )}
        </td>
    );
}; 