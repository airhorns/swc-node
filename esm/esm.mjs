import { fileURLToPath, pathToFileURL } from 'url';
import ts from 'typescript';
// @ts-expect-error
import { readDefaultTsConfig } from '../lib/read-default-tsconfig.js';
// @ts-expect-error
import { compile } from '../lib/register.js';
const tsconfig = readDefaultTsConfig();
tsconfig.module = ts.ModuleKind.ESNext;
const moduleResolutionCache = ts.createModuleResolutionCache(ts.sys.getCurrentDirectory(), (x) => x, tsconfig);
const host = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
};
const EXTENSIONS = [ts.Extension.Ts, ts.Extension.Tsx, ts.Extension.Mts];
export const resolve = async (specifier, context, nextResolve) => {
    const isTS = EXTENSIONS.some((ext) => specifier.endsWith(ext));
    // entrypoint
    if (!context.parentURL) {
        return {
            format: isTS ? 'ts' : undefined,
            url: specifier,
            shortCircuit: true,
        };
    }
    // import/require from external library
    if (context.parentURL.includes('/node_modules/') && !isTS) {
        return nextResolve(specifier);
    }
    const { resolvedModule } = ts.resolveModuleName(specifier, fileURLToPath(context.parentURL), tsconfig, host, moduleResolutionCache);
    // import from local project to local project TS file
    if (resolvedModule &&
        !resolvedModule.resolvedFileName.includes('/node_modules/') &&
        EXTENSIONS.includes(resolvedModule.extension)) {
        return {
            format: 'ts',
            url: pathToFileURL(resolvedModule.resolvedFileName).href,
            shortCircuit: true,
        };
    }
    // import from local project to either:
    // - something TS couldn't resolve
    // - external library
    // - local project non-TS file
    return nextResolve(specifier);
};
const tsconfigForSWCNode = {
    ...tsconfig,
    paths: undefined,
    baseUrl: undefined,
};
export const load = async (url, context, nextLoad) => {
    if (context.format === 'ts') {
        const { source } = await nextLoad(url, context);
        const code = typeof source === 'string' ? source : Buffer.from(source).toString();
        const compiled = await compile(code, fileURLToPath(url), tsconfigForSWCNode, true);
        return {
            format: 'module',
            source: compiled,
            shortCircuit: true,
        };
    }
    else {
        return nextLoad(url, context);
    }
};
//# sourceMappingURL=esm.mjs.map