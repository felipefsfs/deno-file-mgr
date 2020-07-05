File Mgr
----
Helper for reading files from the end, specially logs.
A few other utility functions inside, like helpers for file.Seek(), and a writer.

### Features

- [Deno](https://deno.land) module.

- Zero dependencies.

- Javascript only

- Read you favorite files from the End, or the Middle!

## Usage
```
const file_name = "./myfile";
const file = await Deno.open(file_name);
const reader = await create_reader({
  file,
  file_name,
  decoder: new TextDecoder("utf8"),
});
const result = await reader.read_parsed_data(
{ buffer: 100, mode: READ_END },
);
```
## License

MIT &middot;