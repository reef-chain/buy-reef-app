import React from 'react';
import Bubbles from './Bubbles';
import './css/index.css';
import { localizedStrings as strings } from '../../l10n/l10n';

const NoAccount = (): JSX.Element => (
  <div className="no-extension">
    <header className="header">
      <div className="header__content">
        <div className="header__main-content">
          <h1 className="header__title">{strings.create_your_account}</h1>
        </div>
        <div className="header__sub-content">{strings.use_reef_chain_extension}</div>
      </div>

      <Bubbles />
    </header>

    <main>
      <div className="images">
        <div className="images__image">
          <img src="img/6.png" alt="Reef Extenstion screenshot" />
        </div>
        <div className="images__image">
          <img src="img/7.png" alt="Reef Extenstion screenshot" />
        </div>
        <div className="images__image">
          <img src="img/8.png" alt="Reef Extenstion screenshot" />
        </div>
        <div className="images__image">
          <img src="img/9.png" alt="Reef Extenstion screenshot" />
        </div>
      </div>
    </main>
  </div>
);

export default NoAccount;
