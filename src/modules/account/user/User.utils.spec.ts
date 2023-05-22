import { validateAuth0UserInput } from './User.utils';
import { Auth0UserInputDTO } from './dto/user.dto';
import { Auth0UserDetailType } from './User.types';

describe('User Handler unit test', () => {
  it('output object contains a address field', () => {
    const auth0UserInput: Auth0UserInputDTO = {
      firstName: 'Ali',
      lastName: 'Zaib',
      jobTitleId: '1',
      sellersPermitId: '7490327493240',
      phoneNumber: '+13227972978',
      website: '',
      address: {
        zipcode: '94118',
        address1: '14742 BLAINE AVE',
        address2: '',
        city: 'LOS ANGELES',
        country: 'US',
        state: 'CA',
        companyName: 'Test Teams Work',
        faxNumber: '',
        mobileNumber: '',
      },
      resaleCertificate: '',
      sellerPermitImage: '',
      stripeCustomerId: '',
    };

    const auth0UserOutput: Auth0UserDetailType =
      validateAuth0UserInput(auth0UserInput);

    expect(auth0UserOutput).toBeInstanceOf(Object);
    expect(auth0UserOutput).not.toEqual(auth0UserInput);
    expect(auth0UserOutput.user_metadata.address).toBeDefined();
  });

  it('output object should not contain a address field', () => {
    const auth0UserInput: Auth0UserInputDTO = {
      firstName: 'Ali',
      lastName: 'Zaib',
    };

    const auth0UserOutput: Auth0UserDetailType =
      validateAuth0UserInput(auth0UserInput);

    expect(auth0UserOutput).toBeInstanceOf(Object);
    expect(auth0UserOutput).not.toEqual(auth0UserInput);
    expect(auth0UserOutput?.user_metadata?.address).toBeUndefined();
  });
});
