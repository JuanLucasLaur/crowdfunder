import React from 'react';
import {Button, Menu} from 'semantic-ui-react';

const Header: React.FunctionComponent = ({ children }) => {
    return (
        <Menu>
            <Menu.Item>CoinCrowd</Menu.Item>
            <Menu.Menu position="right">
                <Menu.Item>Campaigns</Menu.Item>
                <Menu.Item>+</Menu.Item>
            </Menu.Menu>
        </Menu>
    );
};

export default Header;
