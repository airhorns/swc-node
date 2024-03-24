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
const path_1 = require("path");
const ava_1 = __importDefault(require("ava"));
const ts = __importStar(require("typescript"));
const read_default_tsconfig_1 = require("../read-default-tsconfig");
(0, ava_1.default)('default values', (t) => {
    const options = {};
    const filename = 'some-file.tsx';
    const swcConfig = (0, read_default_tsconfig_1.tsCompilerOptionsToSwcConfig)(options, filename);
    const expected = {
        baseUrl: undefined,
        module: 'es6',
        sourcemap: false,
        experimentalDecorators: false,
        emitDecoratorMetadata: false,
        useDefineForClassFields: false,
        esModuleInterop: false,
        dynamicImport: true,
        externalHelpers: false,
        ignoreDynamic: false,
        jsx: true,
        paths: {},
        keepClassNames: true,
        target: 'es2018',
        react: undefined,
        swc: {
            inputSourceMap: undefined,
            sourceRoot: undefined,
        },
    };
    t.deepEqual(swcConfig, expected);
});
(0, ava_1.default)('should set the decorator config', (t) => {
    const options = {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
    };
    const filename = 'some-file.ts';
    const swcConfig = (0, read_default_tsconfig_1.tsCompilerOptionsToSwcConfig)(options, filename);
    const expected = {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
    };
    t.like(swcConfig, expected);
});
(0, ava_1.default)('should force the jsx  config', (t) => {
    const options = {
        jsx: ts.JsxEmit.ReactJSX,
    };
    const filename = 'some-file.ts';
    const swcConfig = (0, read_default_tsconfig_1.tsCompilerOptionsToSwcConfig)(options, filename);
    const expected = {
        module: 'es6',
        jsx: true,
        react: {
            pragma: options.jsxFactory,
            pragmaFrag: options.jsxFragmentFactory,
            importSource: 'react',
            runtime: 'automatic',
            useBuiltins: true,
        },
        swc: {
            inputSourceMap: undefined,
            sourceRoot: undefined,
        },
    };
    t.like(swcConfig, expected);
});
(0, ava_1.default)('should set all values', (t) => {
    const options = {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES5,
        sourceMap: true,
        esModuleInterop: true,
        inlineSourceMap: true,
        sourceRoot: 'source-root',
        importHelpers: true,
        jsx: ts.JsxEmit.None,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        paths: {
            '@test': ['./specific-path-1/test'],
            '@another': ['./specific-path-2/another'],
        },
        jsxFactory: 'jsx-factory',
        jsxFragmentFactory: 'jsx-fragment-factory',
        jsxImportSource: 'jsx-import-source',
        baseUrl: './packages/register/__test__',
    };
    const filename = 'some-file.tsx';
    const swcConfig = (0, read_default_tsconfig_1.tsCompilerOptionsToSwcConfig)(options, filename);
    const expected = {
        baseUrl: (0, path_1.join)(process.cwd(), options.baseUrl),
        module: 'commonjs',
        sourcemap: 'inline',
        target: 'es5',
        experimentalDecorators: options.experimentalDecorators,
        emitDecoratorMetadata: options.emitDecoratorMetadata,
        useDefineForClassFields: false,
        esModuleInterop: options.esModuleInterop,
        externalHelpers: true,
        ignoreDynamic: false,
        dynamicImport: true,
        keepClassNames: true,
        jsx: true,
        react: {
            pragma: options.jsxFactory,
            pragmaFrag: options.jsxFragmentFactory,
            importSource: options.jsxImportSource,
            runtime: 'classic',
            useBuiltins: true,
        },
        paths: {
            '@test': [(0, path_1.join)(__dirname, './specific-path-1/test')],
            '@another': [(0, path_1.join)(__dirname, './specific-path-2/another')],
        },
        swc: {
            inputSourceMap: options.inlineSourceMap,
            sourceRoot: options.sourceRoot,
        },
    };
    t.deepEqual(swcConfig, expected);
});
//# sourceMappingURL=ts-compiler-options-to-swc-config.spec.js.map