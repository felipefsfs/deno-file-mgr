import { stat_size, calc_buffer_end, calc_buffer_start } from "./stat.js";

export {
  create_reader,
  READ_START,
  READ_END,
  READ_MIDDLE,
};

const READ_START = 1;
const READ_END = -1;
const READ_MIDDLE = 0;
const KB = 1024;
const nothing_func = (lines = [""], buffer = 0, offset = 0, size = 0) => ({
  lines,
  buffer,
  offset,
  size,
});

/**
 * Creates a reader object that can read lines from the file with ease
 * @param {object} specs - reader options
 */
function create_reader({
  decoder = new TextDecoder(""),
  line_function = nothing_func,
  file = new Deno.File(0),
  file_name = "",
  max_buffer = 1_000_000,
}) {
  return { read_lines, read_parsed_data, close };

  /**
   * Close the Opened file saved internally
   */
  function close() {
    file.close();
  }

  /**
   * Read the text from the file and parse using the line_function
   * @param {object} specs - read options 
   */
  async function read_parsed_data({
    buffer = KB,
    offset = 0,
    file_size = 0,
    prev_chunk = "",
    mode = READ_MIDDLE,
  } = {}) {
    if (buffer < 1) {
      return line_function([""], 0, offset, file_size);
    }
    const size = file_size || await stat_size(file_name) || 0;
    if (mode === READ_MIDDLE) {
      return rec_from_mdl(
        { size, prev_chunk, buffer, offset },
      );
    }
    if (mode === READ_END) {
      return rec_from_end(
        { buffer, size, prev_chunk, offset: offset || (-buffer) },
      );
    }
    if (mode === READ_START) {
      return rec_from_start({ buffer, size, prev_chunk });
    }
  }

  async function rec_from_start({
    buffer = KB,
    offset = 0,
    size = 0,
    prev_chunk = "",
  } = {}) {
    const new_buffer = calc_buffer_start(buffer, offset, size);
    const buffersize = new_buffer.buffer;
    const adj_offset = new_buffer.offset;
    const data = await read_lines(
      { buffersize, offset: adj_offset, mode: Deno.SeekMode.Start },
    );
    if (data.length === 0) {
      return line_function([prev_chunk], buffersize, adj_offset, size);
    }
    data[0] = `${prev_chunk}${data[0]}`;
    if ((data.length > 1) || (buffer > max_buffer)) {
      return line_function(data, buffersize, adj_offset, size);
    }
    return rec_from_start({
      size,
      buffer: buffer * 2,
      offset: adj_offset,
      prev_chunk: data[0],
    });
  }

  async function rec_from_end({
    buffer = KB,
    offset = -0,
    size = 0,
    prev_chunk = "",
  } = {}) {
    const new_buffer = calc_buffer_end(buffer, offset, size);
    const buffersize = new_buffer.buffer;
    const adj_offset = new_buffer.offset;
    const data = await read_lines({ buffersize, offset: adj_offset });
    if (data.length === 0) {
      return line_function([prev_chunk], buffersize, adj_offset, size);
    }
    data[data.length - 1] = `${data[data.length - 1]}${prev_chunk}`;
    if ((data.length > 1) || (buffer > max_buffer)) {
      return line_function(data, buffersize, adj_offset, size);
    }
    return rec_from_end({
      size,
      buffer: buffer * 2,
      offset: adj_offset - (buffer * 2),
      prev_chunk: data[0],
    });
  }

  async function rec_from_mdl({
    buffer = KB,
    offset = 0,
    size = 0,
    prev_chunk = "",
  } = {}) {
    const new_buffer = calc_buffer_start(buffer, offset, size);
    const buffersize = new_buffer.buffer;
    const adj_offset = new_buffer.offset;
    const data = await read_lines(
      { buffersize, offset: adj_offset, mode: Deno.SeekMode.Start },
    );
    if (data.length === 0) {
      return line_function([prev_chunk], buffersize, adj_offset, size);
    }
    data[data.length - 1] = `${data[data.length - 1]}${prev_chunk}`;
    if ((data.length > 1) || (buffer > max_buffer)) {
      return line_function(data, buffersize, adj_offset, size);
    }
    return rec_from_mdl({
      size,
      buffer: buffer * 2,
      offset: adj_offset - (buffer * 2),
      prev_chunk: data[0],
    });
  }

  /**
   * Read the text from file at the position defined and return an array of lines (string)
   * @param {object} specs - buffer; Seek offset; SeekMode 
   */
  async function read_lines({
    buffersize = 0,
    offset = -0,
    mode = Deno.SeekMode.End,
  } = {}) {
    const buffer = new Uint8Array(buffersize);
    try {
      await file.seek(offset, mode);
      await file.read(buffer);
      const chunk = await decoder.decode(buffer);
      return chunk.split(/\n|\r\n/) || [];
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
