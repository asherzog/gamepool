# GamePool Serverless background

Postgres DB deployed to Heroku. Serverless commands to deploy functions to AWS. 

* Install root dependencies: `npm install`
* Install common dependencies: `cd common && npm install`
* Migrate the DB: `npm run migrate`
* Seed the DB: `npm run seed`
* Run offline: `npm run dev`
* offline serverless on `http://localhost:3000`
* Deploy to AWS: `npm run deploy`