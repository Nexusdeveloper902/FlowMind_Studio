import React from 'react';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Navbar />
            <main className="container-fluid" style={{ padding: '2rem' }}>
                {children}
            </main>
        </>
    );
};

export default Layout;
