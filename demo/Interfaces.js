var Responder = new Interface('Responder', ['setResult', 'setFault', 'setAlways']);
var TestService = new Interface('TestService', ['getItem']);
var TestFilterService = new Interface('TestFilterService', ['getItemById']);
var AsyncFilter = new Interface('AsyncFilter', ['doFilter']);
var Command = new Interface('Command', ['execute']);