import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import {syncReduxAndRouter, routeReducer} from 'redux-simple-router';
import {Router, IndexRoute, Route} from 'react-router';
import mainReducer from './redux/reducers';
import needToImport from './lang/languageManager';

const reducer = combineReducers({
    main: mainReducer,
    routing: routeReducer
});

/* In dev mode, use the logger */
import {applyMiddleware} from 'redux';
import createLogger from 'redux-logger';
const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(logger)(createStore);
export const store = createStoreWithMiddleware(reducer);
/* In production, remove the logger */
// export const store = createStore(reducer);

const history = createBrowserHistory();
syncReduxAndRouter(history, store);

import Container from './components/Container/Container';
import Home from './views/Home/Home';
/* Add new views here */

const container = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
        <Route path="/" component={Container}>
            <IndexRoute component={Home} />
            /* Add new routes here */
        </Route>
        </Router>
    </Provider>
    , container
);
