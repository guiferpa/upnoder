# Upnoder

## Description
This project basically consists to be a monorepo with two codebases. These codebases are separated in API and Watcher (Lambda function). The API has as main goal to be a HTTP interface to works as file uplod provider which it uses AWS S3 for Object Storage and AWS DynamoDB for Database. The watcher is a AWS Lambda which it has as main goal extract the file metadata every file upload time.

## Topics
- [How the project turn on](#how-the-project-turn-on)
- [About project provisioning](#about-project-provisioning)
  - [API](#api)
    - [Resources](#resources)
- [Requirements given challenge specs](#requirements-given-challenge-specs)
  - [Use Node.js for the Lambda functions](#use-nodejs-for-the-lambda-functions)
  - [Deployable on AWS](#deployable-on-aws)
  - [AWS Integration](#aws-integration)
  - [Error Handling](#error-handling)
  - [Code Structure & Modularity](#code-structure--modularity)
- [Design Pattern](#design-pattern)
  - [Entrypoint](#entrypoint)
  - [Config](#config)
  - [Layers](#layers)
    - [Handler](#handler)
    - [Components](#components)
    - [Domain](#domain)
    - [Logic](#logic)
  - [Wire](#wire) 

## How the project turn on
- [API](./api)
- [Watcher](./functions)

## About project provisioning
All environment's deployed using a real AWS account, the products uses are DynamoDB, AWS Lambda, S3 and App Runner.

### API
> 🎈 The API is live, working together with watcher (Metadata extractor). Feel free to try it

- **URL**: https://nmicqm25xf.us-east-2.awsapprunner.com

#### Resources
Given the challenge specs the API has only two resources, follow below:

- **Upload a file**: `POST - /upload`
> For this resource needs that the body contains the fields `author` and file. The `author` field is who it's making the upload, `file` is the field responsable to load the file that'll be used in request.

- **Get metadata from file uploaded**: `GET - /metadata/:file_id`

## Requirements given challenge specs

### Use Node.js for the Lambda functions
It was used Node for the lambda and for API too. Not only use JavaScript was enough but all environment it was configured for support Typescript which bring more safe for runtime bugs.

### Deployable on AWS
All codebase is working using AWS. About this requirement item I was confused if I could configure all deployment scripts using Github Actions or if it'll necessary has shell scripts locally to deploy. Considering that'll delivery a good value I made the decision to create gihtub actions to run always when happens a push from local to remote. Feel free to take a detailed [look here](./.github/workflows).

### AWS Integration:
All AWS integration was made as expected.

### Error Handling:
The project are take caring of all possible errors and returning these as friendly as possible for the client side.

### Code Structure & Modularity
It was used a great design pattern that make easier app to growing up healthy and prepared to keep always improving quality like using automation tests.

## Design Pattern

### Code Structure

```
.
└── src
    ├── components
    │   ├── database
    │   │   └── dynamodb
    │   │       ├── database.ts
    │   │       └── index.ts
    │   └── storage
    │       └── s3
    │           ├── index.ts
    │           └── storage.ts
    ├── config
    │   └── env.ts
    ├── domain
    │   └── file
    │       ├── components
    │       │   ├── database.ts
    │       │   ├── index.ts
    │       │   └── storage.ts
    │       ├── index.ts
    │       ├── service.test.ts
    │       └── service.ts
    ├── handler
    │   └── trigger
    │       └── s3
    │           ├── index.ts
    │           └── trigger.ts
    ├── index.ts
    ├── logic
    │   └── file
    │       ├── file.test.ts
    │       ├── file.ts
    │       └── index.ts
    └── wire
        └── file
            └── in.ts
```
### Entrypoint
All source code it's be inside of `src` folder. It let us with more flexibility to handle any others files that's side scripts from the main source code, for example: linter config, shell scripts and etc... For this project it was used the `index.ts` at root of `src` folder as entrypoint then we can assume that `src`'s root is where it stays any entrypoint for our app.

### Config
All app config will be here into to `config` folder. It's a good approach given that all rule about config validation can be isolated from another app logic. In this project I used a dependency named `zod` to make the validation of all app's config then I can import the config already validated without have validation logic where it's not a good place to be.

### Layers
Our design are separated three main layers which named: handler, domain, components and logic. Basically our data flow through for these layers.

#### Handler
This layer is responsable for take care of request from client side, all request validation it'll be make here. Given that all communication it's made by interfaces from domain layer it make easier to create mock for unit tests or created entrypoint variants for example: what if we would like to release two version of the same source code one using CLI as interface and another using HTTP as interface. With this design is easy provide them, just create two handler then they'll be started for diferents entrypoints but consuming the same domain layer.

#### Components
This layer is responsible to implement the adapter to communicate with processing components given interface defined by domain layer. Making this way we let app easier to mock unit tests and provide A/B tests given we just have to create another implementation from domain layer specs. What are components? Components are everythinkg that help us to process app datas, for example: S3 connection, DynamoDB connection and etc...

#### Domain
Here's app's heart. The domain layer is resposible for define all interfaces for comunication during all app lifetime and wrap all businees rule. By the end we can mock the domain layer too given that this layer is a suite of interface where a struct named `Service` implements them for to be used in `handler` layer, this help us to easier tests creation.

#### Logic
I like to call this one like utility layer. This layer is responsible to wrap every pure logic that it'll be used in `Service` struct from domain layer. It help us to tests our business rules that it'll be in domain of app, domain layer.

### Wire
This layer works like a converter channel between all layers. It's interesting because avoid scenarios where happens sharing structures between layers that shouldn't know about existence which other. Another good point's that possibility unit tests for converter functions too.
