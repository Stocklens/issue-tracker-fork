'use client'
import { generatePagination } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
import classNames from 'classnames';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

interface Prop {
    totalPages: number
}

const Pagination = ({ totalPages }: Prop) => {
    // Get pathname
    const pathname = usePathname();

    // Get current params
    const searchParams = useSearchParams();

    // get current page
    const currentPage = Number(searchParams.get('page')) || 1;

    // Get the paginations
    const allPaginatedPages = generatePagination(currentPage, totalPages);

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);

        // Set the page number
        params.set('page', pageNumber.toString());

        // return the new url
        return `${pathname}?${params.toString()}`;
    }

    return (
        <>
            <div className="inline-flex">
                <PaginationArrow
                    direction="left"
                    href={createPageURL(currentPage - 1)}
                    isDisabled={currentPage <= 1}
                />

                <div className="flex -space-x-px">
                    {allPaginatedPages.map((page, index) => {
                        let position: 'first' | 'last' | 'single' | 'middle' | undefined;

                        if (index === 0) position = 'first';
                        if (index === allPaginatedPages.length - 1) position = 'last';
                        if (allPaginatedPages.length === 1) position = 'single';
                        if (page === '...') position = 'middle';

                        return (
                            <PaginationNumber
                                key={page}
                                href={createPageURL(page)}
                                page={page}
                                position={position}
                                isActive={currentPage === page}
                            />
                        );
                    })}
                </div>

                <PaginationArrow
                    direction="right"
                    href={createPageURL(currentPage + 1)}
                    isDisabled={currentPage >= totalPages}
                />
            </div>
        </>
    )
}

/**
 * Pagination arrow design
 */
function PaginationArrow({
    href,
    direction,
    isDisabled,
}: {
    href: string;
    direction: 'left' | 'right';
    isDisabled?: boolean;
}) {
    const className = classNames({
        'flex h-10 w-10 items-center justify-center rounded-md border': true,
        'pointer-events-none text-gray-300': isDisabled,
        'hover:bg-gray-100': !isDisabled,
        'mr-2 md:mr-4': direction === 'left',
        'ml-2 md:ml-4': direction === 'right',
    });

    const icon =
        direction === 'left' ? (
            <ArrowLeftIcon className="w-4" />
        ) : (
            <ArrowRightIcon className="w-4" />
        );

    return isDisabled ? (
        <div className={className}>{icon}</div>
    ) : (
        <Link className={className} href={href}>
            {icon}
        </Link>
    );
}

/**
 * Pagination page number design
 */
function PaginationNumber({
    page,
    href,
    isActive,
    position,
}: {
    page: number | string;
    href: string;
    position?: 'first' | 'last' | 'middle' | 'single';
    isActive: boolean;
}) {
    const className = classNames({
        'flex h-10 w-10 items-center justify-center text-sm border': true,
        'rounded-l-md': position === 'first' || position === 'single',
        'rounded-r-md': position === 'last' || position === 'single',
        'z-10 bg-blue-600 border-blue-600 text-white': isActive,
        'hover:bg-gray-100': !isActive && position !== 'middle',
        'text-gray-300': position === 'middle',
    });

    return isActive || position === 'middle' ? (
        <div className={className}>{page}</div>
    ) : (
        <Link href={href} className={className}>
            {page}
        </Link>
    );
}

export default Pagination