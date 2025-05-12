import { SpreadsheetCell } from './SpreadsheetCell';

interface SpreadsheetRowProps {
    rowIndex: number;
    cols: number;
    getCellValue: (row: number, col: number) => string;
    getRawValue: (row: number, col: number) => string;
    isEditing: (row: number, col: number) => boolean;
    isReferenced: (row: number, col: number) => boolean;
    onCellEdit: (row: number, col: number, value: string) => void;
    onCellFocus: (row: number, col: number) => void;
    onCellBlur: () => void;
}

export const SpreadsheetRow: React.FC<SpreadsheetRowProps> = ({
    rowIndex,
    cols,
    getCellValue,
    getRawValue,
    isEditing,
    isReferenced,
    onCellEdit,
    onCellFocus,
    onCellBlur,
}) => {
    return (
        <tr>
            <td className="border border-gray-700 bg-gray-800 text-center w-12 h-8 sticky left-0">
                {rowIndex + 1}
            </td>
            {Array.from({ length: cols }).map((_, colIndex) => (
                <SpreadsheetCell
                    key={`${rowIndex}-${colIndex}`}
                    value={getCellValue(rowIndex, colIndex)}
                    rawValue={getRawValue(rowIndex, colIndex)}
                    isEditing={isEditing(rowIndex, colIndex)}
                    isReferenced={isReferenced(rowIndex, colIndex)}
                    onEdit={(value: string) => onCellEdit(rowIndex, colIndex, value)}
                    onFocus={() => onCellFocus(rowIndex, colIndex)}
                    onBlur={onCellBlur}
                />
            ))}
        </tr>
    );
}; 