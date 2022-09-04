# World's Best

Create google map lists for the world's best restaurants.

## What it does:

1. scrap [world's best restaurant list](https://www.theworlds50best.com/list/1-50)
2. create a new list in Google maps
3. add markers for each entry

## Steps

1. create `.env` file with `GOOGLE_EMAIL` and `GOOGLE_PASSWORD` values

```
$ touch .env && echo GOOGLE_EMAIL= >> .env && echo GOOGLE_PASSWORD= >> .env
```

2. run generate script

```
$ yarn run generate
```

## Args

Here's a list of possible args

| arg      | description                                                                             | default                                |
| -------- | --------------------------------------------------------------------------------------- | -------------------------------------- |
| skipList | skip creation of Google Maps list                                                       | false                                  |
| year     | year inserted in list name above (note: does not affect what year it'll fetch data for) | [current year]                         |
| label    | name of the Google Maps Places list                                                     | `World's Best Restaurants [last year]` |
| 2fa      | whether or not to expect 2fa when signing into google                                   | true                                   |
| debug    | display excess debug logs                                                               | true                                   |
