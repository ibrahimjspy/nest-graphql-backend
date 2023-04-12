import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import { SuccessResponseType } from 'src/core/utils/response.type';
import { validateAuth0UserInput } from 'src/modules/account/user/User.utils';
import { Auth0UserInputDTO } from 'src/modules/account/user/dto/user.dto';
import * as AccountHandlers from 'src/graphql/handlers/account/user';
import Auth0Service from './auth0.service';


@Injectable()
export default class SaleorAuthService {
    private readonly logger = new Logger(Auth0Service.name);

    constructor(private auth0Service: Auth0Service){

    }

    public async updateUser(
        userInput: Auth0UserInputDTO,
        token: string,
    ): Promise<any> {
        try {
        const saleorUserInput = {
            firstName: userInput.firstName,
            lastName: userInput.lastName,
        };
        // update user info in saleor and auth0
        return await Promise.all([
            AccountHandlers.updateUserInfoHandler(saleorUserInput, token),
            this.auth0Service.updateUser(
            userInput.userAuth0Id,
            validateAuth0UserInput(userInput),
            ),
        ]);
        } catch (error) {
            this.logger.error(error);
        }
    }
}
