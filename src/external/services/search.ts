import { Injectable, Logger } from '@nestjs/common';
import http from 'src/core/proxies/restHandler';
import { GetMoreLikeThisDto } from 'src/modules/product/dto/product.dto';
import {
  ELASTIC_SEARCH_ENDPOINT,
  MAPPING_SERVICE_HEADERS,
  PRODUCTS_SEARCH_ENGINE_NAME,
} from 'src/constants';
import { ElasticSearchProductsType } from 'src/modules/product/Product.types';

@Injectable()
export default class SearchService {
  private readonly logger = new Logger(SearchService.name);
  /**
   * @description - returns products that are identical against a given product id
   * @warn -- throws error if elastic search throws error
   * @depends -- on product categoryName, slug, description and product name for relevance
   */
  public async getMoreLikeThis(
    filter: GetMoreLikeThisDto,
  ): Promise<ElasticSearchProductsType> {
    const { productId, totalCount, page } = filter;
    const MORE_LIKE_THIS_FIELDS = [
      'category_names',
      'category_slugs',
      'description',
      'name',
    ];
    const FILTERS = JSON.stringify({
      query: {
        bool: {
          must_not: [
            {
              match: {
                _id: productId,
              },
            },
          ],
          must: [
            {
              more_like_this: {
                fields: MORE_LIKE_THIS_FIELDS,
                min_term_freq: 1,
                max_query_terms: 12,
                min_doc_freq: 5,
                like: [
                  {
                    _id: productId,
                  },
                ],
              },
            },
          ],
        },
      },
      from: page,
      size: totalCount,
    });

    const startTime = new Date().getTime(); // Record the start time

    try {
      this.logger.log('Fetching product mappings from Elasticsearch', FILTERS);

      const response = await http.post(
        `${ELASTIC_SEARCH_ENDPOINT}/api/as/v0/engines/${PRODUCTS_SEARCH_ENGINE_NAME}/elasticsearch/_search`,
        FILTERS,
        MAPPING_SERVICE_HEADERS,
      );

      const results = response?.data;

      const endTime = new Date().getTime(); // Record the end time
      const elapsedTime = endTime - startTime; // Calculate the elapsed time

      this.logger.log(`Product documents fetched in ${elapsedTime}ms`, FILTERS);

      return results;
    } catch (error) {
      this.logger.error(
        'Error while fetching product mappings from Elasticsearch',
        error,
      );

      throw error; // Rethrow the error to be handled at a higher level
    }
  }
}
