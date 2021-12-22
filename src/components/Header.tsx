import React from 'react';
import Link from 'next/link';
import { Menu } from 'semantic-ui-react';

const Header: React.FunctionComponent = () => {
    return (
        <Menu>
            <Link href="/">
                <a className='item'>CoinCrowd</a>
            </Link>
            <Menu.Menu position="right">
                <Link href="/">
                    <a className='item'>Campaigns</a>
                </Link>
                <Link href="/campaigns/new">
                    <a className='item'>+</a>
                </Link>
            </Menu.Menu>
        </Menu>
    );
};

export default Header;
