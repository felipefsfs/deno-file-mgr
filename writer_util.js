export {
  stringy,
  write_text,
};

//remove
function stringy(lines = [""]) {
  if (!Array.isArray(lines)) {
    return `${JSON.stringify(lines)}`;
  }
  return lines.reduce((full_srt, line) => {
    return `${full_srt}\n${JSON.stringify(line)}`;
  }, "");
}

async function write_text({
  encoder = new TextEncoder(),
  file = new Deno.File(0),
  text = "",
} = {}) {
  if (!file) {
    return 0;
  }
  try {
    const encoded = encoder.encode(text);
    await Deno.writeAll(file, encoded);
    return encoded.byteLength;
  } catch (e) {
    console.error(e);
    return 0;
  }
}
