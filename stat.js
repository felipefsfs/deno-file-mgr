function chunk_size_rev(buffer = 0, offset = 0, size = 0) {
  if (buffer - offset > size) {
    return [((buffer > size) && size) || buffer, -size];
  }
  return [buffer, offset - buffer];
}

function chunk_size(buffer = 0, offset = 0, size = 0) {
  if (buffer + offset > size) {
    return [size - offset, offset];
  }
  return [buffer, offset];
}

function calc_buffer_start(buffer = 0, offset = 0, size = 0) {
  if ((size === 0) || (offset < 0)) {
    return 0;
  }
    if (offset > size) {
      return 0;
    }
    if (buffer + offset > size) {
      return size - offset;
    }
    return buffer
}

function calc_buffer_end(buffer = 0, offset = 0, size = 0) {
  if ((size === 0)||(offset > 0)) {
    return 0
  }
  if (offset + size +buffer < 0 ) {
    return 0;
  }
  if (offset + size < 0 ) {
    return buffer + (offset + size);
  }
  if (offset + buffer > 0) {
    return -offset;
  }
  return buffer;
}

async function stat_size(name) {
  const s = await stat(name);
  return s.size || 0;
}

async function stat(name = "") {
  try {
    return await Deno.stat(name);
  } catch (e) {
    console.error(e);
    return {};
  }
}
