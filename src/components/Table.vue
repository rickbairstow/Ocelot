<template>
    <div class="flex flex-col gap-4">
        <div
            v-if="showToolbar"
            class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
            <slot
                v-if="$slots.toolbar"
                name="toolbar"
            />

            <template v-else>
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <slot name="toolbar-start" />

                    <div
                        v-if="globalFilter"
                        class="relative w-full sm:w-72"
                    >
                        <Icon
                            aria-hidden="true"
                            class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            icon="Search"
                            size="sm"
                        />
                        <input
                            v-model="filterInputValue"
                            aria-label="Search rows"
                            class="h-10 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 transition-[border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-offset-gray-950"
                            name="table-search"
                            placeholder="Search rows"
                            type="search"
                        />
                    </div>
                </div>

                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <slot name="toolbar-end" />

                    <FloatingPanel
                        v-if="columnVisibility && table"
                        aria-label="Table settings"
                        class="self-start"
                        interaction="click"
                        max-width="380px"
                        placement="bottom-end"
                    >
                        <template #trigger>
                            <Button
                                icon="Settings"
                                size="base"
                                variant="secondary"
                            >
                                Settings
                            </Button>
                        </template>

                        <template #content>
                            <div class="flex min-w-[20rem] max-w-[22rem] flex-col gap-3">
                                <div class="space-y-1">
                                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                        Table settings
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">
                                        Adjust density, visibility, and pinning without losing track of your columns.
                                    </p>
                                </div>

                                <div class="space-y-2 border-b border-gray-200 pb-3 dark:border-gray-700">
                                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                        Density
                                    </p>

                                    <div class="inline-flex rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
                                        <button
                                            class="rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                                            type="button"
                                            :aria-pressed="sizeState === 'sm'"
                                            :class="getSizeButtonClass('sm')"
                                            @click="setTableSize('sm')"
                                        >
                                            Small
                                        </button>
                                        <button
                                            class="rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                                            type="button"
                                            :aria-pressed="sizeState === 'md'"
                                            :class="getSizeButtonClass('md')"
                                            @click="setTableSize('md')"
                                        >
                                            Medium
                                        </button>
                                        <button
                                            class="rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                                            type="button"
                                            :aria-pressed="sizeState === 'lg'"
                                            :class="getSizeButtonClass('lg')"
                                            @click="setTableSize('lg')"
                                        >
                                            Large
                                        </button>
                                    </div>
                                </div>

                                <div class="relative">
                                    <Icon
                                        aria-hidden="true"
                                        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        icon="Search"
                                        size="sm"
                                    />
                                    <input
                                        v-model="columnManagerQuery"
                                        aria-label="Search columns"
                                        class="h-10 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 transition-[border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-offset-gray-950"
                                        placeholder="Search columns"
                                        type="search"
                                    />
                                </div>

                                <div class="flex flex-wrap gap-2 border-b border-gray-200 pb-3 dark:border-gray-700">
                                    <span class="basis-full text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                        Columns
                                    </span>

                                    <button
                                        class="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
                                        type="button"
                                        @click="setAllColumnsVisible(true)"
                                    >
                                        Show all
                                    </button>
                                    <button
                                        class="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
                                        type="button"
                                        :class="!canHideMultipleColumns ? 'cursor-not-allowed opacity-50 hover:bg-white dark:hover:bg-gray-900' : ''"
                                        :disabled="!canHideMultipleColumns"
                                        @click="setAllColumnsVisible(false)"
                                    >
                                        Hide all
                                    </button>
                                    <button
                                        class="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
                                        type="button"
                                        @click="clearPinnedColumns"
                                    >
                                        Clear pins
                                    </button>
                                    <span class="ml-auto self-center text-xs text-gray-500 dark:text-gray-400">
                                        {{ visibleManageableColumnCount }}/{{ manageableColumns.length }} visible
                                    </span>
                                </div>

                                <div
                                    v-if="filteredManageableColumns.length > 0"
                                    class="max-h-80 space-y-2 overflow-y-auto pr-1"
                                >
                                    <p class="px-1 text-xs text-gray-500 dark:text-gray-400">
                                        Keep at least one column visible at all times.
                                    </p>

                                    <div
                                        v-for="item in filteredManageableColumns"
                                        :key="item.column.id"
                                        class="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-2 dark:border-gray-700 dark:bg-gray-900/60"
                                    >
                                        <label
                                            class="flex min-w-0 flex-1 items-center gap-3"
                                            :for="`table-column-toggle-${item.column.id}`"
                                        >
                                            <input
                                                :id="`table-column-toggle-${item.column.id}`"
                                                class="size-4 rounded border border-gray-300 dark:border-gray-600"
                                                type="checkbox"
                                                :aria-label="item.label"
                                                :checked="item.column.getIsVisible()"
                                                :disabled="!canToggleColumnVisibility(item)"
                                                @change="handleColumnVisibilityToggle(item, ($event.target as HTMLInputElement).checked)"
                                            />
                                            <span class="min-w-0">
                                                <span class="block truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                                                    {{ item.label }}
                                                </span>
                                                <span class="block text-xs text-gray-500 dark:text-gray-400">
                                                    {{ getColumnStatusLabel(item.column.id, item.column.getIsVisible()) }}
                                                </span>
                                            </span>
                                        </label>

                                        <div
                                            v-if="item.canPin"
                                            class="inline-flex shrink-0 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900"
                                        >
                                            <button
                                                class="rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                                                type="button"
                                                :aria-label="`Pin ${item.label} left`"
                                                :aria-pressed="getPinState(item.column.id) === 'left'"
                                                :class="getPinButtonClass(item.column.id, 'left')"
                                                @click="setColumnPin(item.column.id, 'left')"
                                            >
                                                Left
                                            </button>
                                            <button
                                                class="rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                                                type="button"
                                                :aria-label="`Unpin ${item.label}`"
                                                :aria-pressed="getPinState(item.column.id) === null"
                                                :class="getPinButtonClass(item.column.id, null)"
                                                @click="setColumnPin(item.column.id, null)"
                                            >
                                                Off
                                            </button>
                                            <button
                                                class="rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                                                type="button"
                                                :aria-label="`Pin ${item.label} right`"
                                                :aria-pressed="getPinState(item.column.id) === 'right'"
                                                :class="getPinButtonClass(item.column.id, 'right')"
                                                @click="setColumnPin(item.column.id, 'right')"
                                            >
                                                Right
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    v-else
                                    class="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-400"
                                >
                                    No columns match "{{ columnManagerQuery }}".
                                </div>
                            </div>
                        </template>
                    </FloatingPanel>
                </div>
            </template>
        </div>

        <div
            v-if="dependencyMissing"
            class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50"
        >
            <EmptyState
                description="Install @tanstack/vue-table to use the Table component."
                icon="Table"
                title="Table dependency missing"
                title-tag="h2"
            />
        </div>

        <template v-else-if="table">
            <div
                v-if="effectiveMobileLayout === 'card'"
                class="space-y-4 md:hidden"
            >
                <template v-if="loading">
                    <div
                        v-for="skeletonRow in loadingRows"
                        :key="`table-card-skeleton-${skeletonRow}`"
                        class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div class="space-y-3">
                            <div
                                v-for="cellIndex in Math.max(visibleColumnCount, 3)"
                                :key="`table-card-cell-${cellIndex}`"
                                class="grid grid-cols-[minmax(0,120px)_1fr] items-center gap-3"
                            >
                                <div class="animate-pulse">
                                    <div
                                        class="h-3 rounded-full bg-gray-200 dark:bg-gray-700"
                                        :class="getCardSkeletonLabelWidthClass(cellIndex - 1)"
                                    />
                                </div>

                                <div class="animate-pulse space-y-2">
                                    <div
                                        class="h-4 rounded-full bg-gray-200 dark:bg-gray-700"
                                        :class="getSkeletonBarWidthClass(cellIndex - 1, 0)"
                                    />
                                    <div
                                        class="h-3 rounded-full bg-gray-100 dark:bg-gray-800"
                                        :class="getSkeletonBarWidthClass(cellIndex - 1, 1)"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <div
                    v-else-if="displayRows.length === 0"
                    class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50"
                >
                    <slot name="empty">
                        <EmptyState
                            description="Try adjusting your filters or add a new record."
                            icon="Table"
                            title="No rows found"
                            title-tag="h2"
                        />
                    </slot>
                </div>

                <component
                    :is="isRowInteractive(row) ? 'button' : 'div'"
                    v-for="row in displayRows"
                    :key="row.id"
                    class="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition-colors dark:border-gray-800 dark:bg-gray-900"
                    :class="cardRowClass(row)"
                    :tabindex="isRowInteractive(row) ? 0 : undefined"
                    :type="isRowInteractive(row) ? 'button' : undefined"
                    @click="handleRowInteraction(row, $event)"
                    @keydown.enter.prevent="handleRowKeydown(row, $event)"
                    @keydown.space.prevent="handleRowKeydown(row, $event)"
                >
                    <div class="space-y-3">
                        <div
                            v-for="cell in row.getVisibleCells()"
                            :key="cell.id"
                            class="grid grid-cols-[minmax(0,120px)_1fr] items-start gap-3"
                        >
                            <span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                {{ getCellLabel(cell) }}
                            </span>

                            <div class="min-w-0 text-sm text-gray-900 dark:text-gray-100">
                                <slot
                                    v-if="hasCellSlot(cell.column.id)"
                                    :cell="cell"
                                    :get-value="cell.getValue"
                                    :name="getCellSlotName(cell.column.id)"
                                    :row="row"
                                />
                                <component
                                    :is="flexRenderComponent"
                                    v-else
                                    :props="cell.getContext()"
                                    :render="cell.column.columnDef.cell"
                                />
                            </div>
                        </div>

                        <div
                            v-if="isRowExpanded(row)"
                            class="border-t border-gray-200 pt-3 dark:border-gray-800"
                        >
                            <slot
                                name="row-expanded"
                                :row="row"
                            />
                        </div>
                    </div>
                </component>
            </div>

            <div :class="effectiveMobileLayout === 'card' ? 'hidden md:block' : 'block'">
                <div class="relative">
                    <div
                        v-if="hasHorizontalOverflow"
                        class="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-8 bg-linear-to-l from-white to-transparent dark:from-gray-950 sm:block"
                    />

                    <div
                        ref="tableScrollContainerRef"
                        class="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-950"
                        @scroll="updateHorizontalOverflow"
                    >
                        <table class="min-w-full w-max border-separate border-spacing-0 text-left text-sm text-gray-900 dark:text-gray-100">
                            <colgroup>
                                <col
                                    v-for="column in visibleLeafColumns"
                                    :key="`table-col-${column.id}`"
                                    :style="getColumnWidthStyle(column.id, column.getSize())"
                                />
                            </colgroup>

                            <caption
                                v-if="caption"
                                :class="captionVisible ? 'px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300' : 'sr-only'"
                            >
                                {{ caption }}
                            </caption>

                            <thead class="bg-gray-50 dark:bg-gray-900">
                                <tr
                                    v-for="headerGroup in table.getHeaderGroups()"
                                    :key="headerGroup.id"
                                >
                                    <th
                                        v-for="(header, headerIndex) in headerGroup.headers"
                                        :key="header.id"
                                        class="relative border-b border-gray-200 align-middle text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-400"
                                        :aria-sort="getAriaSort(header)"
                                        :class="getHeaderCellClass(header, headerIndex)"
                                        :style="[getWidthStyle(header.column.getSize()), getPinnedStyle(header.column.id, headerIndex)]"
                                    >
                                        <template v-if="!header.isPlaceholder">
                                            <button
                                                v-if="header.column.getCanSort()"
                                                class="flex w-full items-center justify-between gap-2 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                                                type="button"
                                                @click="toggleSorting(header, $event)"
                                            >
                                                <slot
                                                    v-if="hasHeaderSlot(header.column.id)"
                                                    :column="header.column"
                                                    :name="getHeaderSlotName(header.column.id)"
                                                />
                                                <component
                                                    :is="flexRenderComponent"
                                                    v-else
                                                    :props="header.getContext()"
                                                    :render="header.column.columnDef.header"
                                                />

                                                <Icon
                                                    aria-hidden="true"
                                                    class="shrink-0 text-gray-400"
                                                    size="sm"
                                                    :icon="getSortIcon(header)"
                                                />
                                            </button>

                                            <template v-else>
                                                <slot
                                                    v-if="hasHeaderSlot(header.column.id)"
                                                    :column="header.column"
                                                    :name="getHeaderSlotName(header.column.id)"
                                                />
                                                <component
                                                    :is="flexRenderComponent"
                                                    v-else
                                                    :props="header.getContext()"
                                                    :render="header.column.columnDef.header"
                                                />
                                            </template>
                                        </template>

                                        <div
                                            v-if="header.column.getCanResize()"
                                            aria-hidden="true"
                                            class="absolute inset-y-0 right-0 z-10 flex w-3 cursor-col-resize items-center justify-center touch-none"
                                            @dblclick="header.column.resetSize()"
                                            @mousedown="header.getResizeHandler()?.($event)"
                                            @touchstart="header.getResizeHandler()?.($event)"
                                        >
                                            <span class="h-5 w-px rounded-full bg-gray-200 dark:bg-gray-700" />
                                        </div>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr
                                    v-for="skeletonRow in loading ? loadingRows : 0"
                                    :key="`table-loading-${skeletonRow}`"
                                    class="border-b border-gray-200 dark:border-gray-800"
                                >
                                    <td
                                        v-for="columnIndex in visibleColumnCount"
                                        :key="`table-loading-cell-${skeletonRow}-${columnIndex}`"
                                        class="border-b border-gray-200 align-middle text-sm dark:border-gray-800"
                                        :class="getBodyCellClass('', columnIndex - 1)"
                                    >
                                        <slot name="loading">
                                            <div class="animate-pulse space-y-2">
                                                <div
                                                    class="h-4 rounded-full bg-gray-200 dark:bg-gray-700"
                                                    :class="getSkeletonBarWidthClass(columnIndex - 1, 0)"
                                                />
                                                <div
                                                    class="h-3 rounded-full bg-gray-100 dark:bg-gray-800"
                                                    :class="getSkeletonBarWidthClass(columnIndex - 1, 1)"
                                                />
                                            </div>
                                        </slot>
                                    </td>
                                </tr>

                                <tr v-if="!loading && displayRows.length === 0">
                                    <td
                                        class="px-4 py-8"
                                        :colspan="visibleColumnCount"
                                    >
                                        <slot name="empty">
                                            <EmptyState
                                                description="Try adjusting your filters or add a new record."
                                                icon="Table"
                                                title="No rows found"
                                                title-tag="h2"
                                            />
                                        </slot>
                                    </td>
                                </tr>

                                <template
                                    v-for="(row, rowIndex) in loading ? [] : displayRows"
                                    :key="row.id"
                                >
                                    <tr
                                        class="group transition-colors"
                                        :class="getRowClass(row, rowIndex)"
                                        :tabindex="isRowInteractive(row) ? 0 : undefined"
                                        @click="handleRowInteraction(row, $event)"
                                        @keydown.enter.prevent="handleRowKeydown(row, $event)"
                                        @keydown.space.prevent="handleRowKeydown(row, $event)"
                                    >
                                        <td
                                            v-for="(cell, cellIndex) in row.getVisibleCells()"
                                            :key="cell.id"
                                            class="border-b border-gray-200 align-middle text-sm dark:border-gray-800"
                                            :class="getBodyCellClass(cell.column.id, cellIndex, row, rowIndex)"
                                            :style="[getWidthStyle(cell.column.getSize()), getPinnedStyle(cell.column.id, cellIndex)]"
                                        >
                                            <slot
                                                v-if="hasCellSlot(cell.column.id)"
                                                :cell="cell"
                                                :get-value="cell.getValue"
                                                :name="getCellSlotName(cell.column.id)"
                                                :row="row"
                                            />
                                            <component
                                                :is="flexRenderComponent"
                                                v-else
                                                :props="cell.getContext()"
                                                :render="cell.column.columnDef.cell"
                                            />
                                        </td>
                                    </tr>

                                    <tr v-if="isRowExpanded(row)">
                                        <td
                                            class="border-b border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-800 dark:bg-gray-900/50"
                                            :colspan="visibleColumnCount"
                                        >
                                            <slot
                                                name="row-expanded"
                                                :row="row"
                                            />
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div
                v-if="pagination"
                class="flex flex-col gap-3 border-t border-gray-200 pt-4 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300 lg:flex-row lg:items-center lg:justify-between"
            >
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <p>
                        Showing {{ rangeStart }}-{{ rangeEnd }} of {{ totalRows }} rows
                    </p>

                    <label class="flex items-center gap-2">
                        <span class="text-sm">Rows per page</span>
                        <select
                            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-offset-gray-950"
                            :value="paginationState.pageSize"
                            @change="setPageSize(Number(($event.target as HTMLSelectElement).value))"
                        >
                            <option
                                v-for="option in normalizedPageSizeOptions"
                                :key="`table-page-size-${option}`"
                                :value="option"
                            >
                                {{ option }}
                            </option>
                        </select>
                    </label>
                </div>

                <Pagination
                    :model-value="currentPage"
                    :total="pageCount"
                    @update:model-value="setCurrentPage"
                />
            </div>
        </template>

        <div
            v-else
            class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-950"
        >
            <div class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                <div class="animate-pulse">
                    <div class="h-3 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>

            <div class="divide-y divide-gray-200 dark:divide-gray-800">
                <div
                    v-for="rowIndex in 4"
                    :key="`table-init-${rowIndex}`"
                    class="grid grid-cols-3 gap-4 px-4 py-3"
                >
                    <div
                        v-for="columnIndex in 3"
                        :key="`table-init-${rowIndex}-${columnIndex}`"
                        class="animate-pulse space-y-2"
                    >
                        <div
                            class="h-4 rounded-full bg-gray-200 dark:bg-gray-700"
                            :class="getSkeletonBarWidthClass(columnIndex - 1, 0)"
                        />
                        <div
                            class="h-3 rounded-full bg-gray-100 dark:bg-gray-800"
                            :class="getSkeletonBarWidthClass(columnIndex - 1, 1)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useSlots, watch } from 'vue'
