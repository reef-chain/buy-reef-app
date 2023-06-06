import React from 'react';

export default function NoExtension() {
    return (
        <div className="no-extension">
            <header className="header">
                <div className="header__content">
                    <div className="header__main-content">
                        <h1 className="header__title">Chain Extension</h1>
                    </div>
                    <div className="header__sub-content">
                        App uses browser extension to get accounts and securely sign transactions.
                        <br />
                        Please install the extension and refresh the page.
                    </div>
                </div>
            </header>
        </div>);
}