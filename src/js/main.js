'use strict';

import "./../css/jquery-ui.min.css";

import "./../css/main_style.css";

import "./../img/favicon.png";

import "./../img/logo.png";

import "./../img/layout-plaster.png";

import {
	createEditor,
	editor
} from "./editor.js";

import {
	Router
} from "./Router.js";

$(function() { //аналогично DOMContentLoaded

	editor();

	new Router();

});