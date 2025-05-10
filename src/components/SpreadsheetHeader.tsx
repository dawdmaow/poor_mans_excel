interface SpreadsheetHeaderProps {
    columnHeaders: string[];
    onClearAll: () => void;
}

export const SpreadsheetHeader: React.FC<SpreadsheetHeaderProps> = ({
    columnHeaders,
    onClearAll,
}) => {
    return (
        <thead className="sticky top-0 z-10">
            <tr>
                <th className="border border-gray-700 bg-gray-800 w-12 h-8">
                    <button
                        onClick={onClearAll}
                        className="w-full h-full hover:bg-gray-700 flex items-center justify-center cursor-pointer"
                        title="Clear all cells"
                    >
                        ×
                    </button>
                </th>
                {columnHeaders.map((header) => (
                    <th key={header} className="border border-gray-700 bg-gray-800 w-32 h-8">
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
    );
}; 