// Production file boundaries. Tests are callers and are not cruised as entry points.
const protocol = 'src/router/(types|app-route-schema|app-route-tree|route-normalizer)\\.ts$'
const iconType = 'src/components/icon/icon\\.types\\.ts$'
const iconCallers = '^src/(router/types\\.ts|stores/menu\\.ts|types/vue-router\\.d\\.ts)$'
const routeTypeCallers = '^src/types/(index\\.ts|vue-router\\.d\\.ts)$'

function boundary(name, from, allowed) {
  return {
    name: `layer-${name}`,
    severity: 'error',
    from: typeof from === 'string'
      ? { path: from }
      : from,
    to: { path: '^src/', pathNot: `^(?:${allowed})` },
  }
}

module.exports = {
  forbidden: [
    {
      name: 'no-unresolved',
      severity: 'error',
      from: { path: '^src/' },
      // unplugin-icons' virtual namespace, not a blanket unresolved exemption.
      to: { couldNotResolve: true, pathNot: '^~icons/[a-z0-9-]+/[a-z0-9-]+$' },
    },
    {
      name: 'no-file-cycles',
      severity: 'error',
      from: { path: '^src/' },
      to: { circular: true },
    },
    {
      name: 'layer-no-startup-back-reference',
      severity: 'error',
      from: { path: '^src/', pathNot: '^src/main\\.ts$' },
      to: { path: '^src/(main\\.ts|App\\.vue)$' },
    },
    boundary('pages', '^src/pages/', `src/(pages|components|api|utils|stores|types|config|constants|assets|composables|locales)/|${protocol}`),
    boundary('components', '^src/components/', 'src/(components|types|utils|config|constants|assets)/|src/composables/useAppBreakpoint\\.ts$|src/locales/(config|types|element-locale)\\.ts$'),
    boundary('api', '^src/api/', 'src/api/|src/utils/api/|src/types/api/|src/(config|constants)/'),
    boundary('shell', '^src/(app/shell|layouts)/', `src/(app/shell|layouts|components|stores|types|utils|config|constants|assets|composables|locales)/|${protocol}`),
    boundary('stores', '^src/stores/', `src/(stores|types|config|constants)/|src/composables/useAppBreakpoint\\.ts$|src/router/types\\.ts$|src/app/shell/route-cache\\.ts$|${iconType}`),
    boundary('router-protocol', { path: '^src/router/', pathNot: '^src/router/(index|app-routes)\\.ts$' }, `${protocol}|src/types/|${iconType}`),
    boundary('router-index', '^src/router/index\\.ts$', `${protocol}|src/router/app-routes\\.ts$|src/stores/|src/types/`),
    // Only the supplemental import.meta.glob edge may bypass this rule, from this exact file.
    boundary('router-loader', '^src/router/app-routes\\.ts$', `${protocol}|src/types/`),
    boundary('composables', { path: '^src/composables/', pathNot: '^src/composables/useI18n\\.ts$' }, 'src/(composables|types|config|constants)/|src/locales/(types|config)\\.ts$'),
    boundary('i18n-adapter', '^src/composables/useI18n\\.ts$', 'src/(types|config|constants|locales)/|src/utils/initApp\\.ts$'),
    boundary('base-config', '^src/(config|constants)/', 'src/(config|constants|types|assets)/'),
    boundary('locale-data', { path: '^src/locales/', pathNot: '^src/locales/i18n\\.ts$' }, 'src/locales/(config|types)\\.ts$|src/locales/[^/]+/[^/]+\\.json$|src/(types|constants)/'),
    boundary('locale-initialization', '^src/locales/i18n\\.ts$', 'src/locales/(config|types)\\.ts$|src/locales/[^/]+/[^/]+\\.json$|src/(types|constants)/|src/utils/initApp\\.ts$'),
    boundary('types', '^src/types/', `src/types/|src/router/types\\.ts$|${iconType}`),
    boundary('utils', '^src/utils/', 'src/(utils|config|constants|types)/|src/locales/(types|config)\\.ts$'),
    {
      name: 'layer-icon-type-callers',
      severity: 'error',
      from: { path: '^src/(router|stores|types)/', pathNot: iconCallers },
      to: { path: `^${iconType}` },
    },
    {
      name: 'layer-icon-type-only',
      severity: 'error',
      from: { path: iconCallers },
      to: {
        path: `^${iconType}`,
        dependencyTypesNot: ['type-only'],
      },
    },
    {
      name: 'layer-shared-route-type-callers',
      severity: 'error',
      from: { path: '^src/types/', pathNot: routeTypeCallers },
      to: { path: '^src/router/types\\.ts$' },
    },
    {
      name: 'layer-shared-route-type-only',
      severity: 'error',
      from: { path: routeTypeCallers },
      to: {
        path: '^src/router/types\\.ts$',
        dependencyTypesNot: ['type-only'],
      },
    },
    {
      name: 'layer-utils-locale-type-only',
      severity: 'error',
      from: { path: '^src/utils/' },
      to: {
        path: '^src/locales/(types|config)\\.ts$',
        dependencyTypesNot: ['type-only'],
      },
    },
  ],
  options: {
    tsConfig: { fileName: 'tsconfig.app.json' },
    tsPreCompilationDeps: true,
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '^src/types/(auto-imports|components)\\.d\\.ts$' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: [
        'import',
        'types',
        'browser',
        'default',
      ],
    },
  },
}
