import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import RouteNotFound from './views/RouteNotFound';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import { createStore, combineReducers } from 'redux';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';
import mainReducer from './redux/reducers';
import ga from 'react-ga';
import axios from 'axios';

const reducer = combineReducers({
    main: mainReducer,
    routing: routeReducer,
});

/* In dev mode, use the logger */
import { applyMiddleware } from 'redux';
import createLogger from 'redux-logger';

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(logger)(createStore);

export const store = createStoreWithMiddleware(reducer);

/* In production, remove the logger */
// export const store = createStore(reducer);
const history = createBrowserHistory();

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

syncReduxAndRouter(history, store);

const container = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}
            onUpdate={function () {
                window.scrollTo(0, 0);
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
