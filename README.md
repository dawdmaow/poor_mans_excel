A msimple spreadsheet built with Next.js, React 19 and TypeScript. Features real-time formula evaluation and cell referencing. Styled with TailwindCSS.

# Online

https://dawdmaow.github.io/poor_mans_excel/

# Features

- **Interactive Grid**: Spreadsheet with column headers (A-H) and row numbers
- **Formula Support**: Built-in functions including:
  - Math: `SUM`, `AVERAGE`, `MIN`, `MAX`, `COUNT`
  - Text: `CONCAT` (single cells and ranges)
  - Logic: `IF` conditions with comparison operators
  - Utility: `ROUND` for decimal precision
- **Cell References**: Support for single cells (`A1`) and ranges (`A1:C5`)
- **Visual Feedback**: Highlights referenced cells when editing formulas
- **Real-time Evaluation**: Formulas update automatically as dependencies change
- **Error Handling**: Graceful error display for invalid formulas

# Prerequisites
- Node.js 18+ 
- npm

# Installation

```bash
# Install dependencies
npm install
# Start the development server
npm run dev
```

# Formula Examples

- Basic math: `=A1+B1`, `=A1*2`
- Functions: `=SUM(A1:A5)`, `=AVERAGE(B1:B10)`
- Conditions: `=IF(A1>10,"High","Low")`
- Text: `=CONCAT(A1," ",B1)`, `=CONCAT(A1:C1)`
- Rounding: `=ROUND(A1,2)`