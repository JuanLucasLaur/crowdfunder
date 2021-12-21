import React from 'react';
import Header from './Header';
import { Container } from 'semantic-ui-react';

const Layout: React.FunctionComponent = ({ children }) => {
    return (
        <>
            <Header />
            <Container>{children}</Container>
        </>
    );
};

export default Layout;