import type { Component, CSSProperties, FunctionalComponent, Slots } from 'vue'
import Button from '@Components/Button.vue'
import EmptyState from '@Components/EmptyState.vue'
import FloatingPanel from '@Components/FloatingPanel.vue'
import Icon from '@Components/Icon.vue'
import Pagination from '@Components/Pagination.vue'
import { warnOptionalDependency } from '@Utils/optionalDependency'

type TableSize = 'sm' | 'md' | 'lg'
type RowSelectionMode = 'none' | 'single' | 'multi'
type MobileLayout = 'card' | 'scroll'
type SortState = { desc: boolean; id: string }[]
type PageState = { pageIndex: number; pageSize: number }
type RowSelectionState = Record<string, boolean>
type ColumnVisibilityState = Record<string, boolean>
type ColumnSizingState = Record<string, number>
type GenericRecord = Record<string, unknown>
type PinnedColumns = {
    left?: string[]
    right?: string[]
}
type PinSide = 'left' | 'right'
type TableRow = {
    getIsSelected: () => boolean
    getToggleSelectedHandler: () => (event?: unknown) => void
    getVisibleCells: () => TableCell[]
    getCanExpand?: () => boolean
    getIsExpanded?: () => boolean
    id: string
    original: GenericRecord
    toggleSelected: (value?: boolean) => void
}
type TableCell = {
    column: TableColumn
    getContext: () => Record<string, unknown>
    getValue: () => unknown
    id: string
}
type TableHeader = {
    column: TableColumn
    getContext: () => Record<string, unknown>
    getResizeHandler: () => ((event: Event) => void) | undefined
    id: string
    isPlaceholder: boolean
}
type TableColumn = {
    columnDef: {
        cell?: unknown
        enableHiding?: boolean
        header?: unknown
        meta?: {
            cardLabel?: string
            label?: string
        }
        minSize?: number
        size?: number
    }
    getCanHide: () => boolean
    getCanResize: () => boolean
    getCanSort: () => boolean
    getIsSorted: () => false | 'asc' | 'desc'
    getIsVisible: () => boolean
    getSize: () => number
    id: string
    resetSize: () => void
    toggleSorting: (desc?: boolean, isMulti?: boolean) => void
    toggleVisibility: (value?: boolean) => void
}
type TableInstance = {
    getAllLeafColumns: () => TableColumn[]
    getFilteredRowModel: () => { rows: TableRow[] }
    getHeaderGroups: () => { headers: TableHeader[]; id: string }[]
    getPageCount: () => number
    getRowModel: () => { rows: TableRow[] }
    getState: () => {
        pagination: PageState
    }
    getVisibleLeafColumns: () => TableColumn[]
    setGlobalFilter: (value: string) => void
    setPageIndex: (pageIndex: number) => void
    setPageSize: (pageSize: number) => void
}
type InternalTableModule = typeof import('@tanstack/vue-table')
type InternalColumnDef = import('@tanstack/vue-table').ColumnDef<GenericRecord, unknown>
type InternalColumn = import('@tanstack/vue-table').Column<GenericRecord, unknown>
type InternalCell = import('@tanstack/vue-table').Cell<GenericRecord, unknown>
type InternalRow = import('@tanstack/vue-table').Row<GenericRecord>

