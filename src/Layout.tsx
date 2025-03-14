// Layout.tsx
import React from 'react';
import Navbar from './Navbar';
import './index.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Navbar />
            {/* main sin container-fluid ni padding extra */}
            <main
                style={{
                    margin: 0,
                    padding: 0,
                    minHeight: '100vh',
                    backgroundColor: '#2e2e2e',
                }}
            >
                {children}
            </main>
        </>
    );
};

export default Layout;
