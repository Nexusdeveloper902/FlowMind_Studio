// Layout.tsx
import React from 'react';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Navbar />
            {/* main sin container-fluid ni padding */}
            <main style={{ margin: 0, padding: 0 }}>
                {children}
            </main>
        </>
    );
};

export default Layout;
