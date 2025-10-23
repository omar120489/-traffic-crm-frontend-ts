#!/usr/bin/env node
import fs from 'node:fs';

const [,, routesPath, menusPath] = process.argv;
const routes = new Set<string>(fs.existsSync(routesPath) ? fs.readFileSync(routesPath,'utf8').trim().split('\n').filter(Boolean) : []);
const menus  = new Set<string>(fs.existsSync(menusPath)  ? fs.readFileSync(menusPath,'utf8').trim().split('\n').filter(Boolean)  : []);

function diff(a:Set<string>, b:Set<string>){ return [...a].filter(x => !b.has(x)); }

const routesNotInMenu = diff(routes, menus);
const menuToMissingRoutes = diff(menus, routes);

let out = `# Routes vs Menu\n\n`;
out += `**Routes total:** ${routes.size}  \n**Menu urls total:** ${menus.size}\n\n`;
out += `## Routes not present in menu (${routesNotInMenu.length})\n`;
out += routesNotInMenu.map(x => `- ${x}`).join('\n') + '\n\n';
out += `## Menu urls without route match (${menuToMissingRoutes.length})\n`;
out += menuToMissingRoutes.map(x => `- ${x}`).join('\n') + '\n';

process.stdout.write(out);

