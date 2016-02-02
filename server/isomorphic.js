app.get("/appis", function(req, res){
    // example

    var location = req.url;
    var reactRouter = Router.create({
        routes: routes,
        //location: location || Router.HashLocation
        location: location || Router.HistoryLocation
    });

    reactRouter.run(function (Handler) {
      var markup = React.renderToString(<Handler />);
      res.send(markup)
    });
    // end example
  });