interface Props {
    bordered?: boolean
    caption?: string
    captionVisible?: boolean
    canExpandRow?: ((row: GenericRecord) => boolean) | undefined
    columns: unknown[]
    columnSizing?: ColumnSizingState
    columnVisibility?: boolean
    columnVisibilityState?: ColumnVisibilityState
    data: unknown[]
    expandableRows?: boolean
    getRowId?: ((row: GenericRecord) => string) | undefined
    globalFilter?: boolean
    hoverable?: boolean
    loading?: boolean
    loadingRows?: number
    manualFiltering?: boolean
    manualPagination?: boolean
    manualSorting?: boolean
    pageCount?: number
    pageSize?: number
    pageSizeOptions?: number[]
    pagination?: boolean
    pinnedColumns?: PinnedColumns
    resizableColumns?: boolean
    mobileLayout?: MobileLayout
    responsiveMode?: MobileLayout
    rowCount?: number
    rowSelection?: RowSelectionMode
    size?: TableSize
    stickyFirstColumn?: boolean
    stickyHeader?: boolean
    striped?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    bordered: false,
    caption: undefined,
    captionVisible: false,
    canExpandRow: undefined,
    columnSizing: () => ({}),
    columnVisibility: false,
    columnVisibilityState: () => ({}),
    expandableRows: false,
    getRowId: undefined,
    globalFilter: false,
    hoverable: true,
    loading: false,
    loadingRows: 5,
    manualFiltering: false,
    manualPagination: false,
    manualSorting: false,
    pageCount: undefined,
    pageSize: 10,
    pageSizeOptions: () => [10, 25, 50, 100],
    pagination: true,
    pinnedColumns: () => ({
        left: [],
        right: []
    }),
    resizableColumns: false,
    mobileLayout: undefined,
    responsiveMode: 'scroll',
    rowCount: undefined,
    rowSelection: 'none',
    size: 'md',
    stickyFirstColumn: false,
    stickyHeader: false,
    striped: false
})

