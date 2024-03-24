"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsCompilerOptionsToSwcConfig = exports.readDefaultTsConfig = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const colorette_1 = require("colorette");
const debug_1 = __importDefault(require("debug"));
const ts = __importStar(require("typescript"));
const debug = (0, debug_1.default)('@swc-node');
function readDefaultTsConfig(tsConfigPath) {
    var _a, _b;
    if (tsConfigPath === void 0) { tsConfigPath = (_b = (_a = process.env.SWC_NODE_PROJECT) !== null && _a !== void 0 ? _a : process.env.TS_NODE_PROJECT) !== null && _b !== void 0 ? _b : (0, path_1.join)(process.cwd(), 'tsconfig.json'); }
    let compilerOptions = {
        target: ts.ScriptTarget.ES2018,
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        sourceMap: true,
        esModuleInterop: true,
    };
    if (!tsConfigPath) {
        return compilerOptions;
    }
    const fullTsConfigPath = (0, path_1.resolve)(tsConfigPath);
    if (!(0, fs_1.existsSync)(fullTsConfigPath)) {
        return compilerOptions;
    }
    try {
        debug(`Read config file from ${fullTsConfigPath}`);
        const { config } = ts.readConfigFile(fullTsConfigPath, ts.sys.readFile);
        const { options, errors, fileNames } = ts.parseJsonConfigFileContent(config, ts.sys, (0, path_1.dirname)(fullTsConfigPath));
        // if baseUrl not set, use dirname of tsconfig.json. align with ts https://www.typescriptlang.org/tsconfig#paths
        if (options.paths && !options.baseUrl) {
            options.baseUrl = (0, path_1.dirname)(fullTsConfigPath);
        }
        if (!errors.length) {
            compilerOptions = options;
            compilerOptions.files = fileNames;
        }
        else {
            console.info((0, colorette_1.yellow)(`Convert compiler options from json failed, ${errors.map((d) => d.messageText).join('\n')}`));
        }
    }
    catch (e) {
        console.info((0, colorette_1.yellow)(`Read ${tsConfigPath} failed: ${e.message}`));
    }
    return compilerOptions;
}
exports.readDefaultTsConfig = readDefaultTsConfig;
function toTsTarget(target) {
    switch (target) {
        case ts.ScriptTarget.ES3:
            return 'es3';
        case ts.ScriptTarget.ES5:
            return 'es5';
        case ts.ScriptTarget.ES2015:
            return 'es2015';
        case ts.ScriptTarget.ES2016:
            return 'es2016';
        case ts.ScriptTarget.ES2017:
            return 'es2017';
        case ts.ScriptTarget.ES2018:
            return 'es2018';
        case ts.ScriptTarget.ES2019:
            return 'es2019';
        case ts.ScriptTarget.ES2020:
            return 'es2020';
        case ts.ScriptTarget.ES2021:
            return 'es2021';
        case ts.ScriptTarget.ES2022:
        case ts.ScriptTarget.ESNext:
        case ts.ScriptTarget.Latest:
            return 'es2022';
        case ts.ScriptTarget.JSON:
            return 'es5';
    }
}
function toModule(moduleKind) {
    switch (moduleKind) {
        case ts.ModuleKind.CommonJS:
            return 'commonjs';
        case ts.ModuleKind.UMD:
            return 'umd';
        case ts.ModuleKind.AMD:
            return 'amd';
        case ts.ModuleKind.ES2015:
        case ts.ModuleKind.ES2020:
        case ts.ModuleKind.ES2022:
        case ts.ModuleKind.ESNext:
        case ts.ModuleKind.Node16:
        case ts.ModuleKind.NodeNext:
        case ts.ModuleKind.None:
            return 'es6';
        case ts.ModuleKind.System:
            throw new TypeError('Do not support system kind module');
    }
}
/**
 * The default value for useDefineForClassFields depends on the emit target
 * @see https://www.typescriptlang.org/tsconfig#useDefineForClassFields
 */
function getUseDefineForClassFields(compilerOptions, target) {
    var _a;
    return (_a = compilerOptions.useDefineForClassFields) !== null && _a !== void 0 ? _a : target >= ts.ScriptTarget.ES2022;
}
function tsCompilerOptionsToSwcConfig(options, filename) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const isJsx = filename.endsWith('.tsx') || filename.endsWith('.jsx') || Boolean(options.jsx);
    const target = (_a = options.target) !== null && _a !== void 0 ? _a : ts.ScriptTarget.ES2018;
    return {
        module: toModule((_b = options.module) !== null && _b !== void 0 ? _b : ts.ModuleKind.ES2015),
        target: toTsTarget(target),
        jsx: isJsx,
        sourcemap: options.sourceMap && options.inlineSourceMap ? 'inline' : Boolean(options.sourceMap),
        experimentalDecorators: (_c = options.experimentalDecorators) !== null && _c !== void 0 ? _c : false,
        emitDecoratorMetadata: (_d = options.emitDecoratorMetadata) !== null && _d !== void 0 ? _d : false,
        useDefineForClassFields: getUseDefineForClassFields(options, target),
        esModuleInterop: (_e = options.esModuleInterop) !== null && _e !== void 0 ? _e : false,
        dynamicImport: true,
        keepClassNames: true,
        externalHelpers: Boolean(options.importHelpers),
        react: ((_h = (_g = (_f = options.jsxFactory) !== null && _f !== void 0 ? _f : options.jsxFragmentFactory) !== null && _g !== void 0 ? _g : options.jsx) !== null && _h !== void 0 ? _h : options.jsxImportSource)
            ? {
                pragma: options.jsxFactory,
                pragmaFrag: options.jsxFragmentFactory,
                importSource: (_j = options.jsxImportSource) !== null && _j !== void 0 ? _j : 'react',
                runtime: ((_k = options.jsx) !== null && _k !== void 0 ? _k : 0) >= ts.JsxEmit.ReactJSX ? 'automatic' : 'classic',
                useBuiltins: true,
            }
            : undefined,
        baseUrl: options.baseUrl ? (0, path_1.resolve)(options.baseUrl) : undefined,
        paths: Object.fromEntries(Object.entries((_l = options.paths) !== null && _l !== void 0 ? _l : {}).map(([aliasKey, aliasPaths]) => {
            var _a;
            return [
                aliasKey,
                ((_a = aliasPaths) !== null && _a !== void 0 ? _a : []).map((path) => { var _a; return (0, path_1.resolve)((_a = options.baseUrl) !== null && _a !== void 0 ? _a : './', path); }),
            ];
        })),
        ignoreDynamic: Boolean(process.env.SWC_NODE_IGNORE_DYNAMIC),
        swc: {
            sourceRoot: options.sourceRoot,
            inputSourceMap: options.inlineSourceMap,
        },
    };
}
exports.tsCompilerOptionsToSwcConfig = tsCompilerOptionsToSwcConfig;
//# sourceMappingURL=read-default-tsconfig.js.map