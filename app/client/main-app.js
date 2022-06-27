'use strict'

import { clientMain } from 'civil-client'
import App from '../components/app'

// this is the entry point for the client App running on the browser
// App will be run on both the server side, and the client side, but the stuff in clientMain will only be run to set things up on the browser
clientMain(App)
