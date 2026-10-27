import svelte from "rollup-plugin-svelte"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import terser from "@rollup/plugin-terser"
import postcss from "rollup-plugin-postcss"
import tar from "tar"
import fs from "fs"
import crypto from "crypto"

const pkg = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8"))

const ignoredWarnings = [
  "unused-export-let",
  "css-unused-selector",
  "module-script-reactive-declaration",
  "a11y-no-onchange",
  "a11y-label-has-associated-control",
  "a11y-click-events-have-key-events",
  "a11y-no-noninteractive-tabindex",
  "a11y-no-static-element-interactions",
  "a11y-missing-attribute",
]

const clean = () => ({
  buildStart() {
    const dist = "./dist/"
    if (fs.existsSync(dist)) {
      fs.readdirSync(dist).forEach(path => {
        if (path.endsWith(".tar.gz")) {
          fs.unlinkSync(dist + path)
        }
      })
    }
  },
})

const copyMeta = () => ({
  writeBundle() {
    if (!fs.existsSync("./dist")) {
      fs.mkdirSync("./dist")
    }
    fs.copyFileSync("./schema.json", "./dist/schema.json")
    fs.copyFileSync("./package.json", "./dist/package.json")
  },
})

const hash = () => ({
  writeBundle() {
    const fileBuffer = fs.readFileSync("dist/plugin.min.js")
    const hashSum = crypto.createHash("sha1")
    hashSum.update(fileBuffer)
    const hex = hashSum.digest("hex")

    const schema = JSON.parse(fs.readFileSync("./dist/schema.json", "utf8"))
    const newSchema = { ...schema, hash: hex, version: pkg.version }
    fs.writeFileSync("./dist/schema.json", JSON.stringify(newSchema, null, 2))
  },
})

const bundle = () => ({
  async writeBundle() {
    const bundleName = `${pkg.name}-${pkg.version}.tar.gz`
    return tar
      .c({ gzip: true, cwd: "dist" }, [
        "plugin.min.js",
        "schema.json",
        "package.json",
      ])
      .pipe(fs.createWriteStream(`dist/${bundleName}`))
  },
})

export default {
  input: "index.js",
  external: ["svelte", "svelte/internal"],
  output: {
    format: "iife",
    file: "dist/plugin.min.js",
    name: "plugin",
    globals: {
      svelte: "svelte",
      "svelte/internal": "svelte_internal",
    },
  },
  plugins: [
    clean(),
    svelte({
      emitCss: true,
      onwarn: (warning, handler) => {
        if (!ignoredWarnings.includes(warning.code)) {
          handler(warning)
        }
      },
    }),
    postcss(),
    resolve({
      browser: true,
      dedupe: ["svelte"],
      skip: ["svelte", "svelte/internal"],
    }),
    commonjs(),
    json(),
    terser(),
    copyMeta(),
    hash(),
    bundle(),
  ],
}
