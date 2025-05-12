# Base Class API usage

Check PostMan ABRS/BaseClassExample for more details and examples

## General standards

- `localhost:3000/<>`
- `id` is not required and will be automatically generated. It can also be giving but has to adhere to the mongoDB \_id standard.
- JSON follow the standard

```json
{
  "<FIELD>":<VALUE>
}
```

## Creating - POST /

### Input - JSON

- JSON data for DB

### Return - JSON

- status: string (Successful or not)
- result: JSON (input data)

## Read One - GET /`id`

### Return - JSON

- Returns a JSON that contains the data from `id`.

## Update one - PUT /`id`

### Input - JSON

- Data to modify

### Output - JSON

- status: string (Successful or not)
- result: JSON (input data)

## Delete one - Delete /`id`

### Output - JSON

- status: Removed: `"<id>"`
- result: JSON removed

## Filtered - GET /`<Query Params>`

### Input - Query Params

`key: reason / value`

- filter: Array input according to the format
- `[ { "<FIELD>" : { "<CONDITION>" : <VALUE>} } ]`
- filterType: `<OR/AND>`
- sortBy: `<FIELD>` to sort by
- orderBy: `<desc/asc>` descending or ascending
- limit: max return on this page
- offset: offset results

### Output - JSON

- limit: Number of items per page
- offset: amount
- count: number of returned items
- totalCount: total number of items within this search
- data: results found
