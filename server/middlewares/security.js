'use strict';
/* Security rules for paths */

app.all('*', loadUser);
app.all('/api/v1/session*', loadUser, loadRoles);
app.all('/api/v1/volunteer/*', requireLogin, loadUser, loadRoles); // gets you a dashboard
app.all('/api/v1/leader/*', requireLogin, loadUser, loadRoles); // lets you edit team stuff, approve hours.
app.all('/api/v1/corporate/*', requireLogin, loadUser, loadRoles);