const emit = defineEmits<{
    'column-sizing-change': [value: ColumnSizingState]
    'column-visibility-change': [value: ColumnVisibilityState]
    'filter-change': [value: string]
    'page-change': [value: PageState]
    'pinned-columns-change': [value: PinnedColumns]
    'row-click': [payload: { event: MouseEvent | KeyboardEvent; row: TableRow }]
    'row-expand-change': [value: string[]]
    'row-selection-change': [value: RowSelectionState]
    'size-change': [value: TableSize]
    'sort-change': [value: SortState]
}>()

const slots: Slots = useSlots()
const columnSizingState = ref<ColumnSizingState>({ ...props.columnSizing })
const dependencyMissing = ref(false)
const expandedRowIds = ref<Record<string, boolean>>({})
const filterDebounce = ref<number | null>(null)
const filterInputValue = ref('')
const columnManagerQuery = ref('')
const hasHorizontalOverflow = ref(false)
const flexRenderComponent = shallowRef<Component | FunctionalComponent | null>(null)
const effectiveMobileLayout = computed<MobileLayout>(() => props.mobileLayout ?? props.responsiveMode)
const pinnedColumnsState = ref<PinnedColumns>({
    left: [...(props.pinnedColumns.left ?? [])],
    right: [...(props.pinnedColumns.right ?? [])]
})
const paginationState = ref<PageState>({
    pageIndex: 0,
    pageSize: props.pageSize
})
const rowSelectionState = ref<RowSelectionState>({})
const sizeState = ref<TableSize>(props.size)
const sortingState = ref<SortState>([])
const table = shallowRef<TableInstance | null>(null)
const tableModule = shallowRef<InternalTableModule | null>(null)
const tableScrollContainerRef = ref<HTMLElement | null>(null)
const visibilityState = ref<ColumnVisibilityState>({ ...props.columnVisibilityState })

const sizeClasses: Record<TableSize, string> = {
    lg: 'px-5 py-4',
    md: 'px-4 py-3',
    sm: 'px-3 py-2.5'
}
const headerSizeClasses: Record<TableSize, string> = {
    lg: 'px-5 py-4',
    md: 'px-4 py-3',
    sm: 'px-3 py-2.5'
}

let tableImportPromise: Promise<InternalTableModule | null> | null = null
let overflowResizeObserver: ResizeObserver | null = null

const SelectionCheckbox = defineComponent({
    name: 'TableSelectionCheckbox',
    props: {
        ariaLabel: {
            type: String,
            required: true
        },
        checked: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        indeterminate: {
            type: Boolean,
            default: false
        }
    },
    emits: ['change'],
    setup(selectionProps, { emit: emitChange }) {
        const inputRef = ref<HTMLInputElement | null>(null)

        watch(() => selectionProps.indeterminate, (value) => {
            if (inputRef.value) inputRef.value.indeterminate = value
        }, { immediate: true })

        return () => h('input', {
            ref: inputRef,
            'aria-checked': selectionProps.indeterminate ? 'mixed' : undefined,
            'aria-label': selectionProps.ariaLabel,
            checked: selectionProps.checked,
            class: 'size-4 shrink-0 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:border-transparent checked:bg-blue-600 indeterminate:border-transparent indeterminate:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:checked:bg-blue-500 dark:indeterminate:bg-blue-500',
            disabled: selectionProps.disabled,
            onChange: (event: Event) => emitChange('change', (event.target as HTMLInputElement).checked),
            type: 'checkbox'
        })
    }
})

