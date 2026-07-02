'use client';

import React from 'react';

export function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}

export function Card({
  children,
  className,
  padding = true,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn('rounded-2xl border border-[#e2ebf0] bg-white shadow-sm', padding && 'p-4', className)}
      style={style}
    >
      {children}
    </div>
  );
}

export function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl border border-[#e2ebf0] bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-[#5f7387]">{title}</div>
      <div className="mt-1 text-xl font-bold" style={{ color }}>{value}</div>
    </div>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger' | 'link';
  size?: 'sm' | 'md';
  loading?: boolean;
};

export function Btn({ variant = 'outline', size = 'md', loading, className, children, disabled, ...rest }: BtnProps) {
  const base = 'inline-flex items-center justify-center gap-1.5 font-semibold rounded-full transition-colors disabled:opacity-50';
  const sizes = size === 'sm' ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2';
  const variants = {
    primary: 'bg-[#22c7ee] text-white hover:bg-[#0ea5c6] shadow-md shadow-cyan-500/20',
    ghost: 'border border-cyan-200 text-[#0891b2] bg-cyan-50/50 hover:bg-cyan-50',
    outline: 'border border-[#dbe7ee] text-[#102131] bg-white hover:bg-slate-50',
    danger: 'border border-red-200 text-red-600 hover:bg-red-50',
    link: 'text-[#0891b2] hover:underline px-0 py-0 rounded-none font-medium',
  };
  return (
    <button className={cn(base, sizes, variants[variant], className)} disabled={disabled || loading} {...rest}>
      {loading ? '…' : children}
    </button>
  );
}

const pillColors: Record<string, string> = {
  green: 'bg-emerald-100 text-emerald-800',
  orange: 'bg-orange-100 text-orange-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  cyan: 'bg-cyan-100 text-cyan-800',
  magenta: 'bg-fuchsia-100 text-fuchsia-800',
  geekblue: 'bg-indigo-100 text-indigo-800',
  gold: 'bg-amber-100 text-amber-900',
  default: 'bg-slate-100 text-slate-700',
};

export function Pill({ children, color = 'default', className, style }: { children: React.ReactNode; color?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold', pillColors[color] ?? pillColors.default, className)} style={style}>
      {children}
    </span>
  );
}

export function Input({
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'rounded-xl border border-[#dbe7ee] bg-white px-3 py-2 text-sm text-[#102131] outline-none focus:border-[#22c7ee] focus:ring-2 focus:ring-cyan-100',
        className,
      )}
      {...rest}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'rounded-xl border border-[#dbe7ee] bg-white px-3 py-2 text-sm text-[#102131] outline-none focus:border-[#22c7ee]',
        className,
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  block,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
  block?: boolean;
}) {
  return (
    <div className={cn('inline-flex flex-wrap gap-1 rounded-full border border-[#d6e2ea] bg-[#e9f2f7] p-1', block && 'flex w-full')}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-semibold transition-all',
            block && 'flex-1',
            value === o.value
              ? 'bg-white text-[#0891b2] shadow-md shadow-cyan-500/15'
              : 'text-[#5f7387] hover:text-[#102131]',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Tabs({
  activeKey,
  onChange,
  items,
}: {
  activeKey: string;
  onChange: (key: string) => void;
  items: { key: string; label: string; children: React.ReactNode }[];
}) {
  const active = items.find((i) => i.key === activeKey) ?? items[0];
  return (
    <div>
      <div className="flex gap-1 border-b border-[#e2ebf0] mb-4">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={cn(
              'px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors',
              activeKey === item.key
                ? 'border-[#22c7ee] text-[#102131]'
                : 'border-transparent text-[#648092] hover:text-[#102131]',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div>{active?.children}</div>
    </div>
  );
}

export function Alert({ type = 'info', children }: { type?: 'info' | 'error'; children: React.ReactNode }) {
  const styles = type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-cyan-50 border-cyan-200 text-cyan-900';
  return <div className={cn('rounded-xl border px-4 py-3 text-sm', styles)}>{children}</div>;
}

export function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 rounded bg-slate-200" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  );
}

export function Modal({
  open,
  title,
  children,
  onClose,
  footer,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-[#102131] mb-4">{title}</h3>
        {children}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-400"
    />
  );
}

export function Tooltip({ title, children }: { title: string; children: React.ReactNode }) {
  return <span title={title}>{children}</span>;
}

export function TextArea({
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full resize-y rounded-xl border border-[#dbe7ee] bg-white px-3 py-2 text-sm text-[#102131] outline-none focus:border-[#22c7ee] focus:ring-2 focus:ring-cyan-100 min-h-[3.5rem]',
        className,
      )}
      {...rest}
    />
  );
}

export function Empty({ description }: { description: string }) {
  return (
    <div className="py-10 text-center">
      <p className="text-sm text-[#5f7387]">{description}</p>
    </div>
  );
}

export function Breadcrumb({ items }: { items: { title: React.ReactNode }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-sm text-[#5f7387]">
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {i > 0 && <span className="text-[#cbd5e1]">/</span>}
          <span className={i === items.length - 1 ? 'text-[#102131] font-medium' : ''}>{item.title}</span>
        </span>
      ))}
    </nav>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-[#e2ebf0] my-4', className)} />;
}
