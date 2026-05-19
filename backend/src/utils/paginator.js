const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
};

const resolvePagination = ({
  page,
  limit,
  defaultPage = 1,
  defaultLimit = 10,
  maxLimit = 100
} = {}) => {
  const resolvedPage = toPositiveInt(page, defaultPage);
  const rawLimit = toPositiveInt(limit, defaultLimit);
  const resolvedLimit = Math.min(rawLimit, maxLimit);

  return {
    page: resolvedPage,
    limit: resolvedLimit,
    skip: (resolvedPage - 1) * resolvedLimit
  };
};

const buildPaginationMeta = ({ page, limit, total }) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
};

module.exports = {
  resolvePagination,
  buildPaginationMeta
};
