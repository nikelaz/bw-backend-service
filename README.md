<img src="https://i.imgur.com/lX2NzV2.png" alt="budget warden logo" width="320" height="81" style="margin-bottom: 10px;"/>

# Budget Warden Backend Service

## Summary

This is the backend api provider application for the Budget Warden project (a personal finance tracking application). This entire project is currently in progress and its development is documented in a YouTube series. If you are interested you can explore the videos in the table below:

### YouTube Series

1. [**Software and DB Architecture**](https://youtu.be/Z3OEsK2fUl8)
2. [**UI/UX Design**](https://youtu.be/D_TpsGgVdwY)
3. [**Model Definition and Validation with TypeORM and PostgreSQL**](https://youtu.be/BxH9NYMuTrU)

## Dependencies

This service is dependent on a PostgreSQL database. At this stage there is a `docker-compose.yml` file in the root directory. You can use it to run the database container for development. This file will be moved to a different repository later.

## Installation

To install all dependencies just run:

```
npm install
```

## Scripts

| Script | Description |
|-|-|
| `build` | Builds the project with the TypeScript compiler |
| `start` | Starts the built JavaScript files from the application entry point (dist/index.js) |
| `dev` | Starts the application with ts-node from (src/index.ts) and watches for changes using Nodemon. This script is supposed to be used for development |

## Contributing

At this stage pull requests/contributions will not be accepted, as the project is being developed as part of a YouTube series and there is a strict plan by which the initial development will be done. If you wish to suggest changes during this stage you can leave a comment in one of the YouTube videos.

After the YouTube series is finished the repository will be open for contributions and I will update the guidelines.