<?php

// Set session lifetime to 3 hours (10800 seconds)
ini_set('session.gc_maxlifetime', 3 * 60 * 60);

// Set cookie lifetime to 0 to achieve until browser is closed
ini_set('session.cookie_lifetime', 0);

?>