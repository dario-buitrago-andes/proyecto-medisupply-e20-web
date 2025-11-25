import React from "react";
import Sidebar from "./Sidebar";
import SkipToMain from "./SkipToMain";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <SkipToMain />
      <div className="app-layout">
        <Sidebar />
        <main 
          id="main-content"
          className="main-content"
          tabIndex={-1}
          role="main"
          aria-label="Contenido principal"
        >
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
