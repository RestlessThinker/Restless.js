var Responder = new Interface('Responder', ['setResult', 'setFault']);
var TestService = new Interface('TestService', ['getItem']);
var TestFilterService = new Interface('TestFilterService', ['getItemById']);
var AsyncFilter = new Interface('AsyncFilter', ['doFilter']);