const showToolbar = computed<boolean>(() =>
    Boolean(slots.toolbar)
    || Boolean(slots['toolbar-start'])
    || Boolean(slots['toolbar-end'])
    || props.globalFilter
    || props.columnVisibility
)

const hasRowActionsSlot = computed<boolean>(() => Boolean(slots['row-actions']))
const hasExpandedRowSlot = computed<boolean>(() => Boolean(slots['row-expanded']))

const orderColumnsByPinState = (columns: InternalColumnDef[]): InternalColumnDef[] => {
    const getColumnId = (column: InternalColumnDef, index: number) => {
        const explicitId = typeof column.id === 'string' ? column.id : undefined
        if (explicitId) return explicitId

        const accessorKey = typeof (column as { accessorKey?: unknown }).accessorKey === 'string'
            ? (column as { accessorKey: string }).accessorKey
            : undefined
        if (accessorKey) return accessorKey

        return `column-${index}`
    }

    const columnsWithIds = columns.map((column, index) => ({
        column,
        id: getColumnId(column, index)
    }))
    const alwaysLeftIds = ['__expander', '__selection']
    const alwaysRightIds = ['__actions']
    const leftPinnedIds = pinnedColumnsState.value.left ?? []
    const rightPinnedIds = pinnedColumnsState.value.right ?? []

    const alwaysLeftColumns = alwaysLeftIds
        .map(id => columnsWithIds.find(item => item.id === id))
        .filter((item): item is { column: InternalColumnDef; id: string } => Boolean(item))
        .map(item => item.column)

    const leftPinnedColumns = leftPinnedIds
        .map(id => columnsWithIds.find(item => item.id === id))
        .filter((item): item is { column: InternalColumnDef; id: string } => {
            if (!item) return false
            return !alwaysLeftIds.includes(item.id) && !alwaysRightIds.includes(item.id)
        })
        .map(item => item.column)

    const rightPinnedColumns = rightPinnedIds
        .map(id => columnsWithIds.find(item => item.id === id))
        .filter((item): item is { column: InternalColumnDef; id: string } => {
            if (!item) return false
            return !alwaysLeftIds.includes(item.id) && !alwaysRightIds.includes(item.id)
        })
        .map(item => item.column)

    const alwaysRightColumns = alwaysRightIds
        .map(id => columnsWithIds.find(item => item.id === id))
        .filter((item): item is { column: InternalColumnDef; id: string } => Boolean(item))
        .map(item => item.column)

    const centerColumns = columnsWithIds
        .filter(item =>
            !alwaysLeftIds.includes(item.id)
            && !alwaysRightIds.includes(item.id)
            && !leftPinnedIds.includes(item.id)
            && !rightPinnedIds.includes(item.id)
        )
        .map(item => item.column)

    return [...alwaysLeftColumns, ...leftPinnedColumns, ...centerColumns, ...rightPinnedColumns, ...alwaysRightColumns]
}

const resolvedColumns = computed((): InternalColumnDef[] => {
    const baseColumns = props.columns as InternalColumnDef[]

    const selectionColumn: InternalColumnDef[] = props.rowSelection === 'multi'
        ? [{
            cell: ({ row }: { row: InternalRow }) => h(SelectionCheckbox, {
                ariaLabel: `Select row ${row.id}`,
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect?.(),
                indeterminate: row.getIsSomeSelected?.() && !row.getIsSelected(),
                onChange: (value: boolean) => row.toggleSelected(value)
            }),
            enableHiding: false,
            enableResizing: false,
            enableSorting: false,
            header: ({ table: tanstackTable }: { table: import('@tanstack/vue-table').Table<GenericRecord> }) => h(SelectionCheckbox, {
                ariaLabel: 'Select visible rows',
                checked: tanstackTable.getIsAllPageRowsSelected(),
                indeterminate: tanstackTable.getIsSomePageRowsSelected() && !tanstackTable.getIsAllPageRowsSelected(),
                onChange: (value: boolean) => tanstackTable.toggleAllPageRowsSelected(value)
            }),
            id: '__selection',
            meta: {
                cardLabel: 'Selected',
                label: 'Selected'
            },
            maxSize: 36,
            minSize: 36,
            size: 36
        }]
        : []

    const expanderColumn: InternalColumnDef[] = props.expandableRows || hasExpandedRowSlot.value
        ? [{
            cell: ({ row }: { row: InternalRow }) => canRowExpand(row as unknown as TableRow)
                ? h('button', {
                    'aria-expanded': isRowExpanded(row as unknown as TableRow),
                    'aria-label': `${isRowExpanded(row as unknown as TableRow) ? 'Collapse' : 'Expand'} row ${row.id}`,
                    class: 'inline-flex size-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-offset-gray-950',
                    onClick: (event: MouseEvent) => {
                        event.stopPropagation()
                        toggleRowExpanded(row as unknown as TableRow)
                    },
                    type: 'button'
                }, [
                    h(Icon, {
                        'aria-hidden': 'true',
                        icon: isRowExpanded(row as unknown as TableRow) ? 'ChevronDown' : 'ChevronRight',
                        size: 'sm'
                    })
                ])
                : null,
            enableHiding: false,
            enableResizing: false,
            enableSorting: false,
            header: () => h('span', { class: 'sr-only' }, 'Expand row'),
            id: '__expander',
            maxSize: 44,
            meta: {
                cardLabel: 'Expanded',
                label: 'Expanded'
            },
            minSize: 36,
            size: 36
        }]
        : []

    const actionsColumn: InternalColumnDef[] = hasRowActionsSlot.value
        ? [{
            cell: ({ row }: { row: InternalRow }) => slots['row-actions']?.({ row }),
            enableHiding: false,
            enableResizing: false,
            enableSorting: false,
            header: 'Actions',
            id: '__actions',
            meta: {
                cardLabel: 'Actions',
                label: 'Actions'
            },
            minSize: 120,
            size: 120
        }]
        : []

    return orderColumnsByPinState([
        ...expanderColumn,
        ...selectionColumn,
        ...baseColumns,
        ...actionsColumn
    ])
})

const manageableColumns = computed(() =>
    table.value?.getAllLeafColumns()
        .map((column) => ({
            canHide: column.getCanHide(),
            canPin: !column.id.startsWith('__'),
            column,
            label: getColumnHeadingLabel(column)
        }))
        .filter(item => item.canHide || item.canPin) ?? []
)
const filteredManageableColumns = computed(() => {
    const query = columnManagerQuery.value.trim().toLowerCase()
    if (!query) return manageableColumns.value

    return manageableColumns.value.filter(item =>
        item.label.toLowerCase().includes(query)
        || item.column.id.toLowerCase().includes(query)
    )
})
const visibleManageableColumnCount = computed(() =>
    manageableColumns.value.filter(item => item.column.getIsVisible()).length
)
const visibleHideableColumnCount = computed(() =>
    manageableColumns.value.filter(item => item.canHide && item.column.getIsVisible()).length
)
const canHideMultipleColumns = computed(() => visibleHideableColumnCount.value > 1)

