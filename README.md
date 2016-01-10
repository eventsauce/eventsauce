![eventsauce logo](./manual/img/logo.png)

Travis-CI Status: ![Travis-CI Build: eventsauce](https://travis-ci.org/eventsauce/eventsauce.svg?branch=master)

# About eventsauce
**eventsauce** is an event-sourcing/CQRS Framework in Javascript, 
using ES6 language features. The goal of the project is to make domain-driven
design concepts easy to apply in a repeatable, consistent way
for NodeJS applications.

## Contributions
If you wish to contribute to **eventsauce** then please create an
issue to discuss the change or a pull request. Generally it's better
to raise an issue first, as unannounced pull requests may not
align to various long term goals. Particularly welcome are new
modules for:

  * Event Store support - Adding support for new back-end event streams.
  * Message Bus support - Modules for event buses, such as Kafka.

We're also working on improving documentation and examples, so watch this space.

## Code Quality & Standards
The **eventsauce** project is hosted on GitHub, with CI builds by Travis-CI. 
All code submissions for core libraries are required to follow the airbnb ESLint
ruleset and have 100% coverage with mocha/chai tests. Pull requests that do not
pass the CI build or have untested code paths will be rejected.

## Licensing
Code is presently licensed as GPLv2, and may be used freely.  



