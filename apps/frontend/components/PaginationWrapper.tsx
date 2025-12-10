"use client";

import { Pagination } from "@project-template/ui";
import { useState } from "react";

export function PaginationWrapper() {
  const [page, setPage] = useState(1);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <Pagination
      currentPage={page}
      totalPages={10}
      onPageChange={handlePageChange}
    />
  );
}