const visibleLeafColumns = computed(() => table.value?.getVisibleLeafColumns() ?? [])
const displayRows = computed(() => table.value?.getRowModel().rows ?? [])
const visibleColumnCount = computed(() =>
    visibleLeafColumns.value.length || resolvedColumns.value.length || 1
)
const currentPage = computed(() => paginationState.value.pageIndex + 1)
const pageCount = computed(() => {
    if (!props.pagination) return 1
    if (props.manualPagination) return Math.max(props.pageCount ?? 1, 1)
    return Math.max(table.value?.getPageCount() ?? 1, 1)
})
const totalRows = computed(() => {
    if (props.manualPagination || props.manualFiltering) {
        return props.rowCount ?? props.data.length
    }
    return table.value?.getFilteredRowModel().rows.length ?? props.data.length
})
const rangeStart = computed(() => {
    if (displayRows.value.length === 0) return 0
    return (paginationState.value.pageIndex * paginationState.value.pageSize) + 1
})
const rangeEnd = computed(() => {
    if (displayRows.value.length === 0) return 0
    return Math.min(rangeStart.value + displayRows.value.length - 1, totalRows.value)
})
const normalizedPageSizeOptions = computed(() =>
    Array.from(new Set([...props.pageSizeOptions, paginationState.value.pageSize]))
        .filter(option => Number.isFinite(option) && option > 0)
        .sort((a, b) => a - b)
)

const loadTanStackTable = async (): Promise<InternalTableModule | null> => {
    if (tableModule.value) return tableModule.value

    if (!tableImportPromise) {
        tableImportPromise = import('@tanstack/vue-table').catch(() => {
            dependencyMissing.value = true
            warnOptionalDependency('Table', '@tanstack/vue-table')
            return null
        })
    }

    const loadedModule = await tableImportPromise
    if (!loadedModule) return null

    tableModule.value = loadedModule
    flexRenderComponent.value = loadedModule.FlexRender
    return loadedModule
}

const resolveUpdater = <T>(updater: T | ((previous: T) => T), previous: T): T =>
    typeof updater === 'function'
        ? (updater as (value: T) => T)(previous)
        : updater

const initializeTable = async () => {
    const loadedModule = await loadTanStackTable()
    if (!loadedModule) return

    table.value = loadedModule.useVueTable({
        columnResizeMode: 'onChange',
        enableColumnResizing: props.resizableColumns,
        get columns() {
            return resolvedColumns.value
        },
        get data() {
            return props.data as GenericRecord[]
        },
        enableMultiRowSelection: props.rowSelection === 'multi',
        enableRowSelection: props.rowSelection !== 'none',
        getCoreRowModel: loadedModule.getCoreRowModel(),
        getFilteredRowModel: props.manualFiltering ? undefined : loadedModule.getFilteredRowModel(),
        getPaginationRowModel: props.manualPagination ? undefined : loadedModule.getPaginationRowModel(),
        getRowId: props.getRowId
            ? (row: GenericRecord, index: number) => props.getRowId?.(row) ?? String(index)
            : undefined,
        getSortedRowModel: props.manualSorting ? undefined : loadedModule.getSortedRowModel(),
        manualFiltering: props.manualFiltering,
        manualPagination: props.manualPagination,
        manualSorting: props.manualSorting,
        onColumnSizingChange: (updater: ColumnSizingState | ((previous: ColumnSizingState) => ColumnSizingState)) => {
            columnSizingState.value = resolveUpdater(updater, columnSizingState.value)
            emit('column-sizing-change', columnSizingState.value)
        },
        onColumnVisibilityChange: (updater: ColumnVisibilityState | ((previous: ColumnVisibilityState) => ColumnVisibilityState)) => {
            visibilityState.value = resolveUpdater(updater, visibilityState.value)
            emit('column-visibility-change', visibilityState.value)
        },
        onPaginationChange: (updater: PageState | ((previous: PageState) => PageState)) => {
            paginationState.value = resolveUpdater(updater, paginationState.value)
            emit('page-change', paginationState.value)
        },
        onRowSelectionChange: (updater: RowSelectionState | ((previous: RowSelectionState) => RowSelectionState)) => {
            rowSelectionState.value = resolveUpdater(updater, rowSelectionState.value)
            emit('row-selection-change', rowSelectionState.value)
        },
        onSortingChange: (updater: SortState | ((previous: SortState) => SortState)) => {
            sortingState.value = resolveUpdater(updater, sortingState.value)
            emit('sort-change', sortingState.value)
        },
        pageCount: props.manualPagination ? props.pageCount : undefined,
        state: {
            get columnSizing() {
                return columnSizingState.value
            },
            get columnVisibility() {
                return visibilityState.value
            },
            get globalFilter() {
                return filterInputValue.value
            },
            get pagination() {
                return paginationState.value
            },
            get rowSelection() {
                return rowSelectionState.value
            },
            get sorting() {
                return sortingState.value
            }
        }
    }) as unknown as TableInstance
}

const getAriaSort = (header: TableHeader) => {
    if (!header.column.getCanSort()) return undefined

    const sort = header.column.getIsSorted()
    if (sort === 'asc') return 'ascending'
    if (sort === 'desc') return 'descending'
    return 'none'
}

const getSortIcon = (header: TableHeader) => {
    const sort = header.column.getIsSorted()
    if (sort === 'asc') return 'ChevronUp'
    if (sort === 'desc') return 'ChevronDown'
    return 'ChevronUpDown'
}

const getHeaderSlotName = (columnId: string) => `header-${columnId}`
const getCellSlotName = (columnId: string) => `cell-${columnId}`

const hasHeaderSlot = (columnId: string) => Boolean(slots[getHeaderSlotName(columnId)])
const hasCellSlot = (columnId: string) => Boolean(slots[getCellSlotName(columnId)])

const getWidthStyle = (width: number): CSSProperties => ({
    maxWidth: `${width}px`,
    minWidth: `${width}px`,
    width: `${width}px`
})

const getColumnWidthStyle = (columnId: string, width: number): CSSProperties => {
    if (columnId === '__selection' || columnId === '__expander') {
        return {
            maxWidth: '36px',
            minWidth: '36px',
            width: '36px'
        }
    }

    return getWidthStyle(width)
}

