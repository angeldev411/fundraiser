import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import createBrowserHistory from 'history/lib/createBrowserHistory';
// above replaced 8/13/16 with browserHistory, 
// leaving temporarily for quick fix if it messes things up
import { Router, Route, browserHistory } from 'react-router';
import RouteNotFound from './views/RouteNotFound';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import { createStore, combineReducers, compose } from 'redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import mainReducer from './redux/reducers';
import ga from 'react-ga';
import axios from 'axios';

import { applyMiddleware } from 'redux';
import createLogger from 'redux-logger';

const reducer = combineReducers({
    main: mainReducer,
    routing: routerReducer,
});

export const store = createStore(reducer, undefined, compose(
  // applyMiddleware(createLogger),
  window.devToolsExtension ? window.devToolsExtension() : f => f
  // Get the redux chrome extension here: https://github.com/zalmoxisus/redux-devtools-extension
));

const history = syncHistoryWithStore(browserHistory, store);

const googleAnalyticsOptions = { debug: true };

// Init stuff
ga.initialize('UA-72900949-1', googleAnalyticsOptions);
axios.defaults.withCredentials = true;

import * as ActionsAuth from './redux/auth/actions';

ActionsAuth.checkIfLoggedIn()(store.dispatch);

history.listen((location) => {
    if (location.action === 'POP' || location.action === 'REPLACE') {
        ga.pageview(location.pathname);
    }
});

const container = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}
            onUpdate={function () {
                const hash = window.location.hash.substr(1);

                if (!hash) {
                    window.scrollTo(0, 0);
                }
            }}
        >
            {adminRoutes}
            {publicRoutes}
            <Route
                path="*"
                component={RouteNotFound}
                status={404}
            />
        </Router>
    </Provider>
    , container
);