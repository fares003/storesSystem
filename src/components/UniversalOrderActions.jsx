// components/UniversalOrderActions.tsx
import { ArrowDown } from 'lucide-react';
import { useState } from 'react';

const UniversalOrderActions = ({
  item,
  onCancel,
  onInvoice,
  extraActions = [],          // optional array of extra menu items
}) => {
  const [open, setOpen] = useState(false);

  /** fallback when no extraActions supplied */
  const defaultMenu = [
    { key: 'invoice', label: 'Invoice', onClick: () => onInvoice(item.id) },
    { key: 'cancel',  label: 'Cancel',  onClick: () => onCancel(item.id) },
  ];

  const menuItems = extraActions.length ? extraActions : defaultMenu;

  return (
    <div className="relative flex">
      {/* primary button = first item in the array */}
      <button
        onClick={menuItems[0].onClick}
        className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-500 rounded-l-lg text-sm transition-all"
      >
        {menuItems[0].label}
      </button>

      {/* dropdown trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 bg-slate-500 hover:bg-slate-400 text-white rounded-r-lg transition-all"
      >
        <ArrowDown size={20} />
      </button>

      {/* dropdown list */}
      {open && (
        <div className="absolute top-full right-0 mt-1 min-w-[140px] bg-white border rounded-lg shadow-lg z-10">
          {menuItems.slice(1).map(m => (
            <button
              key={m.key}
              onClick={() => { m.onClick(); setOpen(false);} }
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left
                         first:border-t-0 border-t border-gray-200"
            >
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UniversalOrderActions;