const getPinnedSide = (columnId: string, columnIndex: number): 'left' | 'right' | null => {
    const leftPinned = new Set(pinnedColumnsState.value.left)
    const rightPinned = new Set(pinnedColumnsState.value.right)

    if (columnId === '__expander' || columnId === '__selection') return 'left'
    if (columnId === '__actions') return 'right'
    if (props.stickyFirstColumn && columnIndex === 0) return 'left'
    if (leftPinned.has(columnId)) return 'left'
    if (rightPinned.has(columnId)) return 'right'

    return null
}

const getPinnedOffset = (columnId: string, side: 'left' | 'right') => {
    const columns = visibleLeafColumns.value
    const currentIndex = columns.findIndex(column => column.id === columnId)
    if (currentIndex === -1) return 0

    if (side === 'left') {
        return columns
            .slice(0, currentIndex)
            .filter((column, index) => getPinnedSide(column.id, index) === 'left')
            .reduce((total, column) => total + column.getSize(), 0)
    }

    return columns
        .slice(currentIndex + 1)
        .filter((column, index) => getPinnedSide(column.id, currentIndex + index + 1) === 'right')
        .reduce((total, column) => total + column.getSize(), 0)
}

const getPinnedStyle = (columnId: string, columnIndex: number): CSSProperties => {
    const side = getPinnedSide(columnId, columnIndex)
    if (!side) return {}

    return {
        [side]: `${getPinnedOffset(columnId, side)}px`
    }
}

const updateHorizontalOverflow = () => {
    const container = tableScrollContainerRef.value
    if (!container) return

    hasHorizontalOverflow.value = container.scrollWidth > container.clientWidth + 1
}

const getPinState = (columnId: string): PinSide | null => {
    if (pinnedColumnsState.value.left?.includes(columnId)) return 'left'
    if (pinnedColumnsState.value.right?.includes(columnId)) return 'right'
    return null
}

const setColumnPin = (columnId: string, side: PinSide | null) => {
    const nextPinnedColumns: PinnedColumns = {
        left: (pinnedColumnsState.value.left ?? []).filter(id => id !== columnId),
        right: (pinnedColumnsState.value.right ?? []).filter(id => id !== columnId)
    }

    if (side) {
        nextPinnedColumns[side] = [...(nextPinnedColumns[side] ?? []), columnId]
    }

    pinnedColumnsState.value = nextPinnedColumns
    emit('pinned-columns-change', nextPinnedColumns)
}

const clearPinnedColumns = () => {
    const nextPinnedColumns = {
        left: [],
        right: []
    }

    pinnedColumnsState.value = nextPinnedColumns
    emit('pinned-columns-change', nextPinnedColumns)
}

const setTableSize = (nextSize: TableSize) => {
    sizeState.value = nextSize
    emit('size-change', nextSize)
}

const setAllColumnsVisible = (value: boolean) => {
    if (!value) {
        const visibleHideableColumns = manageableColumns.value.filter(item => item.canHide && item.column.getIsVisible())
        const [firstVisibleColumn] = visibleHideableColumns

        visibleHideableColumns.forEach((item, index) => {
            item.column.toggleVisibility(index === 0 && firstVisibleColumn ? true : false)
        })
        return
    }

    manageableColumns.value.forEach(({ canHide, column }) => {
        if (!canHide) return
        column.toggleVisibility(value)
    })
}

const canToggleColumnVisibility = (item: { canHide: boolean; column: TableColumn | InternalColumn }) => {
    if (!item.canHide) return false
    if (!item.column.getIsVisible()) return true

    return visibleHideableColumnCount.value > 1
}

const handleColumnVisibilityToggle = (
    item: { canHide: boolean; column: TableColumn | InternalColumn },
    nextVisible: boolean
) => {
    if (!nextVisible && !canToggleColumnVisibility(item)) return

    item.column.toggleVisibility(nextVisible)
}

const getPinButtonClass = (columnId: string, side: PinSide | null) => {
    const isActive = getPinState(columnId) === side || (side === null && getPinState(columnId) === null)

    return isActive
        ? 'bg-blue-600 text-white dark:bg-blue-500'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
}

const getSizeButtonClass = (size: TableSize) =>
    sizeState.value === size
        ? 'bg-blue-600 text-white dark:bg-blue-500'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'

const getColumnStatusLabel = (columnId: string, isVisible: boolean) => {
    const pinState = getPinState(columnId)
    const isLastVisibleHideableColumn = manageableColumns.value.some(item =>
        item.column.id === columnId
        && item.canHide
        && isVisible
        && visibleHideableColumnCount.value === 1
    )
    const visibilityLabel = isLastVisibleHideableColumn
        ? 'Visible, required'
        : isVisible
            ? 'Visible'
            : 'Hidden'

    if (!pinState) return visibilityLabel

    return `${visibilityLabel}, pinned ${pinState}`
}

const getHeaderCellClass = (header: TableHeader, headerIndex: number) => {
    const classes = [
        headerSizeClasses[sizeState.value],
        props.stickyHeader ? 'sticky top-0 z-20 bg-gray-50 dark:bg-gray-900' : '',
        props.bordered ? 'border-r last:border-r-0 border-gray-200 dark:border-gray-800' : ''
    ]
    const pinnedSide = getPinnedSide(header.column.id, headerIndex)

    if (header.column.id === '__selection' || header.column.id === '__expander') {
        classes.push('w-9 min-w-9 max-w-9 px-1 text-center')
    }

    if (pinnedSide) {
        classes.push('sticky bg-gray-50 dark:bg-gray-900')
        classes.push(props.stickyHeader ? 'z-30' : 'z-20')
    }

    return classes
}

const getPinnedCellBackgroundClass = (row?: TableRow, rowIndex?: number) => {
    if (!row || rowIndex === undefined) return 'bg-white dark:bg-gray-950'
    if (row.getIsSelected()) return 'bg-blue-50 dark:bg-blue-950/30'

    const classes = []

    if (props.striped && rowIndex % 2 === 1) {
        classes.push('bg-gray-50/80 dark:bg-gray-900/60')
    } else {
        classes.push('bg-white dark:bg-gray-950')
    }

    if (props.hoverable && isRowInteractive(row)) {
        classes.push('group-hover:bg-blue-50/70 dark:group-hover:bg-blue-950/30')
    }

    return classes.join(' ')
}

const getBodyCellClass = (columnId: string, cellIndex: number, row?: TableRow, rowIndex?: number) => {
    const classes = [sizeClasses[sizeState.value]]
    const pinnedSide = getPinnedSide(columnId, cellIndex)

    if (columnId === '__selection' || columnId === '__expander') {
        classes.push('w-9 min-w-9 max-w-9 px-1 text-center')
    }

    if (columnId === '__actions') {
        classes.push('[&>*]:w-full [&>a]:justify-center [&>button]:justify-center')
    }

    if (props.bordered) {
        classes.push('border-r last:border-r-0 border-gray-200 dark:border-gray-800')
    }

    if (pinnedSide) {
        classes.push('sticky z-10')
        classes.push(getPinnedCellBackgroundClass(row, rowIndex))
    }

    return classes
}

