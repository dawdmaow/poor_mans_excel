/* eslint-disable */
'use client';

import { useState } from 'react';
import { SpreadsheetHeader } from '@/components/SpreadsheetHeader';
import { SpreadsheetRow } from '@/components/SpreadsheetRow';
import { evaluateFormula } from '@/utils/formulaParser';
import { SpreadsheetData } from '@/types/spreadsheet';

export default function Home() {
  const [data, setData] = useState<SpreadsheetData>({
    '0-0': 'Numbers',
    '1-0': '10',
    '2-0': '20',
    '3-0': '30',
    '4-0': '40',
    '5-0': '50',
    '0-1': 'Text',
    '1-1': 'Hello',
    '2-1': 'World',
    '3-1': '!',
    '0-2': 'Ranges',
    '1-2': '=SUM(A2:A6)',
    '2-2': '=AVERAGE(A2:A6)',
    '3-2': '=MIN(A2:A6)',
    '4-2': '=MAX(A2:A6)',
    '5-2': '=SUM(A2:A6)+SUM(A2:A6)+SUM(A2:A6)',
    '0-3': 'CONCAT',
    '1-3': '=CONCAT(B1," ",B2,B3,B4)',
    '2-3': '=CONCAT(B1:B4)',
    '0-4': 'IF',
    '1-4': '=IF(E4>=E5,"Higher or equal","Lower")',
    '2-4': '=IF(E4==E5,"Equal","Not Equal")',
    '3-4': '13',
    '4-4': '13',
    '0-5': 'ROUND',
    '1-5': '=ROUND(F4,2)',
    '2-5': '=ROUND(F4,1)',
    '3-5': '3.1415926',
    '0-6': 'Errors',
    '1-6': '=ROUND(A1)',
    '2-6': '=SUM()',
    '7-0': 'Rectangular',
    '8-0': '1',
    '9-0': '2',
    '10-0': '3',
    '7-1': '4',
    '8-1': '5',
    '9-1': '6',
    '10-1': '7',
    '7-2': '8',
    '8-2': '9',
    '9-2': '10',
    '10-2': '11',
    '7-3': '=SUM(A8:C11)',
    '8-3': '=AVERAGE(A8:C11)',
    '9-3': '=MIN(A8:C11)',
    '10-3': '=MAX(A8:C11)',
    '7-4': '=COUNT(A11:C18)',
    '7-5': 'Basic Math',
    '8-5': '10',
    '9-5': '5',
    '10-5': '=F9*2',
    '11-5': '=F9+F10',
    '12-5': '=F9-F10',
    '13-5': '=F9/F10',
    '14-5': '=F9*F10+F11',
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [focusedCell, setFocusedCell] = useState<string | null>(null);
  const rows = 20;
  const cols = 8;
  const columnHeaders = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  const getCellValue = (row: number, col: number): string => {
    const cellId = `${row}-${col}`;
    const value = data[cellId] || '';
    if (value === '=') {
      return '#ERROR';
    }
    if (value.startsWith('=')) {
      return evaluateFormula(value, getCellValue);
    }
    return value;
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    const cellId = `${row}-${col}`;
    setData(prev => ({ ...prev, [cellId]: value }));
  };

  const clearAllCells = () => {
    setData({});
  };

  const isEditing = (row: number, col: number): boolean => {
    return editing === `${row}-${col}`;
  };

  const isReferenced = (row: number, col: number): boolean => {
    if (!focusedCell) return false;
    const value = data[focusedCell] || '';
    if (!value.startsWith('=')) return false;

    const cellId = `${row}-${col}`;
    const references = new Set<string>();
    const rangeMatches = value.matchAll(/([A-H]\d+):([A-H]\d+)/g);
    for (const match of rangeMatches) {
      const [_, start, end] = match;
      const startCol = start.charCodeAt(0) - 65;
      const startRow = parseInt(start.slice(1)) - 1;
      const endCol = end.charCodeAt(0) - 65;
      const endRow = parseInt(end.slice(1)) - 1;

      for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
        for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
          references.add(`${r}-${c}`);
        }
      }
    }

    const cellMatches = value.matchAll(/([A-H]\d+)/g);
    for (const match of cellMatches) {
      const cell = match[1];
      const col = cell.charCodeAt(0) - 65;
      const row = parseInt(cell.slice(1)) - 1;
      references.add(`${row}-${col}`);
    }

    return references.has(cellId);
  };

  const getRawValue = (row: number, col: number): string => {
    const cellId = `${row}-${col}`;
    return data[cellId] || '';
  };

  return (
    <main className="h-screen bg-gray-900 text-white p-4">
      <div className="h-[calc(100vh-2rem)]">
        <div className="h-full overflow-auto">
          <table className="border-collapse border border-gray-700 w-full">
            <SpreadsheetHeader
              columnHeaders={columnHeaders}
              onClearAll={clearAllCells}
            />
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <SpreadsheetRow
                  key={rowIndex}
                  rowIndex={rowIndex}
                  cols={cols}
                  getCellValue={getCellValue}
                  getRawValue={getRawValue}
                  isEditing={isEditing}
                  isReferenced={isReferenced}
                  onCellEdit={handleCellChange}
                  onCellFocus={(row, col) => {
                    setFocusedCell(`${row}-${col}`);
                    setEditing(`${row}-${col}`);
                  }}
                  onCellBlur={() => {
                    setEditing(null);
                    setFocusedCell(null);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
