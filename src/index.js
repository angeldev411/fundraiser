import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routes from './routes';
import { createStore, combineReducers } from 'redux';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';
import mainReducer from './redux/reducers';

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

syncReduxAndRouter(history, store);

const container = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            {routes}
        </Router>
    </Provider>
    , container
);
