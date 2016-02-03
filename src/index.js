import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routes from './routes';
import { createStore, combineReducers } from 'redux';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';
import mainReducer from './redux/reducers';
import ga from 'react-ga';

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

var options = { debug: true };
ga.initialize('UA-72900949-1', options);

history.listen(location => {
    if (location.action === "POP" || location.action === "REPLACE") {
        console.log('Google Analytics', location.pathname);
        ga.pageview(location.pathname);
    }
});

syncReduxAndRouter(history, store);

const container = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <Router history={history} onUpdate={function() {
            window.scrollTo(0, 0);
        }}>
            {routes}
        </Router>
    </Provider>
    , container
);
