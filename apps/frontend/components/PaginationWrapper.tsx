"use client";

import { Pagination } from "@project-template/ui";

export function PaginationWrapper() {
  const handlePageChange = (page: number) => {
    console.log("Navigating to page:", page);
  };

  return (
    <Pagination
      currentPage={1}
      totalPages={10}
      onPageChange={handlePageChange}
    />
  );
}
