import { DEFAULT_PAGE_SIZE } from 'src/constants';
import { PaginationDto } from '../dto/pagination.dto';

/**
 * If the user doesn't provide a filter, we'll default to the first page of results. If the user
 * provides a filter, we'll use that instead
 * @param {PaginationDto} filter - PaginationDto - This is the filter object that we're going to
 * validate.
 * @returns A string
 */
export const validatePageFilter = (filter: PaginationDto): string => {
  let pageFilter = ``;

  if (!filter.first && !filter.last) {
    pageFilter += `first: ${DEFAULT_PAGE_SIZE}`;
  } else if (filter.first) pageFilter += `first: ${filter.first}`;
  else if (filter.last) pageFilter += `last: ${filter.last}`;

  if (filter.before) pageFilter += `\nbefore: "${filter.before}"`;
  else if (filter.after) pageFilter += `\nafter: "${filter.after}"`;

  return pageFilter;
};
