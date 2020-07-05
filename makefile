run: fmt
	echo "Running mod.js..."
	deno run -A mod.js

test: fmt
	deno test --allow-read --allow-write

fmt:
	deno fmt -q
