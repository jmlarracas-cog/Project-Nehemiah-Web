import React, { useState } from 'react';
import { X, Upload, Bold, Italic, List, Quote, Link as LinkIcon, Check, Image as ImageIcon, FolderOpen } from 'lucide-react';
import { ContentStatus } from '../../types/about';
import { StatusBadge } from './StatusBadge';
import { MediaPicker } from './MediaPicker';

// Admin Button
export interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all rounded-xl focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-navy text-white hover:bg-slate-800 border border-transparent shadow-xs',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200',
    gold: 'bg-gold text-navy hover:bg-amber-400 font-black shadow-xs',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs',
    ghost: 'bg-transparent text-slate-600 hover:text-navy hover:bg-slate-100',
  };

  const sizes = {
    sm: 'text-[11px] px-3 py-1.5 gap-1.5',
    md: 'text-xs px-4 py-2 gap-2',
    lg: 'text-sm px-5 py-2.5 gap-2',
  };

  return (
    <button
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Admin Field
interface AdminFieldProps {
  label: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
}

export const AdminField: React.FC<AdminFieldProps> = ({
  label,
  required,
  helperText,
  error,
  children,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
        {label} {required && <span className="text-rose-600 ml-0.5">*</span>}
      </label>
      {children}
      {helperText && !error && <p className="text-[11px] text-slate-500">{helperText}</p>}
      {error && <p className="text-[11px] font-semibold text-rose-600">{error}</p>}
    </div>
  );
};

// Admin Select
interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export const AdminSelect: React.FC<AdminSelectProps> = ({ options, className = '', ...props }) => {
  return (
    <select
      className={`w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all ${className}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

// Admin Checkbox
interface AdminCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const AdminCheckbox: React.FC<AdminCheckboxProps> = ({
  label,
  description,
  className = '',
  ...props
}) => {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer select-none">
      <input
        type="checkbox"
        className={`mt-0.5 w-4 h-4 text-navy rounded border-slate-300 focus:ring-gold ${className}`}
        {...props}
      />
      <div>
        <span className="text-xs font-bold text-slate-800">{label}</span>
        {description && <p className="text-[11px] text-slate-500">{description}</p>}
      </div>
    </label>
  );
};

// Admin Status Select
interface AdminStatusSelectProps {
  value: ContentStatus;
  onChange: (value: ContentStatus) => void;
}

export const AdminStatusSelect: React.FC<AdminStatusSelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={value} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ContentStatus)}
        className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
      >
        <option value="draft">Draft</option>
        <option value="pending_verification">Pending Verification</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  );
};

// Admin Image Picker Placeholder
interface AdminImagePickerProps {
  value?: string;
  altText?: string;
  onChange: (url: string, altText?: string) => void;
  label?: string;
  objectFit?: 'cover' | 'contain';
}

export const AdminImagePicker: React.FC<AdminImagePickerProps> = ({
  value,
  altText,
  onChange,
  label = 'Featured Image / Graphic',
  objectFit = 'contain',
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <AdminField label={label} helperText="Enter an image URL or choose an asset from the Media Library.">
      <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
        {value ? (
          <div className="relative rounded-lg overflow-hidden border border-slate-200 h-40 bg-slate-900 p-3 flex items-center justify-center group">
            <img
              src={value}
              alt={altText || 'Preview'}
              className={`max-h-full max-w-full ${
                objectFit === 'cover' ? 'w-full h-full object-cover' : 'object-contain mx-auto'
              }`}
            />
            <button
              type="button"
              onClick={() => onChange('', '')}
              className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer z-10"
              title="Remove Image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setIsPickerOpen(true)}
            className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-white hover:border-amber-500 hover:bg-amber-50/30 transition-all cursor-pointer group"
          >
            <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-amber-500 mx-auto mb-2 transition-colors" />
            <p className="text-xs font-bold text-slate-700 group-hover:text-amber-600">Choose from Media Library or enter URL</p>
            <p className="text-[11px] text-slate-400 mt-1">Browse cataloged church graphics & sermon thumbnails</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value, altText)}
            placeholder="https://images.unsplash.com/... or /assets/..."
            className="flex-1 px-3 py-1.5 text-xs font-mono text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
            title="Browse Media Catalog"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>Browse Library</span>
          </button>
        </div>

        <input
          type="text"
          value={altText || ''}
          onChange={(e) => onChange(value || '', e.target.value)}
          placeholder="Accessibility Alt Text description..."
          className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        <MediaPicker
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelect={(url, newAlt) => {
            onChange(url, newAlt || altText);
          }}
          selectedUrl={value}
        />
      </div>
    </AdminField>
  );
};

// Admin Rich Text Placeholder
interface AdminRichTextProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const AdminRichTextPlaceholder: React.FC<AdminRichTextProps> = ({
  value,
  onChange,
  label = 'Content Body',
}) => {
  return (
    <AdminField label={label} helperText="Supports structured content text.">
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        {/* Editor Toolbar */}
        <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200 flex items-center gap-1">
          <button
            type="button"
            className="p-1 text-slate-600 hover:text-navy hover:bg-slate-200 rounded cursor-pointer"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1 text-slate-600 hover:text-navy hover:bg-slate-200 rounded cursor-pointer"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-slate-300 mx-1" />
          <button
            type="button"
            className="p-1 text-slate-600 hover:text-navy hover:bg-slate-200 rounded cursor-pointer"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1 text-slate-600 hover:text-navy hover:bg-slate-200 rounded cursor-pointer"
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1 text-slate-600 hover:text-navy hover:bg-slate-200 rounded cursor-pointer"
            title="Insert Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Area */}
        <textarea
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3.5 text-xs text-slate-800 font-sans focus:outline-none resize-y"
          placeholder="Type or paste content here..."
        />
      </div>
    </AdminField>
  );
};

// Admin Modal
interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'lg',
}) => {
  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className={`w-full ${widthClasses[maxWidth]} bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150`}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-navy text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-300 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">{children}</div>

        {/* Modal Footer */}
        {footer && (
          <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
