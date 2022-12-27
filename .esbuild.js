require('esbuild').build({
    entryPoints: ['frontend/app/index.js','frontend/res/index.css'],
    outdir: 'build/',
    bundle: true,
    minify: true,
    target: 'es2017',
}).catch(() => process.exit(1))
