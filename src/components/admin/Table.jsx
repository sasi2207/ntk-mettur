import React from "react";

export const AdminPageHeader = ({ title, action }) => (
  <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
    <h1 className="text-3xl font-display font-bold">{title}</h1>
    {action}
  </div>
);

export const Table = ({ headers, children, testid }) => (
  <div className="overflow-x-auto rounded-xl border border-border bg-card" data-testid={testid}>
    <table className="w-full text-sm">
      <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
        <tr>{headers.map((h) => <th key={h} className="text-left font-semibold px-4 py-3">{h}</th>)}</tr>
      </thead>
      <tbody className="divide-y divide-border">{children}</tbody>
    </table>
  </div>
);

export const Empty = ({ cols, text = "No data yet." }) => (
  <tr><td colSpan={cols} className="px-4 py-8 text-center text-sm text-muted-foreground">{text}</td></tr>
);

export const TextField = ({ label, ...props }) => (
  <label className="grid gap-1.5">
    <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
    <input {...props} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
  </label>
);

export const TextArea = ({ label, ...props }) => (
  <label className="grid gap-1.5">
    <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
    <textarea {...props} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[88px]" />
  </label>
);

export const Select = ({ label, options, ...props }) => (
  <label className="grid gap-1.5">
    <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
    <select {...props} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </label>
);
