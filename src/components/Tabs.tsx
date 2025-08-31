import { useState, ReactNode } from "react";
import "./Tabs.css";

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultTab?: string;
};

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTab || tabs[0]?.id
  );
  const [mountedTabs, setMountedTabs] = useState<Set<string>>(new Set([activeTab]));

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setMountedTabs((prev) => new Set(prev).add(id));
  };

  return (
    <div className="tabs">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-body">
        {tabs.map((tab) => {
          if (!mountedTabs.has(tab.id)) return null;
          return (
            <div
              key={tab.id}
              className={`tab-panel ${activeTab === tab.id ? "active" : ""}`}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}