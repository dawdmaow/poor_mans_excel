export type CellValue = string;

export type SpreadsheetData = {
    [key: string]: CellValue;
};

export type CellPosition = {
    row: number;
    col: number;
};

export type FormulaFunction = 'SUM' | 'AVERAGE' | 'MIN' | 'MAX' | 'COUNT' | 'CONCAT' | 'IF' | 'ROUND';

export type CellReference = {
    col: number;
    row: number;
};

export type CellRange = {
    start: CellReference;
    end: CellReference;
}; 