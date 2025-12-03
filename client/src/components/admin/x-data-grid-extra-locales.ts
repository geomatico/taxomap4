import { caES as caESCore } from '@mui/material/locale';
import {getGridLocalization} from '@mui/x-data-grid/utils/getGridLocalization';
import {GridLocaleText} from '@mui/x-data-grid';

const caESGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Sense files',
  noResultsOverlayLabel: 'No s\'han trobat resultats.',
  // Density selector toolbar button text
  toolbarDensity: 'Densitat',
  toolbarDensityLabel: 'Densitat',
  toolbarDensityCompact: 'Compacta',
  toolbarDensityStandard: 'Estàndard',
  toolbarDensityComfortable: 'Còmoda',
  // Columns selector toolbar button text
  toolbarColumns: 'Columnes',
  toolbarColumnsLabel: 'Selecciona columnes',
  // Filters toolbar button text
  toolbarFilters: 'Filtres',
  toolbarFiltersLabel: 'Mostra filtres',
  toolbarFiltersTooltipHide: 'Amaga filtres',
  toolbarFiltersTooltipShow: 'Mostra filtres',
  toolbarFiltersTooltipActive: count => count !== 1 ? `${count} filtres actius` : `${count} filtre actiu`,
  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Cerqueu…',
  toolbarQuickFilterLabel: 'Cerca',
  toolbarQuickFilterDeleteIconLabel: 'Esborra',
  // Export selector toolbar button text
  toolbarExport: 'Exporta',
  toolbarExportLabel: 'Exporta',
  toolbarExportCSV: 'Descarrega com a CSV',
  toolbarExportPrint: 'Imprimeix',
  toolbarExportExcel: 'Descarrega com a Excel',
  // Columns panel text
  columnsPanelTextFieldLabel: 'Cerca columna',
  columnsPanelTextFieldPlaceholder: 'Títol de columna',
  columnsPanelDragIconLabel: 'Reordena columna',
  columnsPanelShowAllButton: 'Mostra totes',
  columnsPanelHideAllButton: 'Amaga totes',
  // Filter panel text
  filterPanelAddFilter: 'Afegeix filtre',
  filterPanelRemoveAll: 'Elimina tots',
  filterPanelDeleteIconLabel: 'Elimina',
  filterPanelLogicOperator: 'Operador lògic',
  filterPanelOperator: 'Operador',
  filterPanelOperatorAnd: 'I',
  filterPanelOperatorOr: 'O',
  filterPanelColumns: 'Columnes',
  filterPanelInputLabel: 'Valor',
  filterPanelInputPlaceholder: 'Valor del filtre',
  // Filter operators text
  filterOperatorContains: 'conté',
  filterOperatorEquals: 'és igual a',
  filterOperatorStartsWith: 'comença amb',
  filterOperatorEndsWith: 'acaba amb',
  filterOperatorIs: 'és',
  filterOperatorNot: 'no és',
  filterOperatorAfter: 'és posterior a',
  filterOperatorOnOrAfter: 'és igual o posterior a',
  filterOperatorBefore: 'és anterior a',
  filterOperatorOnOrBefore: 'és igual o anterior a',
  filterOperatorIsEmpty: 'està buit',
  filterOperatorIsNotEmpty: 'no està buit',
  filterOperatorIsAnyOf: 'és qualsevol de',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',
  // Header filter operators text
  headerFilterOperatorContains: 'Conté',
  headerFilterOperatorEquals: 'És igual a',
  headerFilterOperatorStartsWith: 'Comença amb',
  headerFilterOperatorEndsWith: 'Acaba amb',
  headerFilterOperatorIs: 'És',
  headerFilterOperatorNot: 'No és',
  headerFilterOperatorAfter: 'És posterior a',
  headerFilterOperatorOnOrAfter: 'És igual o posterior a',
  headerFilterOperatorBefore: 'És anterior a',
  headerFilterOperatorOnOrBefore: 'És igual o anterior a',
  headerFilterOperatorIsEmpty: 'Està buit',
  headerFilterOperatorIsNotEmpty: 'No està buit',
  headerFilterOperatorIsAnyOf: 'És qualsevol de',
  'headerFilterOperator=': 'Igual que',
  'headerFilterOperator!=': 'Diferent a',
  'headerFilterOperator>': 'Major que',
  'headerFilterOperator>=': 'Major o igual a',
  'headerFilterOperator<': 'Menor que',
  'headerFilterOperator<=': 'Menor o igual a',
  // Filter values text
  filterValueAny: 'qualsevol',
  filterValueTrue: 'cert',
  filterValueFalse: 'fals',
  // Column menu text
  columnMenuLabel: 'Menú',
  columnMenuShowColumns: 'Mostra columnes',
  columnMenuManageColumns: 'Gestiona columnes',
  columnMenuFilter: 'Filtra',
  columnMenuHideColumn: 'Amaga columna',
  columnMenuUnsort: 'Desordena',
  columnMenuSortAsc: 'Ordena ASC',
  columnMenuSortDesc: 'Ordena DESC',
  // Column header text
  columnHeaderFiltersTooltipActive: count => count !== 1 ? `${count} filtres actius` : `${count} filtre actiu`,
  columnHeaderFiltersLabel: 'Mostra filtres',
  columnHeaderSortIconLabel: 'Ordena',
  // Rows selected footer text
  footerRowSelected: count => count !== 1 ? `${count.toLocaleString()} files seleccionades` : `${count.toLocaleString()} fila seleccionada`,
  // Total row amount footer text
  footerTotalRows: 'Files totals:',
  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) => `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,
  // Checkbox selection text
  checkboxSelectionHeaderName: 'Selecció de cel·la',
  checkboxSelectionSelectAllRows: 'Selecciona totes les files',
  checkboxSelectionUnselectAllRows: 'Desselecciona totes les files',
  checkboxSelectionSelectRow: 'Selecciona fila',
  checkboxSelectionUnselectRow: 'Desselecciona fila',
  // Boolean cell text
  booleanCellTrueLabel: 'sí',
  booleanCellFalseLabel: 'no',
  // Actions cell more text
  actionsCellMore: 'més',
  // Column pinning text
  pinToLeft: 'Fixa a l\'esquerra',
  pinToRight: 'Fixa a la dreta',
  unpin: 'Deslliga',
  // Tree Data
  treeDataGroupingHeaderName: 'Grup',
  treeDataExpand: 'mostra fills',
  treeDataCollapse: 'amaga fills',
  // Grouping columns
  groupingColumnHeaderName: 'Grup',
  groupColumn: name => `Agrupa per ${name}`,
  unGroupColumn: name => `Deixa d'agrupar per ${name}`,
  // Master/detail
  detailPanelToggle: 'Commuts panell de detalls',
  expandDetailPanel: 'Expandeix',
  collapseDetailPanel: 'Contrau',
  // Used core components translation keys
  MuiTablePagination: {},
  // Row reordering text
  rowReorderingHeaderName: 'Reordenació de files',
  // Aggregation
  aggregationMenuItemHeader: 'Agregació',
  aggregationFunctionLabelSum: 'suma',
  aggregationFunctionLabelAvg: 'mitjana',
  aggregationFunctionLabelMin: 'mín',
  aggregationFunctionLabelMax: 'màx',
  aggregationFunctionLabelSize: 'mida'
};
export const caEs = getGridLocalization(caESGrid, caESCore);