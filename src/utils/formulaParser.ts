import { CellReference, CellRange, FormulaFunction } from '../types/spreadsheet';

export const parseCellReference = (cell: string): CellReference | null => {
    const match = cell.match(/^([A-H])(\d+)$/);
    if (!match) return null;

    const [, col, row] = match;
    return {
        col: col.charCodeAt(0) - 65,
        row: parseInt(row) - 1
    };
};

export const parseCellRange = (range: string): CellRange | null => {
    const [start, end] = range.split(':').map(cell => cell.trim());
    const startRef = parseCellReference(start);
    const endRef = parseCellReference(end);

    if (!startRef || !endRef) return null;

    return {
        start: startRef,
        end: endRef
    };
};

export const getCellsInRange = (range: CellRange): CellReference[] => {
    const cells: CellReference[] = [];
    const minRow = Math.min(range.start.row, range.end.row);
    const maxRow = Math.max(range.start.row, range.end.row);
    const minCol = Math.min(range.start.col, range.end.col);
    const maxCol = Math.max(range.start.col, range.end.col);

    for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
            cells.push({ row, col });
        }
    }

    return cells;
};

export const evaluateFormula = (
    formula: string,
    getCellValue: (row: number, col: number) => string
): string => {
    try {
        let formulaStr = formula.slice(1);

        // Handle CONCAT function
        formulaStr = formulaStr.replace(/CONCAT\(([^)]+)\)/gi, (match, args) => {
            if (args.includes(':')) {
                const range = parseCellRange(args);
                if (!range) return '""';

                const values = getCellsInRange(range)
                    .map(({ row, col }) => getCellValue(row, col))
                    .filter(value => value !== '#ERROR' && value !== '')
                    .map(value => isNaN(Number(value))
                        ? `"${value.replace(/\\/g, '\\\\').replace(/\"/g, '\\"')}"`
                        : value
                    );
                return values.join(' + ');
            }

            const cells = args.split(',').map((cell: string) => cell.trim());
            const processedArgs = cells.map((cell: string) => {
                if (cell.startsWith('"') && cell.endsWith('"')) return cell;

                const ref = parseCellReference(cell);
                if (!ref) return cell;

                const value = getCellValue(ref.row, ref.col);
                if (value === '#ERROR') return '""';
                return isNaN(Number(value))
                    ? `"${value.replace(/\\/g, '\\\\').replace(/\"/g, '\\"')}"`
                    : value;
            });
            return processedArgs.join(' + ');
        });

        // Handle IF function
        formulaStr = formulaStr.replace(/IF\(([^,]+),([^,]+),([^)]+)\)/gi, (match, condition, trueValue, falseValue) => {
            const evaluateCondition = (cond: string) => {
                cond = cond.replace(/([A-H]\d+)/g, (cell: string) => {
                    const ref = parseCellReference(cell);
                    if (!ref) return '""';
                    const value = getCellValue(ref.row, ref.col);
                    return isNaN(Number(value)) ? `"${value}"` : value;
                });

                cond = cond.replace(/>=/g, '>=').replace(/<=/g, '<=').replace(/==/g, '===').replace(/!=/g, '!==');
                try {
                    return eval(cond);
                } catch {
                    throw new Error('Invalid IF condition');
                }
            };
            return evaluateCondition(condition) ? trueValue : falseValue;
        });

        // Handle ROUND function
        formulaStr = formulaStr.replace(/ROUND\(([^,]+),(\d+)\)/gi, (match, number, decimals) => {
            const num = Number(number.replace(/([A-H]\d+)/g, (cell: string) => {
                const ref = parseCellReference(cell);
                if (!ref) return '0';
                return getCellValue(ref.row, ref.col);
            }));
            return String(Number(num.toFixed(Number(decimals))));
        });

        // Handle range-based functions (SUM, AVERAGE, MIN, MAX, COUNT)
        formulaStr = formulaStr.replace(/(SUM|AVERAGE|MIN|MAX|COUNT)\(([A-H]\d+):([A-H]\d+)\)/gi, (match, func, start, end) => {
            const range = parseCellRange(`${start}:${end}`);
            if (!range) return '0';

            const values: number[] = [];
            let totalCells = 0;

            getCellsInRange(range).forEach(({ row, col }) => {
                const cellValue = getCellValue(row, col);
                const v = Number(cellValue);
                if (!isNaN(v)) {
                    values.push(v);
                }
                if (cellValue !== '') {
                    totalCells++;
                }
            });

            switch (func.toUpperCase() as FormulaFunction) {
                case 'SUM':
                    return String(values.reduce((a, b) => a + b, 0));
                case 'AVERAGE':
                    return values.length ? String(values.reduce((a, b) => a + b, 0) / values.length) : '0';
                case 'MIN':
                    return values.length ? String(Math.min(...values)) : '0';
                case 'MAX':
                    return values.length ? String(Math.max(...values)) : '0';
                case 'COUNT':
                    return String(totalCells);
                default:
                    return '0';
            }
        });

        // Replace remaining cell references with their values
        formulaStr = formulaStr.replace(/([A-H]\d+)/g, (cell: string) => {
            const ref = parseCellReference(cell);
            if (!ref) return '0';
            const value = getCellValue(ref.row, ref.col);
            return isNaN(Number(value)) ? `"${value}"` : value;
        });

        return String(eval(formulaStr));
    } catch (error) {
        console.warn('Formula evaluation error:', error);
        return '#ERROR';
    }
}; 