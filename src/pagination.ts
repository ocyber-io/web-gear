type PaginatePageType = {
    type: "page", index: number, key: number, active: boolean
}

type PaginateEllipsisType = {
    type: "ellipsis", key: number,
}

type PaginationItem = PaginatePageType | PaginateEllipsisType

interface PaginationConfig {
    itemsCount: number
    perPageItems: number
    currentPage: number
}

interface PaginationOptions {
    firstCount: number
    lastCount: number
    siblingsCount: number
}

export class Pagination {
    pages: PaginationItem[] = []
    isNext: boolean = false
    isPrevious: boolean = false

    private options: PaginationOptions = {
        firstCount: 2, lastCount: 2, siblingsCount: 1
    }

    constructor(private config: PaginationConfig, options?: Partial<PaginationOptions>) {
        if (options) {
            Object.assign(this.options, options)
        }
    }

    private get pageCount() {
        if (this.config.itemsCount > 0 && this.config.perPageItems > 0) {
            return Math.ceil(this.config.itemsCount / this.config.perPageItems)
        } else {
            return 0
        }
    }

    private get calculatePages() {
        const totalPages = this.pageCount
        const pages = new Set<number>()
        if (totalPages <= 1) {
            return []
        }

        // Display first pages
        for (let i = 1; i <= Math.min(this.options.firstCount, totalPages); i++) {
            pages.add(i)
        }

        // Display previous siblings
        const previousSiblingsStart = Math.max(1, this.config.currentPage - this.options.siblingsCount)
        for (let i = previousSiblingsStart; i < this.config.currentPage; i++) {
            pages.add(i)
        }

        // Display current page and next siblings
        for (let i = this.config.currentPage; i <= Math.min(this.config.currentPage + this.options.siblingsCount, totalPages); i++) {
            pages.add(i)
        }

        // Display last pages

        const previousSiblingsEnd = Math.max(totalPages - this.options.lastCount + 1, this.config.currentPage + this.options.siblingsCount + 1)
        for (let i = previousSiblingsEnd; i <= totalPages; i++) {
            pages.add(i)
        }
        return Array.from(pages).sort((a, b) => a - b)
    }

    updateOptions(options: PaginationOptions) {
        Object.assign(this.options, options)
    }

    updateConfig(config: PaginationConfig) {
        Object.assign(this.config, config)
    }

    generate() {
        const totalPages = this.pageCount
        this.pages = []

        if (totalPages <= 1) {
            this.isNext = false
            this.isPrevious = false
            return
        }

        const calculatedPages = this.calculatePages
        for (let i = 0, key = 0; i < calculatedPages.length; i++) {
            const currentItem = calculatedPages[i]
            if (i !== 0 && calculatedPages[i] !== calculatedPages[i - 1] + 1) {
                this.pages.push({
                    type: "ellipsis", key: key++
                })
            }
            this.pages.push({
                type: "page", index: currentItem, active: currentItem === this.config.currentPage, key: key++
            })
        }

        this.isNext = this.config.currentPage < totalPages && totalPages > 1
        this.isPrevious = this.config.currentPage > 1 && totalPages > 1
    }
}