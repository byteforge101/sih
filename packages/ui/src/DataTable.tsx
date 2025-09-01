import React from "react";
import RiskBadge from "./RiskBadge";

interface DataTableProps {
  headers: string[];
  data: Array<Record<string, string | number>>;
}

const DataTable: React.FC<DataTableProps> = ({ headers = [], data = [] }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-100">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition">
              {headers.map((header, i) => (
                <td key={i} className="p-4 text-slate-700">
                  {header === "Risk" ? (
                    <RiskBadge level={String(row[header])} />
                  ) : (
                    row[header]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
