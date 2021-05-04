/* eslint-disable react/prop-types */
import React from "react";

import { t, jt } from "ttag";
import Link from "metabase/components/Link";

import { Box, Flex } from "grid-styled";

import Search from "metabase/entities/search";

import Card from "metabase/components/Card";
import EmptyState from "metabase/components/EmptyState";
import SearchResult from "metabase/search/components/SearchResult";
import Subhead from "metabase/components/type/Subhead";

import { color } from "metabase/lib/colors";
import Icon from "metabase/components/Icon";
import NoResults from "assets/img/no_results.svg";
import PaginationControls from "metabase/components/PaginationControls";
import { usePagination } from "metabase/hooks/use-pagination";

const PAGE_PADDING = [1, 2, 4];

const PAGE_SIZE = 25;

const searchFilters = [
  {
    name: t`Dashboards`,
    filter: "dashboard",
    icon: "dashboard",
  },
  {
    name: t`Questions`,
    filter: "card",
    icon: "bar",
  },
  {
    name: t`Pulses`,
    filter: "pulse",
    icon: "pulse",
  },
  {
    name: t`Metrics`,
    filter: "metric",
    icon: "sum",
  },
  {
    name: t`Segments`,
    filter: "segment",
    icon: "segment",
  },
  {
    name: t`Collections`,
    filter: "collection",
    icon: "all",
  },
  {
    name: t`Tables`,
    filter: "table",
    icon: "table",
  },
];

export default function SearchApp({ location }) {
  const { handleNextPage, handlePreviousPage, setPage, page } = usePagination();

  const handleFilterChange = () => setPage(0);

  const query = {
    ...location.query,
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * page,
  };

  return (
    <Box mx={PAGE_PADDING}>
      {location.query.q && (
        <Flex align="center" py={[2, 3]}>
          <Subhead>{jt`Results for "${location.query.q}"`}</Subhead>
        </Flex>
      )}
      <Box>
        <Flex align="top">
          <Box w={2 / 3}>
            <Search.ListLoader query={query} wrapped>
              {({ list, total }) => {
                if (list.length === 0) {
                  return (
                    <Card>
                      <EmptyState
                        title={t`Didn't find anything`}
                        message={t`There weren't any results for your search.`}
                        illustrationElement={<img src={NoResults} />}
                      />
                    </Card>
                  );
                }
                return (
                  <React.Fragment>
                    <SearchResultSection items={list} />
                    <div className="flex justify-end my2">
                      <PaginationControls
                        showTotal
                        pageSize={PAGE_SIZE}
                        page={page}
                        itemsLength={5}
                        total={total}
                        onNextPage={handleNextPage}
                        onPreviousPage={handlePreviousPage}
                      />
                    </div>
                  </React.Fragment>
                );
              }}
            </Search.ListLoader>
          </Box>
          <Box ml={[1, 2]} pt={2} px={2}>
            <Link
              className="flex align-center"
              mb={3}
              color={!location.query.type ? color("brand") : "inherit"}
              to={{
                pathname: location.pathname,
                query: { ...location.query, type: null },
              }}
            >
              <Icon name="search" mr={1} />
              <h4>{t`All results`}</h4>
            </Link>
            {searchFilters.map(f => {
              let isActive = location && location.query.type === f.filter;
              if (!location.query.type && !f.filter) {
                isActive = true;
              }

              return (
                <Link
                  className="flex align-center"
                  mb={3}
                  onClick={handleFilterChange}
                  color={color(isActive ? "brand" : "text-medium")}
                  to={{
                    pathname: location.pathname,
                    query: { ...location.query, type: f.filter },
                  }}
                >
                  <Icon mr={1} name={f.icon} />
                  <h4>{f.name}</h4>
                </Link>
              );
            })}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

const SearchResultSection = ({ title, items }) => (
  <Card pt={2}>
    {items.map(item => {
      return <SearchResult result={item} />;
    })}
  </Card>
);
