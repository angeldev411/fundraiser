// TODO : this is an example

app.get('/appis', (req, res) => {
    const location = req.url;
    const reactRouter = Router.create({
        routes,
        location: location || Router.HistoryLocation,
    });

    reactRouter.run((Handler) => {
        const markup = ReactDOMServer.renderToString(<Handler />);

        res.send(markup);
    });
    // end example
});