const skeletonBarWidths = [
    ['w-11/12', 'w-7/12'],
    ['w-10/12', 'w-6/12'],
    ['w-9/12', 'w-5/12'],
    ['w-8/12', 'w-4/12']
] as const

const cardSkeletonLabelWidths = ['w-16', 'w-20', 'w-14', 'w-18'] as const

const getSkeletonBarWidthClass = (cellIndex: number, lineIndex: number) => {
    const widthSet = skeletonBarWidths[cellIndex % skeletonBarWidths.length]
    return widthSet[lineIndex] ?? widthSet[0]
}

const getCardSkeletonLabelWidthClass = (cellIndex: number) =>
    cardSkeletonLabelWidths[cellIndex % cardSkeletonLabelWidths.length]

const getRowClass = (row: TableRow, rowIndex: number) => {
    const classes = []

    if (props.striped && rowIndex % 2 === 1) {
        classes.push('bg-gray-50/80 dark:bg-gray-900/60')
    } else {
        classes.push('bg-white dark:bg-gray-950')
    }

    if (props.hoverable && isRowInteractive(row)) {
        classes.push('cursor-pointer hover:bg-blue-50/70 dark:hover:bg-blue-950/30')
    }

    if (row.getIsSelected()) {
        classes.push('bg-blue-50 dark:bg-blue-950/30')
    }

    return classes
}

const cardRowClass = (row: TableRow) => {
    const classes = []

    if (props.hoverable && isRowInteractive(row)) {
        classes.push('cursor-pointer hover:border-blue-300 hover:bg-blue-50/70 dark:hover:border-blue-800 dark:hover:bg-blue-950/30')
    }

    if (row.getIsSelected()) {
        classes.push('border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30')
    }

    return classes
}

const canRowExpand = (row: TableRow) => {
    if (!(props.expandableRows || hasExpandedRowSlot.value)) return false
    if (props.canExpandRow) return props.canExpandRow(row.original)
    return hasExpandedRowSlot.value
}

const isRowExpanded = (row: TableRow) => Boolean(expandedRowIds.value[row.id])

const toggleRowExpanded = (row: TableRow) => {
    if (!canRowExpand(row)) return

    expandedRowIds.value = {
        ...expandedRowIds.value,
        [row.id]: !expandedRowIds.value[row.id]
    }

    emit('row-expand-change', Object.keys(expandedRowIds.value).filter(key => expandedRowIds.value[key]))
}

const toggleSorting = (header: TableHeader, event: MouseEvent) => {
    header.column.toggleSorting(undefined, event.shiftKey)
}

const isInteractiveTarget = (event: MouseEvent | KeyboardEvent) => {
    const target = event.target as HTMLElement | null
    return Boolean(target?.closest('a, button, input, select, textarea, [role="button"], [role="menuitem"]'))
}

const isRowInteractive = (_row: TableRow) => props.rowSelection === 'single'

const handleRowSelection = (row: TableRow) => {
    if (props.rowSelection !== 'single') return
    const nextSelection = !row.getIsSelected()
    row.toggleSelected(nextSelection)
}

const handleRowInteraction = (row: TableRow, event: MouseEvent) => {
    if (isInteractiveTarget(event)) return
    handleRowSelection(row)
    emit('row-click', { event, row })
}

const handleRowKeydown = (row: TableRow, event: KeyboardEvent) => {
    if (isInteractiveTarget(event)) return
    handleRowSelection(row)
    emit('row-click', { event, row })
}

const setCurrentPage = (page: number) => {
    const nextPage = Math.max(0, page - 1)
    table.value?.setPageIndex(nextPage)
}

const setPageSize = (pageSize: number) => {
    table.value?.setPageSize(pageSize)
}

const getColumnHeadingLabel = (column: TableColumn | InternalColumn) => {
    const meta = (column.columnDef.meta ?? {}) as { cardLabel?: string; label?: string }
    const label = meta.label
    if (label) return label

    if (typeof column.columnDef.header === 'string') return column.columnDef.header

    return column.id
        .replace(/^__/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase())
}

const getCellLabel = (cell: TableCell | InternalCell) => {
    const meta = (cell.column.columnDef.meta ?? {}) as { cardLabel?: string; label?: string }
    const label = meta.cardLabel
    if (label) return label
    return getColumnHeadingLabel(cell.column)
}

watch(() => props.pageSize, (pageSize) => {
    paginationState.value = {
        ...paginationState.value,
        pageSize
    }
    table.value?.setPageSize(pageSize)
})

watch(() => props.columnVisibilityState, (nextValue) => {
    visibilityState.value = { ...nextValue }
}, { deep: true })

watch(() => props.columnSizing, (nextValue) => {
    columnSizingState.value = { ...nextValue }
}, { deep: true })

watch(() => props.pinnedColumns, (nextValue) => {
    pinnedColumnsState.value = {
        left: [...(nextValue.left ?? [])],
        right: [...(nextValue.right ?? [])]
    }
}, { deep: true })

watch(() => props.size, (nextValue) => {
    sizeState.value = nextValue
})

watch(() => props.pageCount, (nextPageCount) => {
    if (!props.manualPagination || !nextPageCount) return

    const maxPageIndex = Math.max(nextPageCount - 1, 0)
    if (paginationState.value.pageIndex > maxPageIndex) {
        paginationState.value = {
            ...paginationState.value,
            pageIndex: maxPageIndex
        }
    }
})

watch(filterInputValue, (value) => {
    if (filterDebounce.value) window.clearTimeout(filterDebounce.value)

    filterDebounce.value = window.setTimeout(() => {
        table.value?.setGlobalFilter(value)
        emit('filter-change', value)
    }, 300)
})

watch(
    [
        visibleLeafColumns,
        displayRows,
        columnSizingState,
        visibilityState,
        pinnedColumnsState,
        () => props.loading,
        () => effectiveMobileLayout.value
    ],
    async () => {
        await nextTick()
        updateHorizontalOverflow()
    },
    { deep: true }
)

onMounted(() => {
    initializeTable()

    nextTick(() => {
        updateHorizontalOverflow()

        if (typeof ResizeObserver !== 'undefined' && tableScrollContainerRef.value) {
            overflowResizeObserver = new ResizeObserver(() => updateHorizontalOverflow())
            overflowResizeObserver.observe(tableScrollContainerRef.value)
        }
    })
})

onBeforeUnmount(() => {
    if (filterDebounce.value) window.clearTimeout(filterDebounce.value)
    overflowResizeObserver?.disconnect()
})

defineExpose({
    table
})
</script>

<style scoped>
input[type="checkbox"]:checked {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

input[type="checkbox"]:indeterminate {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
</style>
