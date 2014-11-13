Restless.js
===========

A services framework for Javascript

### Features ###

* pre-service filters
* post-service filters
* return stub data from your service
* batch requests

### About ###

Restless.js is a services framework that implements the [chain-of-responsibility pattern](http://en.wikipedia.org/wiki/Chain-of-responsibility_pattern) that allows you to add pre and post service filters. It also focuses on creating resuable objects via the [command pattern](http://en.wikipedia.org/wiki/Command_pattern) for invoking services instead of the common Javascript-like global object.

Restless.js has similar theories as [amplifyjs](http://amplifyjs.com/api/request/) in being an abstraction layer for invoking requests. They both identify the need for data caching and decoding of data from the server. Restless.js differs in the implementation by implementing the [chain-of-responsibility pattern](http://en.wikipedia.org/wiki/Chain-of-responsibility_pattern) that allow multiple custom filters to be created and applied pre-service or post-service. It also differs by invoking separate objects instead of registering services at a global level.

Restless.js also has the ability to return stub data from your service, keeping the server interface the same for when your services are ready.

### Example invoking a service ###

```
new GetItemCommand('myIdString').then(function (data) {
                                    console.log(data);
                                }, function (data) {
                                    console.log('failed');
                                    console.log(data);
                                }).always(function (data) {
                                    console.log('always');
                                }).execute();
```

### Example invoking a queue of services ###

```
var queues = [new GetQueueRequestCommand(1),
              new GetQueueRequestCommand(2),
              new GetQueueRequestCommand(3)];
var queue = new RestlessCommandQueue();
    queue.addCommands(queues);
    queue.executeSeries(function (errors, arrayOfResults) {
        console.table(arrayOfResults);
    });
```

### Interfaces you say? ###

Restless.js implements the [Interface implementation](https://github.com/RestlessThinker/Javascript-Interface) as seen in the book [Pro JavaScript Design Patterns: The Essentials of Object-Oriented JavaScript Programming](http://www.amazon.com/gp/product/159059908X/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=159059908X&linkCode=as2&tag=theresminofad-20&linkId=ON3SQFSLM2F42S34). 

### Tests ###
I haven't decided on a test framework yet (I'm leaning towards Mocha). I'll be adding the tests and more demos later.
