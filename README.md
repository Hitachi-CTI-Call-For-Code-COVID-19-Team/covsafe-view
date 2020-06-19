# Front End

## How To Run

```sh
export PORT=8080
export SESSION_SECRET='0f0d15d0-1215-4fbc-a092-e4177145841f'
export $(grep -v '^#' ../authentication/.env.manager-console | xargs -0)

# run
npm start
```