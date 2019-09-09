# Vehicles registry
Angular 8, NodeJS/Express, MongoDB CRUD application with scraper for fake data.

**Modes**

 - Test  -- runs frontend and backend tests
 - Dev -- builds Angular app in dev mode; populates mongodb with fake data
 - Prod -- builds Angular app in prod mode (aot and calls enableProdMode); populates mongodb with fake data (since it is an example app)

**Environment variables / Config**

 - OWNERS_COUNT  -- amount of owners to generate
 - MONGO_URL
 - DATABASE_NAME
 - HOST
 - PORT

**Backend uses `convict` library for configuration. You can inspect Backend/config/index for configuration json schema and variables meanings*

**REQUIREMENTS**

 - NodeJS
 - MongoDB

**Scraping**

Fake data is scraped from cars-data.com and listofrandomnames.com and saved to Backend/setup/data.
Subsequent builds will not scrap data if it is already scraped and saved to Backend/setup/data.

**TODO**

 - [ ] Protractor tests / full test coverage
 - [ ] Modules mocking in api tests
 - [ ] DOCKER
