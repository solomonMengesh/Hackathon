import React from "react";

export function Sidebar({ children, className = "" }) {
  return (
    <aside className={`flex flex-col ${className}`}>
      {children}
    </aside>
  );
}

export function SidebarContent({ children }) {
  return <div className="flex-1 overflow-y-auto">{children}</div>;
}

export function SidebarGroup({ children }) {
  return <div className="mb-6">{children}</div>;
}

export function SidebarGroupLabel({ children }) {
  return (
    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-6 mb-2 uppercase tracking-wide">
      {children}
    </h3>
  );
}

export function SidebarGroupContent({ children }) {
  return <div className="space-y-2 px-4">{children}</div>;
}

export function SidebarMenu({ children }) {
  return <ul className="space-y-2">{children}</ul>;
}

export function SidebarMenuItem({ children }) {
  return <li>{children}</li>;
}

export function SidebarMenuButton({ children, onClick = () => {}, className = "", asChild = false }) {
  const content = (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${className}`}
    >
      {children}
    </button>
  );

  return asChild ? children : content;
}
