! function () {

  'use strict';

  function signOut (req, res, next) {
    res.clearCookie('synuser');
    res.statusCode = 301;
    res.redirect('/');
  }

  module.exports = signOut;

} ();
