import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './pages/Main';
import LatestSearches from './pages/LatestSearches';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/latestSearches" exact component={LatestSearches} />
      </Switch>
    </BrowserRouter>
  );
}
