import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import Header from './Header';
import { Container } from 'semantic-ui-react';

const Layout: React.FunctionComponent = ({ children }) => {
    return (
        <>
            <Header />
            <Container style={{ minWidth: '85vw' }}>{children}</Container>
        </>
    );
};

export default Layout;
