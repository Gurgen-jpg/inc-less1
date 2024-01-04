"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const PORT = 80;
settings_1.app.listen(PORT, () => console.log(`Here you go. ${PORT}`));
