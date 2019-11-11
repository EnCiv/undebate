'use strict';

function printRequest (req, res) {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const d = new Date();

  let
    hours   =   d.getHours(),
    minutes =   d.getMinutes(),
    seconds =   d.getSeconds();

  const time = [hours, minutes, seconds]
    .map(t => {
      if ( t < 10 ) {
        t = `0${t}`;
      }
      return t;
    })
    .map(t => t.toString());

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  let userName = 'visitor',
    userColor = 'magenta';

  if ( req.cookies && req.cookies.synuser ) {
    let isIn = req.cookies.synuser;

    if ( typeof isIn === 'string' ) {
      isIn = JSON.parse(isIn);
    }

    userName = isIn.email;
    userColor = 'blue';
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  let status = '...',
    color = 'grey';

  if ( res ) {

    status = res.statusCode.toString();

    if ( status.substr(0, 1) === '2' ) {
      color = 'green';
    }

    else if ( status.substr(0, 1) === '3' ) {
      color = 'cyan';
    }

    else if ( status.substr(0, 1) === '4' ) {
      color = 'yellow';
    }

    else if ( status.substr(0, 1) === '5' ) {
      color = 'red';
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const { method, url } = req;

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const pretty = [
    time.join(':').cyan,
    userName[userColor],
    status[color],
    method[color],
    url[color]
  ];

  console.log(...pretty);

  return {
    time,
    user : { name : userName, color : userColor },
    status,
    method,
    url,
    color,
    pretty
  };
}

export default printRequest;
