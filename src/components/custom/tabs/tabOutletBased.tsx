import React, { ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

interface TabsProps {
  children: React.ReactNode;
  ulProps?: string;
  ulStyle?: React.CSSProperties;
  activeTabClass?: string;
  inactiveTabClass?: string;
  otherClass?: string;
  contentProps?: string;
  liprops?: string;
  spanProps?: string;
  onChange?: (tab: string) => void;
}

interface TabProps {
  label?: string;
  icon?: ReactNode;
  path?: string;
  state?:any;
  children?: ReactNode;
}

/**
 * Tabs: derives the active tab from router.pathname (single source of truth)
 * and keeps all tab panels mounted (show/hide) to avoid remount flicker.
 */
const Tabs: React.FC<TabsProps> = ({
  children,
  ulProps = "",
  ulStyle,
  activeTabClass = "",
  inactiveTabClass = "",
  otherClass = "",
  contentProps = "",
  liprops = "",
  spanProps = "",
  onChange,
}) => {
  const router = useLocation();
  const navigate = useNavigate();

  // turn children into typed array
  const tabs = React.Children.toArray(
    children,
  ) as React.ReactElement<TabProps>[];

  // derive active index from pathname (no internal state)
  const findActiveIndex = () => {
    // exact match first
    const exact = tabs.findIndex((t) => t.props.path === router.pathname);
    if (exact >= 0) return exact;

    // fallback: pathname may include extra segments (e.g. /edit/42/personal) — try startsWith
    const starts = tabs.findIndex((t) => {
      const p = t.props.path;
      if (!p) return false;
      // ensure p doesn't match root "/" and accidentally match everything
      return (
        router.pathname === p ||
        router.pathname.startsWith(p + "/") ||
        router.pathname.startsWith(p)
      );
    });
    return starts >= 0 ? starts : 0;
  };

  const activeIndex = findActiveIndex();

  const handleTabClick = (index: number, path?: string,state?:any) => {
    // don't set local state — let the router be the single source of truth
    if (path) {
      navigate(path,{state});
    }
    const label = tabs[index]?.props?.label;
    if (label && onChange) onChange(label);
  };

  return (
    <>
      <ul className={`${ulProps}`} style={ulStyle}>
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <li
              key={index}
              onClick={() => handleTabClick(index, tab.props.path,tab.props.state)}
              className={`${liprops} select-none `}
              style={{ cursor: tab.props.path ? "pointer" : "default" }}
            >
              <span
                className={`inline-flex flex-nowrap items-center ${isActive ? activeTabClass : inactiveTabClass} ${otherClass}`}
              >
                {tab.props.icon}
                <span  className={`${spanProps}`}>{tab.props.label}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <div className={contentProps}>
        <Outlet />
      </div>
    </>
  );
};

const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

export { Tabs, Tab };
